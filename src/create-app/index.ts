#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import 'dotenv/config';

import { updateConfig } from '../config/update-config.js';
import { INITIAL_COMMAND } from '../constants.js';

import { createScriptFiles } from './create-script-files.js';
import { initializeApp } from './initialize-app.js';
import { linkDist } from './link-dist.js';

(async function createApp(): Promise<void> {
  const { command } = await $_.text({
    name: 'command',
    message: 'What should be the command name?',
    initial: INITIAL_COMMAND,
  });

  if (command != null) {
    await initializeApp();
    linkDist();
    createScriptFiles(command);
    updateConfig({ command });
  }
})();
