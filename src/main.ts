#!/usr/bin/env node

import { selectDir } from './directory/select-dir.js';
import { updateTmp } from './update-tmp.js';
import { logger } from './utils/logger.js';

(async function main() {
  try {
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
