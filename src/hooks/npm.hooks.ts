import { $, ExecaError } from 'execa';
import { FsHooks } from 'fs-hooks';

import { logger } from '../utils/logger.js';

export const npmCommands = {
  install: 'install',
  link: 'link',
} as const;

const dirHooks = FsHooks.dirHooks((targetDir) => ({
  async [npmCommands.install](deps: string[]) {
    const currentDir = process.cwd();
    process.chdir(targetDir.path);

    try {
      await $`npm i ${deps.join(' ')}`;
    } catch (error) {
      if (error instanceof Error || error instanceof ExecaError) {
        logger.error(error.message);
      }

      process.chdir(currentDir);
    }
  },
  async [npmCommands.link](deps: string[]) {
    const currentDir = process.cwd();
    process.chdir(targetDir.path);

    try {
      await Promise.all(deps.map((dependency) => $`npm link ${dependency}`));
    } catch (error) {
      if (error instanceof Error || error instanceof ExecaError) {
        logger.error(error.message);
      }

      process.chdir(currentDir);
    }
  },
}));

export const npmHooks = {
  dir: dirHooks,
} as const;
