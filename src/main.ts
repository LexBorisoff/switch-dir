#!/usr/bin/env node

import { args } from './args.js';
import { addPortal } from './portals/add-portal.js';
import { deletePortals } from './portals/delete-portals.js';
import { listPortals } from './portals/list-portals.js';
import { selectDir } from './select-dir/index.js';
import { logger } from './utils/logger.js';
import { updateTmp } from './utils/update-tmp.js';

const { list, add, delete: remove } = args;

(async function main() {
  try {
    if (add != null) {
      await addPortal(add);
      return;
    }

    if (list) {
      void listPortals();
      return;
    }

    if (remove) {
      await deletePortals();
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
