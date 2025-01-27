import path from 'node:path';

import $_ from '@lexjs/prompts';

import { getDirChoices } from './utils/get-dir-choices.js';
import { getFinalPath } from './utils/get-final-path.js';
import { suggestMatch } from './utils/suggest-match.js';

export async function traverseSelect(
  currentDir: string,
): Promise<string | undefined> {
  let aborted = false;
  const dirNames: string[] = [];

  async function traverse(parentPath: string = currentDir): Promise<void> {
    let state = { aborted: false, exited: false };
    const choices = getDirChoices(parentPath);

    const { selected } = await $_.autocomplete({
      name: 'selected',
      message: path.basename(parentPath) || parentPath,
      choices,
      suggest(input: string | number, list) {
        const inputStr = `${input}`;
        const inputArr = inputStr.split(/\s+/);
        return Promise.resolve(
          list.filter(({ value }) => inputArr.every(suggestMatch(value))),
        );
      },
      onState(props) {
        state = props;
      },
    });

    if (selected == null) {
      aborted = state.aborted || state.exited;
      return;
    }

    if (selected === '.') {
      return;
    }

    dirNames.push(selected);
    await traverse(path.resolve(parentPath, selected));
  }

  await traverse();

  return aborted ? undefined : getFinalPath(currentDir, dirNames);
}
