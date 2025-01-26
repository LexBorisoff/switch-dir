import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { PACKAGE_VERSION } from '../constants.js';

export const args = yargs(hideBin(process.argv))
  .help()
  .version(PACKAGE_VERSION)
  .hide('help')
  .hide('version')
  .parseSync();
