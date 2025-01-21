import { FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { PATHS } from '../constants.js';

import { tree } from './tree.js';

const fsHooks = new FsHooks(PATHS.ROOT, tree);

export const useCoreHooks = fsHooks.useHooks(coreHooks);
