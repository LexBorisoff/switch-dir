#!/usr/bin/env node

import { addDirectory } from './quick-access/add-directory.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';

const { add } = args;

(async function main() {
  try {
    if (add != null) {
      await addDirectory(add);
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
