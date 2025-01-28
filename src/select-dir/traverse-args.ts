import path from 'node:path';

import $_ from '@lexjs/prompts';

import { colors, logger } from '../utils/logger.js';

import { getDirChoices } from './utils/get-dir-choices.js';
import { getDirNames } from './utils/get-dir-names.js';
import { getFinalPath } from './utils/get-final-path.js';
import { suggestMatch } from './utils/suggest-match.js';

function filter(arg: string, exact = false) {
  return function (dir: string): boolean {
    const a = arg.toLowerCase();
    const d = dir.toLowerCase();
    return d === a || (!exact && d.includes(a));
  };
}

export async function traverseArgs(
  currentDir: string,
  dirArgs: string[],
): Promise<string | undefined> {
  let aborted = false;
  const dirNames: string[] = [];

  function getMatchedDirs(arg: string): string[] {
    const currentPath = path.resolve(currentDir, ...dirNames);
    const currentDirs = getDirNames(currentPath);
    return currentDirs.filter(filter(arg));
  }

  function hasNextPrompt(): boolean {
    const nextArg = dirArgs.at(dirNames.length);
    if (nextArg == null) {
      return false;
    }

    const { length } = getMatchedDirs(nextArg);
    return length === 0 || length > 1;
  }

  /**
   * Returns true if there is a next arg in dirArgs
   */
  function addDir(dir: string): boolean {
    dirNames.push(dir);
    return dirArgs.at(dirNames.length) != null;
  }

  async function traverse(): Promise<void> {
    let state = { aborted: false, exited: false };

    const currentArg = dirArgs.at(dirNames.length);
    if (currentArg == null) {
      return;
    }

    const currentPath = path.resolve(currentDir, ...dirNames);
    const matchedDirs = getMatchedDirs(currentArg);

    // single match
    if (matchedDirs.length === 1) {
      const hasNextArg = addDir(matchedDirs[0]);
      if (hasNextArg) {
        await traverse();
      }
      return;
    }

    // exact match
    const exactMatches = matchedDirs.filter(filter(currentArg, true));
    if (exactMatches.length === 1) {
      const hasNextArg = addDir(exactMatches[0]);
      if (hasNextArg) {
        await traverse();
      }
      return;
    }

    // multiple or no matches
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

    const hasNextArg = addDir(selected);
    if (hasNextArg && selected !== '.' && selected !== '..') {
      if (hasNextPrompt()) {
        logger.log('');
      }

      await traverse();
    }
  }

  await traverse();
  return aborted ? undefined : getFinalPath(currentDir, dirNames);
}
