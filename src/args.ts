import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from './config/get-config-data.js';
import { PACKAGE_VERSION } from './constants.js';

const group = {
  portals: 'Portal Options:',
  navigation: 'Navigation Options:',
};

const options = [
  'root',
  'portal',
  'select',
  'add',
  'remove',
  'prune',
  'rename',
] as const;

type Option = (typeof options)[number];

function noConflict(itself: Option, ...other: Option[]): Option[] {
  return options.filter(
    (option) => option !== itself && !other.includes(option),
  );
}

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [ARG]... [OPTION]...`)
  .usage(`Supercharged and interactive navigation between directories`)
  .option('root', {
    type: 'string',
    description: 'Root path to start from',
    alias: 'r',
    group: group.navigation,
    requiresArgs: true,
    conflicts: noConflict('root', 'select'),
  })
  .option('portal', {
    type: 'string',
    description: 'Portal directory to start from',
    alias: 'p',
    group: group.navigation,
    conflicts: noConflict('portal', 'select'),
  })
  .option('interactive', {
    type: 'boolean',
    description: 'Interactive directory selection',
    group: group.navigation,
    alias: 'i',
    conflicts: noConflict('select', 'root', 'portal'),
  })
  .option('add', {
    type: 'string',
    description: 'Add a directory path to portals',
    requiresArg: true,
    alias: 'a',
    group: group.portals,
    conflicts: noConflict('add'),
  })
  .option('config', {
    type: 'boolean',
    description: 'Manage portals configuration',
    alias: 'c',
    group: group.portals,
    conflicts: noConflict('remove'),
  })
  .help()
  .version(PACKAGE_VERSION)
  .hide('help')
  .hide('version')
  .parseSync();
