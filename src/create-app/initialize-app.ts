import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { CONFIG_FILE, IS_DEV, PACKAGE_NAME, PATHS } from '../constants.js';
import { npmCommands, npmHooks } from '../hooks/npm.hooks.js';
import { initialTree } from '../hooks/tree.js';

export async function initializeApp(): Promise<void> {
  const fsHooks = new FsHooks(PATHS.ROOT, initialTree);
  createTree(fsHooks);

  // create config file
  const useCore = fsHooks.useHooks(coreHooks);
  const rootDir = useCore((root) => root);
  if (!rootDir.exists(CONFIG_FILE)) {
    rootDir.fileCreate(CONFIG_FILE, '');
  }

  // install package (link in development)
  const npmCommand = IS_DEV ? npmCommands.link : npmCommands.install;
  const useNpm = fsHooks.useHooks(npmHooks);
  await useNpm(({ lib }) => lib)[npmCommand]([PACKAGE_NAME]);
}
