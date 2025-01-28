#!/usr/bin/env node

import { args } from './args.js';
import { addPortal } from './portals/add-portal.js';
import { configPortals } from './portals/config-portals.js';
import { selectDir } from './select-dir/index.js';
import { logger } from './utils/logger.js';
import { updateTmp } from './utils/update-tmp.js';

const { add, config } = args;

(async function main() {
  try {
    if (add != null) {
      await addPortal(add);
      return;
    }

    if (config) {
      await configPortals();
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
