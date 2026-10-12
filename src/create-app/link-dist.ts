import fs from 'node:fs';

import { useCoreActions } from '../actions/core-actions.js';
import { IS_WINDOWS, PACKAGE_NAME } from '../constants.js';
import { paths } from '../paths.js';

export function linkDist(): void {
  const distPath = useCoreActions(
    ({ lib }) => lib.node_modules[PACKAGE_NAME].dist,
  ).getPath();

  if (fs.existsSync(paths.distLink)) {
    fs.rmSync(paths.distLink, { force: true, recursive: true });
  }
  fs.symlinkSync(distPath, paths.distLink, IS_WINDOWS ? 'junction' : 'dir');
}
