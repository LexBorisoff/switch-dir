import path from 'node:path';

import $_ from '@lexjs/prompts';

import { args } from '../utils/args.js';

import { getDirNames } from './get-dir-names.js';

import type { Choice } from '@lexjs/prompts/lib';

const { _ } = args;

function getDirChoices(dirPath: string): Choice[] {
  const map = (value: string): Choice => {
    const description = path.resolve(dirPath, value);
    return { value, title: value, description };
  };

  const choices: Choice[] = getDirNames(dirPath).map(map);
  return ['.', '..'].map(map).concat(choices);
}

function getMatchFn(dirName: string) {
  return (value: string) => dirName.toLowerCase().includes(value.toLowerCase());
}

export async function selectDir(): Promise<string | undefined> {
  const selectedDirs: string[] = [];
  const currentDir = _.length > 0 ? path.resolve(`${_[0]}`) : process.cwd();

  let aborted = false;

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
          list.filter(({ value }) => inputArr.every(getMatchFn(value))),
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

    selectedDirs.push(selected);
    await traverse(path.resolve(parentPath, selected));
  }

  await traverse();
  return aborted ? undefined : path.resolve(currentDir, ...selectedDirs);
}
