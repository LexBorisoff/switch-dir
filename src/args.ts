import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from './config/get-config-data.js';
import { PACKAGE_VERSION } from './constants.js';

const group = {
  portals: 'Portal Options:',
  navigation: 'Navigation Options:',
  config: 'Config Options:',
};

const options = [
  'root',
  'portal',
  'select',
  'add',
  'list',
  'delete',
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
  .usage(`Fast and interactive navigation between directories`)
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
    description: 'Add a portal directory',
    requiresArg: true,
    alias: 'a',
    group: group.portals,
    conflicts: noConflict('add'),
  })
  .option('list', {
    type: 'boolean',
    description: 'List portal directories',
    alias: 'l',
    group: group.portals,
    conflicts: noConflict('list'),
  })
  .option('delete', {
    type: 'boolean',
    description: 'Delete portal directories',
    alias: 'd',
    group: group.portals,
    conflicts: noConflict('delete'),
  })
  .option('rename', {
    type: 'string',
    description: 'Rename the command',
    group: group.config,
    conflicts: noConflict('rename'),
  })
  .help()
  .version(PACKAGE_VERSION)
  .hide('help')
  .hide('version')
  .parseSync();
