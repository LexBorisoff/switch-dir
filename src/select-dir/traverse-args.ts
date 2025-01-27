import path from 'node:path';

import $_ from '@lexjs/prompts';

import { colors, logger } from '../utils/logger.js';

import { getDirChoices } from './utils/get-dir-choices.js';
import { getDirNames } from './utils/get-dir-names.js';
import { getFinalPath } from './utils/get-final-path.js';
import { suggestMatch } from './utils/suggest-match.js';

export async function traverseArgs(
  currentDir: string,
  dirArgs: string[],
): Promise<string | undefined> {
  let aborted = false;
  const dirNames: string[] = [];
  const hasNextArg = (): boolean => dirArgs[dirNames.length] != null;

  async function traverse(): Promise<void> {
    let state = { aborted: false, exited: false };

    const currentArg = dirArgs[dirNames.length];
    if (currentArg == null) {
      return;
    }

    const currentPath = path.resolve(currentDir, ...dirNames);
    const currentDirs = getDirNames(currentPath);
    const matchedDirs = currentDirs.filter((dir) => {
      const a = currentArg.toLowerCase();
      const d = dir.toLowerCase();
      return d === a || d.includes(a);
    });

    if (matchedDirs.length === 1) {
      dirNames.push(matchedDirs[0]);
      if (hasNextArg()) {
        await traverse();
      }
      return;
    }

    const hasMatches = matchedDirs.length > 0;

    const message = hasMatches
      ? `Argument ${colors.yellow.italic(
          currentArg,
        )} matches multiple directories in\n  ${colors.yellow(currentPath)}`
      : `Argument ${colors.red.italic(currentArg)} does not match any directory in\n  ${colors.red(
          currentPath,
        )}`;

    const choices = getDirChoices(currentPath, !hasMatches);

    const { selected } = await $_.autocomplete({
      name: 'selected',
      message,
      choices,
      suggest(input: string | number, list) {
        const inputStr = `${input}`;
        let inputArr: string[] = [];

        if (hasMatches || inputStr !== '') {
          inputArr = inputStr === '' ? [currentArg] : inputStr.split(/\s+/);
        }

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

    dirNames.push(selected);

    if (hasNextArg() && selected !== '.' && selected !== '..') {
      logger.log('');
      await traverse();
    }
  }

  await traverse();
  return aborted ? undefined : getFinalPath(currentDir, dirNames);
}
