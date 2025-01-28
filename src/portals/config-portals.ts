import $_ from '@lexjs/prompts';

import { listPortals } from './list-portals.js';

import type { Choice } from '../types/choice.types.js';

enum Option {
  List = 'list',
  Remove = 'remove',
  Prune = 'prune',
}

const choices: Choice<Option>[] = [
  {
    title: 'List',
    description: 'List portals',
    value: Option.List,
  },
  {
    title: 'Remove',
    description: 'Remove portals',
    value: Option.Remove,
  },
  {
    title: 'Prune',
    value: Option.Prune,
    description: 'Remove unreachable portals',
  },
];

export async function configPortals(): Promise<void> {
  const { option } = await $_.select({
    name: 'option',
    message: 'Select a config option',
    choices,
  });

  if (option === Option.List) {
    listPortals();
    return;
  }
}
