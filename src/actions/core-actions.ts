import { FileTree } from '@lexjs/filetree';
import { coreActions } from '@lexjs/filetree/actions';

import { paths } from '../paths.js';

import { tree } from './tree.js';

const fileTree = new FileTree(paths.root, tree);

export const useCoreActions = fileTree.use(coreActions);
