import fs from 'node:fs';
import path from 'node:path';

import { FileTree } from '@lexjs/filetree';

import { useCoreActions } from '../actions/core-actions.js';
import { permissionsActions } from '../actions/permissions-actions.js';
import { tree } from '../actions/tree.js';
import { IS_WINDOWS } from '../constants.js';
import { paths } from '../paths.js';

import { getScriptNames } from './get-script-names.js';
import { bashFunction, powershellScript } from './script-contents.js';

export async function createScriptFiles(command: string): Promise<void> {
  const binDir = useCoreActions(({ bin }) => bin);
  const scriptNames = getScriptNames(command);
  const { bash, powershell } = scriptNames;

  // delete files that are not named based on the command
  const binFiles = fs.readdirSync(binDir.getPath());
  binFiles
    .filter((file) => {
      const filePath = path.resolve(binDir.getPath(), file);
      const isCommandFile = Object.values(scriptNames).includes(file);
      return fs.statSync(filePath).isFile() && !isCommandFile;
    })
    .forEach((file) => {
      binDir.deleteFile(file);
    });

  const fileTree = new FileTree(paths.root, tree);
  const usePermissions = fileTree.use(permissionsActions);
  const binPermissions = usePermissions(({ bin }) => bin);

  // create scripts files
  binDir.createFile(bash, bashFunction(command));
  await binPermissions.x(bash);

  if (IS_WINDOWS) {
    binDir.createFile(powershell, powershellScript);
    await binPermissions.x(powershell);
  }
}
