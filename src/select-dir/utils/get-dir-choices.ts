import path from 'node:path';

import { getDirNames } from './get-dir-names.js';

import type { Choice } from '@lexjs/prompts/lib';

export function getDirChoices(
  dirPath: string,
  withNav = true,
): Choice<string>[] {
  const toChoice = (value: string): Choice<string> => {
    const description = path.resolve(dirPath, value);
    return { value, title: value, description };
  };

  const choices: Choice<string>[] = getDirNames(dirPath).map(toChoice);
  return withNav ? ['.', '..'].map(toChoice).concat(choices) : choices;
}
