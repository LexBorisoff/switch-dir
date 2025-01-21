import { BASH_START_FILE, CONFIG_FILE, PACKAGE_NAME } from '../constants.js';
import { bashStartScript } from '../create-app/script-contents.js';

import type { TreeInterface } from 'fs-hooks';

export const initialTree = {
  bin: {},
  lib: {},
  tmp: {
    directory: '',
  },
  [BASH_START_FILE]: bashStartScript,
} satisfies TreeInterface;

export const tree = {
  ...initialTree,
  [CONFIG_FILE]: '',
  lib: {
    node_modules: {
      [PACKAGE_NAME]: {
        dist: {},
      },
    },
  },
} satisfies TreeInterface;
