import $_ from '@lexjs/prompts';

import { INITIAL_COMMAND } from '../constants.js';

export async function getCommandName(): Promise<string | undefined> {
  const { command } = await $_.text({
    name: 'command',
    message: 'What should be the command name?',
    initial: INITIAL_COMMAND,
  });

  return command;
}
