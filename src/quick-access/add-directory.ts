import fs from 'node:fs';
import path from 'node:path';

import $_ from '@lexjs/prompts';
import chalk from 'chalk';

import { getConfigData } from '../config/get-config-data.js';
import { updateConfig } from '../config/update-config.js';
import { args } from '../utils/args.js';
import { logger } from '../utils/logger.js';

const { force } = args;

export async function addDirectory(dirArg: string): Promise<void> {
  const fullDirPath = path.resolve(dirArg);

  if (!fs.existsSync(fullDirPath)) {
    throw new Error('Provided directory does not exist');
  }

  const { quickAccess } = getConfigData();

  const [existingName] =
    Object.entries(quickAccess).find(
      ([, value]) => path.resolve(value) === fullDirPath,
    ) ?? [];

  let override = true;

  if (existingName && !force) {
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

  const otherNames = Object.keys(quickAccess).filter(
    (key) => existingName == null || key !== existingName,
  );

  const { dirName } = await $_.text({
    name: 'dirName',
    message: 'Assign quick access name for this directory',
    validate(result) {
      return !otherNames.includes(result) || 'Name is already taken';
    },
  });

  if (dirName == null) {
    return;
  }

  if (existingName == null || existingName !== dirName) {
    const updated = {
      ...quickAccess,
      [dirName]: fullDirPath,
    };

    if (existingName != null) {
      delete updated[existingName];
    }

    updateConfig({
      quickAccess: updated,
    });
  }
}
