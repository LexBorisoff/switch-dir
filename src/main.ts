#!/usr/bin/env node

import { args } from './args.js';
import { renameCommand } from './create-app/rename-command.js';
import { addPortal } from './portals/add-portal.js';
import { deletePortals } from './portals/delete-portals.js';
import { listPortals } from './portals/list-portals.js';
import { selectDir } from './select-dir/index.js';
import { logger } from './utils/logger.js';
import { updateTmp } from './utils/update-tmp.js';

(async function main() {
  try {
    if (args.add != null) {
      await addPortal(args.add);
      return;
    }

    if (args.list) {
      void listPortals();
      return;
    }

    if (args.remove) {
      await deletePortals();
      return;
    }

    if (args.rename != null) {
      await renameCommand(args.rename);
      return;
    }

    const dir = await selectDir();

    if (dir != null) {
      updateTmp(dir);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
