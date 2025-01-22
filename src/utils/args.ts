import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const group = {
  quickAccess: 'Quick Access Options',
};

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Supercharged and interactive navigation between directories`)
  .option('add', {
    type: 'string',
    description: 'Add a directory path to the quick access list',
    alias: 'a',
    requiresArg: true,
    group: group.quickAccess,
  })
  .option('remove', {
    type: 'string',
    description: 'Remove a saved directory from the quick access list',
    alias: 'r',
    group: group.quickAccess,
  })
  .option('reassign', {
    type: 'string',
    description: 'Reassign a quick access name to a new directory path',
    alias: 'R',
    requiresArg: true,
    group: group.quickAccess,
  })
  .option('prune', {
    type: 'boolean',
    description: 'Remove unreachable paths from the quick access list',
    alias: 'p',
    group: group.quickAccess,
  })
  .option('verbose', {
    type: 'boolean',
    alias: 'v',
    hidden: true,
  })
  .option('force', {
    type: 'boolean',
    alias: 'f',
    hidden: true,
    implies: ['add'],
  })
  .help()
  .version()
  .hide('help')
  .hide('version')
  .parseSync();
