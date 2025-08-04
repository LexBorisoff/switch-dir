import { portals } from '../config/portals.js';
import { colors, logger } from '../utils/logger.js';

const sorted = Object.keys(portals.all).sort((a, b) => b.length - a.length);
const reachable = Object.entries(portals.reachable);
const unreachable = Object.entries(portals.unreachable);

export function listPortals(): void {
  if (Object.keys(portals.all).length === 0) {
    logger.error(`No portals created`);
    return;
  }

  function whitespace(portalName: string): string {
    const longestKey = sorted[0].length;
    const minFill = 4;
    const fill = '.'.repeat(longestKey - portalName.length + minFill);
    return ' ' + colors.gray(fill) + ' ';
  }

  function displayPortal(isReachable: boolean) {
    return function ([key, value]: [key: string, value: string]) {
      const portalName = colors.yellow(key);
      const unreachableStr = `${colors.red(value)} ${colors.gray('(unreachable)')}`;
      const portalPath = isReachable ? value : unreachableStr;
      logger.log(`${portalName}${whitespace(key)}${portalPath}`);
    };
  }

  if (reachable.length > 0) {
    reachable.forEach(displayPortal(true));

    if (unreachable.length > 0) {
      logger.log('');
    }
  }

  if (unreachable.length > 0) {
    unreachable.forEach(displayPortal(false));
  }
}
