import fs from 'node:fs';
import path from 'node:path';

import $_ from '@lexjs/prompts';
import chalk from 'chalk';

import { getConfigData } from '../config/get-config-data.js';
import { updateConfig } from '../config/update-config.js';
import { logger } from '../utils/logger.js';

export async function addDirectory(dirArg: string): Promise<void> {
  const fullDirPath = path.resolve(dirArg);

  if (!fs.existsSync(fullDirPath)) {
    throw new Error('Provided directory does not exist');
  }

  const { portals } = getConfigData();

  const [existingName] =
    Object.entries(portals).find(
      ([, value]) => path.resolve(value) === fullDirPath,
    ) ?? [];

  let override = true;

  if (existingName != null) {
    const styledName = chalk.bold.italic.underline(existingName);
    logger.warn(`Provided directory is already added as ${styledName}`);

    const { answer } = await $_.toggle({
      name: 'answer',
      message: 'Rename it?',
    });

    if (answer == null) {
      return;
    }

    override = answer;
  }

  if (!override) {
    return;
  }

  const otherNames = Object.keys(portals).filter(
    (key) => existingName == null || key !== existingName,
  );

  const { dirName } = await $_.text({
    name: 'dirName',
    message: 'What should be the name for this directory',
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

    const sortedNames = Object.keys(updated).sort((a, b) => a.localeCompare(b));
    const sortedPortals = sortedNames.reduce<Record<string, string>>(
      (acc, key) => {
        acc[key] = updated[key];
        return acc;
      },
      {},
    );

    updateConfig({
      portals: sortedPortals,
    });
  }
}
