import fs from 'node:fs';
import path from 'node:path';

import $_ from '@lexjs/prompts';
import chalk from 'chalk';

import { portals as portalGroups } from '../config/portals.js';
import { updateConfig } from '../config/update-config.js';
import { logger } from '../utils/logger.js';

export async function addPortal(dirArg: string): Promise<void> {
  const { all: portals } = portalGroups;
  const fullDirPath = path.resolve(dirArg);

  if (!fs.existsSync(fullDirPath)) {
    throw new Error('Provided directory does not exist');
  }

  const [existingName] =
    Object.entries(portals).find(
      ([, value]) => path.resolve(value) === fullDirPath,
    ) ?? [];

  let override = true;

  if (existingName != null) {
    const styledName = chalk.bold.italic.underline(existingName);
    logger.warn(`Provided directory is already added as ${styledName}`);

    const { rename } = await $_.toggle({
      name: 'rename',
      message: 'Rename it?',
    });

    if (rename == null) {
      return;
    }

    override = rename;
  }

  if (!override) {
    return;
  }

  const otherNames = Object.keys(portals).filter(
    (key) => existingName == null || key !== existingName,
  );

  logger.warn(fullDirPath);

  const { dirName } = await $_.text({
    name: 'dirName',
    message: 'Portal name',
    validate(input) {
      if (otherNames.includes(input)) {
        return 'Name is already taken';
      }

      return input !== '' || 'Invalid name';
    },
  });

  if (dirName == null) {
    return;
  }

  if (existingName == null || existingName !== dirName) {
    const updated = {
      ...portals,
      [dirName]: fullDirPath,
    };

    if (existingName != null) {
      delete updated[existingName];
    }

    updateConfig({ portals: updated });
  }
}
