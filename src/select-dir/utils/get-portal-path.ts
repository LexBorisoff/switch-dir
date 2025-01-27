import $_ from '@lexjs/prompts';

import { getConfigData } from '../../config/get-config-data.js';
import { colors } from '../../utils/logger.js';

export async function getPortalPath(
  portalArg: string,
): Promise<string | undefined> {
  const { portals } = getConfigData();
  let portalPath = portals[portalArg];

  if (portalPath == null) {
    const matchedPortals = Object.entries(portals).filter(([key]) =>
      key.includes(portalArg),
    );

    if (matchedPortals.length === 1) {
      portalPath = matchedPortals[0][1];
    } else {
      const hasMatches = matchedPortals.length > 1;
      const message = hasMatches
        ? `Portal argument ${colors.yellow(portalArg)} matches multiple names`
        : `Portal argument ${colors.red(portalArg)} does not match any name`;

      const { selected } = await $_.autocomplete({
        name: 'selected',
        message,
        choices: Object.entries(portals).map(([key, value]) => ({
          title: key,
          value: key,
          description: value,
        })),
      });

      if (selected == null) {
        return undefined;
      }

      portalPath = portals[selected];
    }
  }

  return portalPath;
}
