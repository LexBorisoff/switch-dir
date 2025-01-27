#!/usr/bin/env node

import { addDirectory } from './portals/add-directory.js';
import { selectDir } from './select-dir/index.js';
import { updateTmp } from './update-tmp.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';

const { add } = args;

(async function main() {
  try {
    if (add != null) {
      await addDirectory(add);
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
