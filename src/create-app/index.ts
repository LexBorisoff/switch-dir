#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import chalk from 'chalk';
import 'dotenv/config';

import { updateConfig } from '../config/update-config.js';
import { CONFIG_FILE, PACKAGE_NAME } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import { logger } from '../utils/logger.js';
import { parseData } from '../utils/parse-data.js';

import { createScriptFiles } from './create-script-files.js';
import { getCommandName } from './get-command-name.js';
import { initializeApp } from './initialize-app.js';
import { linkDist } from './link-dist.js';

import type { ConfigInterface } from '../types/config.types.js';

function isEmpty(str: string | undefined): str is undefined | '' {
  return str == null || str === '';
}

(async function createApp(): Promise<void> {
  let command: string | undefined;

  // get current config data if exists
  const rootDir = useCoreHooks((root) => root);
  const configExists = rootDir.exists(CONFIG_FILE);

  if (configExists) {
    const configData = rootDir.fileRead(CONFIG_FILE);

    if (configData != null) {
      const config = parseData<ConfigInterface>(configData);
      command = config?.command;
    }
  }

  let renameCommand = false;
  if (!isEmpty(command)) {
    logger.warn(
      `${PACKAGE_NAME} command is set as ${chalk.underline(command)}\n`,
    );

    const { rename } = await $_.toggle({
      message: 'Do you want to rename it?',
      name: 'rename',
    });

    if (rename == null) {
      return;
    }

    renameCommand = rename;
  }

  if (isEmpty(command) || renameCommand) {
    const commandName = await getCommandName();

    if (commandName == null) {
      return;
    }

    command = commandName;
  }

  if (command != null) {
    await initializeApp();
    await createScriptFiles(command);
    linkDist();
    updateConfig({ command });
  }
})();
