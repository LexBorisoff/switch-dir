import fs from 'node:fs';

import $_ from '@lexjs/prompts';

import { portals } from '../config/portals.js';
import { updateConfig } from '../config/update-config.js';
import { suggestMatch } from '../select-dir/utils/suggest-match.js';

import type { Choice } from '../types/choice.types.js';

enum DeleteOption {
  Delete = 'remove',
  Prune = 'prune',
}

const deleteChoices: Choice<DeleteOption>[] = [
  {
    title: 'Delete',
    value: DeleteOption.Delete,
    description: 'Select portals to delete',
  },
  {
    title: 'Prune',
    value: DeleteOption.Prune,
    description: 'Prune all unreachable portals',
  },
];

export async function deletePortals(): Promise<void> {
  let option = DeleteOption.Delete;
  const hasUnreachablePortals = Object.keys(portals.unreachable).length > 0;

  function prunePortals(deleteKeys?: string[]): void {
    const keys = deleteKeys ?? Object.keys(portals.unreachable);
    const updated = Object.entries(portals.all).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (!keys.includes(key)) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    updateConfig({ portals: updated });
  }

  if (hasUnreachablePortals) {
    const { deleteOption } = await $_.select({
      name: 'deleteOption',
      message: 'Select a delete option',
      choices: deleteChoices,
    });

    if (deleteOption == null) {
      return;
    }

    option = deleteOption;
  }

  if (option === DeleteOption.Prune) {
    prunePortals();
    return;
  }

  function checkReachable(portalName: string, portalPath: string): string {
    return fs.existsSync(portalPath)
      ? portalName
      : `${portalName} (unreachable)`;
  }

  const portalChoices: Choice<string>[] = Object.entries({
    ...portals.unreachable,
    ...portals.reachable,
  }).map(([key, value]) => ({
    title: checkReachable(key, value),
    value: key,
    description: value,
  }));

  const { deleteKeys } = await $_.autocompleteMultiselect({
    name: 'deleteKeys',
    message: 'Select portals to delete',
    choices: portalChoices,
    instructions: false,
    suggest(input: string | number, list) {
      const inputArr = `${input}`.split(/\s+/);
      return Promise.resolve(
        list.filter(({ value }) => inputArr.every(suggestMatch(value))),
      );
    },
  });

  if (deleteKeys == null) {
    return;
  }

  prunePortals(deleteKeys);
}
