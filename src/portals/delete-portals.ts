import fs from 'node:fs';

import $_ from '@lexjs/prompts';

import { getConfigData } from '../config/get-config-data.js';
import { updateConfig } from '../config/update-config.js';
import { suggestMatch } from '../select-dir/utils/suggest-match.js';

import { sortPortals } from './utils/sort-portalts.js';

import type { Choice } from '../types/choice.types.js';

const { portals } = getConfigData();

enum Option {
  Delete = 'remove',
  Prune = 'prune',
}

const deleteChoices: Choice<Option>[] = [
  {
    title: 'Delete',
    description: 'Select portals to delete',
    value: Option.Delete,
  },
  {
    title: 'Prune',
    value: Option.Prune,
    description: 'Prune all unreachable portals',
  },
];

function getPortals(existing: boolean): Record<string, string> {
  return Object.entries(portals).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (fs.existsSync(value) === existing) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
}

export async function deletePortals(): Promise<void> {
  let option = Option.Delete;

  const existingPortals = getPortals(true);
  const brokenPortals = getPortals(false);

  const hasUnreachablePortals = Object.keys(brokenPortals).length > 0;

  function prunePortals(deleteKeys?: string[]): void {
    const keys = deleteKeys ?? Object.keys(brokenPortals);
    const updated = Object.entries(portals).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (!keys.includes(key)) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    updateConfig({
      portals: sortPortals(updated),
    });
  }

  if (hasUnreachablePortals) {
    const { selected } = await $_.select({
      name: 'selected',
      message: 'Select a delete option',
      choices: deleteChoices,
    });

    if (selected == null) {
      return;
    }

    option = selected;
  }

  if (option === Option.Prune) {
    prunePortals();
    return;
  }

  function checkBroken(portalName: string, portalPath: string): string {
    return fs.existsSync(portalPath)
      ? portalName
      : `${portalName} (unreachable)`;
  }

  const portalChoices: Choice<string>[] = Object.entries({
    ...brokenPortals,
    ...existingPortals,
  }).map(([key, value]) => ({
    title: checkBroken(key, value),
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
