import path from 'node:path';

import { args } from '../utils/args.js';

import { traverseArgs } from './traverse-args.js';
import { traverseSelect } from './traverse-select.js';

const { _ } = args;

export async function selectDir(): Promise<string | undefined> {
  const currentDir = _.length > 0 ? path.resolve(`${_[0]}`) : process.cwd();
  const dirArgs = _.slice(1).map((arg) => `${arg}`);

  return dirArgs.length > 0
    ? await traverseArgs(currentDir, dirArgs)
    : await traverseSelect(currentDir);
}
