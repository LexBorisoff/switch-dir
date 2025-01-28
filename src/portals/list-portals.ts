import fs from 'node:fs';

import { getConfigData } from '../config/get-config-data.js';
import { colors, logger } from '../utils/logger.js';

export function listPortals(): void {
  const { portals } = getConfigData();

  const portalNames = Object.keys(portals).sort((a, b) => b.length - a.length);

  if (portalNames.length === 0) {
    logger.error(`No portals created`);
    return;
  }

  function whitespace(portalName: string): string {
    const longestKey = portalNames[0].length;
    const minFill = 4;
    const fill = '.'.repeat(longestKey - portalName.length + minFill);
    return ' ' + colors.gray(fill) + ' ';
  }

  function display(isBroken = false) {
    return function ([key, value]: [key: string, value: string]) {
      const portal = colors.yellow(key);
      const unreachable = `${colors.red(value)} ${colors.gray('(unreachable)')}`;
      const dir = isBroken ? unreachable : value;
      logger.log(`${portal}${whitespace(key)}${dir}`);
    };
  }

  const sortedByName = Object.entries(portals).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const existing = sortedByName.filter(([, dirPath]) => fs.existsSync(dirPath));
  const broken = sortedByName.filter(([, dirPath]) => !fs.existsSync(dirPath));

  if (existing.length > 0) {
    existing.forEach(display());

    if (broken.length > 0) {
      logger.log('');
    }
  }

  if (broken.length > 0) {
    broken.forEach(display(true));
  }
}
