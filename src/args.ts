import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from './config/get-config-data.js';
import { PACKAGE_VERSION } from './constants.js';

const group = {
  portals: 'Portal Options:',
  navigation: 'Navigation Options:',
  config: 'Config Options:',
};

enum Option {
  Root = 'root',
  Portal = 'portal',
  Interactive = 'interactive',
  List = 'list',
  Add = 'add',
  Delete = 'delete',
  Rename = 'rename',
}

function noConflict(itself: Option, ...other: Option[]): Option[] {
  return Object.values(Option).filter(
    (option) => option !== itself && !other.includes(option),
  );
}

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [ARG]... [OPTION]...`)
  .usage(`Fast and interactive navigation between directories`)
  .option(Option.Portal, {
    type: 'string',
    description: 'Portal directory to switch to / start from',
    alias: 'p',
    group: group.navigation,
    conflicts: noConflict(Option.Portal, Option.Interactive),
  })
  .option(Option.Root, {
    type: 'string',
    description: 'Root path to switch to / start from',
    alias: 'r',
    group: group.navigation,
    requiresArgs: true,
    conflicts: noConflict(Option.Root, Option.Interactive),
  })
  .option(Option.Interactive, {
    type: 'boolean',
    description: 'Interactive directory selection',
    group: group.navigation,
    alias: 'i',
    conflicts: noConflict(Option.Interactive, Option.Root, Option.Portal),
  })
  .option(Option.Add, {
    type: 'string',
    description: 'Add a portal directory',
    requiresArg: true,
    alias: 'a',
    group: group.portals,
    conflicts: noConflict(Option.Add),
  })
  .option(Option.List, {
    type: 'boolean',
    description: 'List portal directories',
    alias: 'l',
    group: group.portals,
    conflicts: noConflict(Option.List),
  })
  .option(Option.Delete, {
    type: 'boolean',
    description: 'Delete portal directories',
    alias: 'd',
    group: group.portals,
    conflicts: noConflict(Option.Delete),
  })
  .option(Option.Rename, {
    type: 'string',
    description: 'Rename the command',
    group: group.config,
    conflicts: noConflict(Option.Rename),
  })
  .help()
  .version(PACKAGE_VERSION)
  .hide('help')
  .hide('version')
  .parseSync();
