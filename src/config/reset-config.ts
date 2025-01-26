import { CONFIG_FILE } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import { parseData } from '../utils/parse-data.js';

import { fallbackConfig } from './fallback-config.js';

import type { ConfigInterface } from '../types/config.types.js';

export function resetConfig(key: keyof ConfigInterface): void {
  const rootDir = useCoreHooks((root) => root);
  if (!rootDir.exists(CONFIG_FILE)) {
    rootDir.fileCreate(CONFIG_FILE);
  }

  const configFile = useCoreHooks((root) => root['config.json']);
  const configData = configFile.read();
  const config = parseData<ConfigInterface>(configData) ?? fallbackConfig;

  configFile.write(JSON.stringify({ ...config, [key]: fallbackConfig[key] }));
}
