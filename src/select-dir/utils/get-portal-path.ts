import $_ from '@lexjs/prompts';

import { portals as portalGroups } from '../../config/portals.js';
import { colors } from '../../utils/logger.js';

import { suggestMatch } from './suggest-match.js';

function getFilterFn(portalArg: string) {
  return function ([key]: [key: string, value: string]) {
    const a = portalArg.toLowerCase();
    const k = key.toLowerCase();
    return a !== '' && (k === a || k.includes(a));
  };
}

export async function getPortalPath(
  portalArg: string,
): Promise<string | undefined> {
  const { reachable: portals } = portalGroups;

  // exact match
  if (portalArg !== '' && portals[portalArg] != null) {
    return portals[portalArg];
  }

  const matchedPortals = Object.entries(portals).filter(getFilterFn(portalArg));

  // single match
  if (matchedPortals.length === 1) {
    return matchedPortals[0][1];
  }

  // multiple or no matches
  const hasMatches = matchedPortals.length > 1;
  const matchesMessage = hasMatches
    ? `Portal argument ${colors.yellow(portalArg)} matches multiple names`
    : `Portal argument ${colors.red(portalArg)} does not match any name`;

  const choices = Object.entries(portals).map(([key, value]) => ({
    title: key,
    value: key,
    description: value,
  }));

  const { selected } = await $_.autocomplete({
    name: 'selected',
    message: portalArg === '' ? `Select portal` : matchesMessage,
    choices,
    suggest(input: string | number, list) {
      const inputStr = `${input}`;
      let inputArr: string[] = [];

      if (hasMatches || inputStr !== '') {
        inputArr = inputStr === '' ? [portalArg] : inputStr.split(/\s+/);
      }

      return Promise.resolve(
        list.filter(({ value }) => inputArr.every(suggestMatch(value))),
      );
    },
  });

  if (selected == null) {
    return undefined;
  }

  return portals[selected];
}
