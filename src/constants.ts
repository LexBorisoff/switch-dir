import os from 'node:os';

import { getProjectInfo } from './utils/get-project-info.js';

const NODE_ENV = process.env.NODE_ENV;

export const IS_DEV = NODE_ENV === 'development' || NODE_ENV === 'dev';
export const IS_WINDOWS = os.platform() === 'win32';

export const PACKAGE_NAME = getProjectInfo().name!;
export const PACKAGE_VERSION = getProjectInfo().version!;

export const INITIAL_COMMAND = 'sd';
export const CONFIG_FILE = 'config.json';
export const BASH_START_FILE = 'start.sh';
