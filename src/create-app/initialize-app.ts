import fs from 'node:fs';

import { createTree, FileTree } from '@lexjs/filetree';
import { coreActions } from '@lexjs/filetree/actions';

import { npmCommands, npmActions } from '../actions/npm-actions.js';
import { initialTree } from '../actions/tree.js';
import { CONFIG_FILE, IS_DEV, PACKAGE_NAME } from '../constants.js';
import { paths } from '../paths.js';
import { getPackageInfo } from '../utils/get-package-info.js';

function ensureNamespace(): void {
  const fileTree = new FileTree(paths.namespace, {});
  if (!fs.existsSync(paths.namespace)) {
    createTree(fileTree);
  }
}

export async function initializeApp(): Promise<void> {
  const fileTree = new FileTree(paths.root, initialTree);
  ensureNamespace();
  createTree(fileTree);

  // create config file
  const useCore = fileTree.use(coreActions);
  const rootDir = useCore((root) => root);
  if (!rootDir.exists(CONFIG_FILE)) {
    rootDir.createFile(CONFIG_FILE, '');
  }

  // install package (link in development)
  const version = IS_DEV ? '' : getPackageInfo().version!;
  const pkg = version !== '' ? `${PACKAGE_NAME}@${version}` : PACKAGE_NAME;

  const npmCommand = IS_DEV ? npmCommands.link : npmCommands.install;
  const useNpm = fileTree.use(npmActions);
  await useNpm(({ lib }) => lib)[npmCommand]([pkg]);
}
