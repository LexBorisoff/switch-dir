import fs from 'node:fs';

import { getConfigData } from './get-config-data.js';

const { portals: configPortals } = getConfigData();

function sortPortals(
  portals: Record<string, string>,
  compareFn = (a: string, b: string) => a.localeCompare(b),
): Record<string, string> {
  const sortedNames = Object.keys(portals).sort(compareFn);
  return sortedNames.reduce<Record<string, string>>((acc, key) => {
    acc[key] = portals[key];
    return acc;
  }, {});
}

const all = sortPortals(configPortals);

function getReachablePortals(reachable = true): Record<string, string> {
  return Object.entries(all).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (fs.existsSync(value) === reachable) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
}

export const portals = {
  all,
  reachable: getReachablePortals(),
  unreachable: getReachablePortals(false),
};
