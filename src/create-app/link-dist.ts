import fs from 'node:fs';

import { IS_WINDOWS, PACKAGE_NAME, PATHS } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';

export function linkDist(): void {
  const distPath = useCoreHooks(
    ({ lib }) => lib.node_modules[PACKAGE_NAME].dist,
  ).getPath();

  if (fs.existsSync(PATHS.DIST_LINK)) {
    fs.rmSync(PATHS.DIST_LINK, { force: true, recursive: true });
  }
  fs.symlinkSync(distPath, PATHS.DIST_LINK, IS_WINDOWS ? 'junction' : 'dir');
}
