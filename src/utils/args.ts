import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';
import { PACKAGE_VERSION } from '../constants.js';

const group = {
  portals: 'Portal Options',
};

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [ARG]... [OPTION]...`)
  .usage(`Supercharged and interactive navigation between directories`)
  .option('add', {
    type: 'string',
    description: 'Add a directory path to portals',
    alias: 'a',
    requiresArg: true,
    group: group.portals,
    conflicts: ['remove', 'prune'],
  })
  .option('remove', {
    type: 'string',
    description: 'Remove a directory from portals',
    alias: 'r',
    group: group.portals,
    conflicts: ['add', 'prune'],
  })
  .option('prune', {
    type: 'boolean',
    description: 'Remove unreachable paths from portals',
    alias: 'p',
    group: group.portals,
    conflicts: ['add', 'remove'],
  })
  .help()
  .version(PACKAGE_VERSION)
  .hide('help')
  .hide('version')
  .parseSync();
