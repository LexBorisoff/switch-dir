import { INITIAL_COMMAND } from '../constants.js';

import type { ConfigInterface } from '../types/config.types.js';

export const fallbackConfig: ConfigInterface = {
  command: INITIAL_COMMAND,
  quickAccess: {},
};
