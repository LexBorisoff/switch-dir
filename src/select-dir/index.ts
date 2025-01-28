import { args } from '../utils/args.js';

import { traverseArgs } from './traverse-args.js';
import { traverseSelect } from './traverse-select.js';
import { getPortalPath } from './utils/get-portal-path.js';

const { _, root, portal, interactive } = args;
const dirArgs = _.map((arg) => `${arg}`);

export async function selectDir(): Promise<string | undefined> {
  // select in current result
  if (dirArgs.length === 0 && root == null && portal == null) {
    return await traverseSelect(process.cwd());
  }

  let finalPath: string | undefined = undefined;
  let rootPath = root ?? process.cwd();

  // root directory is a portal
  if (portal != null) {
    const portalPath = await getPortalPath(portal);

    if (portalPath == null) {
      return undefined;
    }

    rootPath = portalPath;
  }

  // construct path based on provided args
  if (dirArgs.length > 0) {
    finalPath = await traverseArgs(rootPath, dirArgs);

    if (finalPath == null) {
      return undefined;
    }
  }

  // prompt directory selection
  if (interactive) {
    // traverse using finalPath if it was built with args
    finalPath = await traverseSelect(finalPath ?? rootPath);

    if (finalPath == null) {
      return undefined;
    }
  }

  return finalPath ?? rootPath;
}
