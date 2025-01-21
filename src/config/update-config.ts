import { CONFIG_FILE } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { getConfigData } from './get-config-data.js';

import type { ConfigInterface } from '../types/config.types.js';

type ConfigUpdaterFn = (config: ConfigInterface) => Partial<ConfigInterface>;

export function updateConfig(
  config: Partial<ConfigInterface> | ConfigUpdaterFn,
): void {
  const currentConfig = getConfigData();
  const payload = typeof config === 'function' ? config(currentConfig) : config;
  const updatedConfig: ConfigInterface = { ...currentConfig, ...payload };

  const configFile = useCoreHooks((root) => root[CONFIG_FILE]);
  configFile.write(JSON.stringify(updatedConfig));
}
