import { args } from '../utils/args.js';

import { traverseArgs } from './traverse-args.js';
import { traverseSelect } from './traverse-select.js';
import { getPortalPath } from './utils/get-portal-path.js';

const { _, root, portal, interactive } = args;

export async function selectDir(): Promise<string | undefined> {
  let directory: string | undefined = undefined;
  let currentDir = root ?? process.cwd();

  if (portal != null) {
    const portalPath = await getPortalPath(portal);
    if (portalPath == null) {
      return undefined;
    }

    currentDir = portalPath;
  }

  const dirArgs = _.map((arg) => `${arg}`);

  if (dirArgs.length > 0) {
    directory = await traverseArgs(currentDir, dirArgs);
    if (directory == null) {
      return undefined;
    }

    return interactive ? await traverseSelect(directory) : directory;
  }

  return await traverseSelect(currentDir);
}
