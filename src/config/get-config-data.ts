import { CONFIG_FILE } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import { parseData } from '../utils/parse-data.js';

import { fallbackConfig } from './fallback-config.js';
import { resetConfig } from './reset-config.js';

import type { ConfigInterface } from '../types/config.types.js';

export function getConfigData(): ConfigInterface {
  const configFile = useCoreHooks((root) => root[CONFIG_FILE]);
  const raw = configFile.read();
  const parsed = parseData<ConfigInterface>(raw) ?? fallbackConfig;
  const { command } = parsed;

  // reset command to fallback
  if (typeof command !== 'string' || command === '') {
    parsed.command = fallbackConfig.command;
    resetConfig('command');
  }

  return { ...fallbackConfig, ...parsed };
}
