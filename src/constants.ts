import os from 'node:os';

import { getPackageInfo } from './utils/get-package-info.js';

const NODE_ENV = process.env.NODE_ENV;

export const IS_DEV = NODE_ENV === 'development' || NODE_ENV === 'dev';
export const IS_WINDOWS = os.platform() === 'win32';

export const PACKAGE_NAME = getPackageInfo().name!;
export const PACKAGE_NAMESPACE = PACKAGE_NAME.split('/')[0].substring(1);
export const APP_NAME = PACKAGE_NAME.split('/')[1];

export const PACKAGE_VERSION = getPackageInfo().version!;

export const INITIAL_COMMAND = 'sd';
export const CONFIG_FILE = 'config.json';
export const BASH_START_FILE = 'start.sh';
