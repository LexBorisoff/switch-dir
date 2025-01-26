import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const group = {
  quickAccess: 'Quick Access Options',
};

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [ARG]... [OPTION]...`)
  .usage(`Supercharged and interactive navigation between directories`)
  .option('add', {
    type: 'string',
    description: 'Add a directory path to the quick access list',
    alias: 'a',
    requiresArg: true,
    group: group.quickAccess,
    conflicts: ['remove', 'prune'],
  })
  .option('remove', {
    type: 'string',
    description: 'Remove a directory from the quick access list',
    alias: 'r',
    group: group.quickAccess,
    conflicts: ['add', 'prune'],
  })
  .option('prune', {
    type: 'boolean',
    description: 'Remove unreachable paths from quick access',
    alias: 'p',
    group: group.quickAccess,
    conflicts: ['add', 'remove'],
  })
  .help()
  .version()
  .hide('help')
  .hide('version')
  .parseSync();
