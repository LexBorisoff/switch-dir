import { CONFIG_FILE } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { fallbackConfig } from './fallback-config.js';

import type { ConfigInterface } from '../types/config.types.js';

export function getConfigData(): ConfigInterface {
  const configFile = useCoreHooks((root) => root[CONFIG_FILE]);

  try {
    const raw = configFile.read();
    const parsed = raw != null ? JSON.parse(raw) : fallbackConfig;
    return { ...fallbackConfig, ...parsed };
  } catch {
    return fallbackConfig;
  }
}
