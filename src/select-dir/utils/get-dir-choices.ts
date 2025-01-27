import path from 'node:path';

import { getDirNames } from './get-dir-names.js';

import type { Choice } from '@lexjs/prompts/lib';

export function getDirChoices(dirPath: string, withNav = true): Choice[] {
  const toChoice = (value: string): Choice => {
    const description = path.resolve(dirPath, value);
    return { value, title: value, description };
  };

  const choices: Choice[] = getDirNames(dirPath).map(toChoice);
  return withNav ? ['.', '..'].map(toChoice).concat(choices) : choices;
}
