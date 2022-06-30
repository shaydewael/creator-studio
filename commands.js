import 'dotenv/config';

import { DiscordRequest } from './utils.js';

//Command payloads 
const TEST_COMMAND = {
  name: 'test',
  description: 'oh man hope this works',
  type: 1,
};

//Options
const GAME_COMMAND = {
  name: 'game',
  description: 'Start game',
  options: [
    {
      type: 3,
      name: 'character',
      value: 'character',
      description: 'enter the name of your character',
      required: 'true',
    },
  ],
  type: 1,
};


async function istallCommands(...commands) {
  const installCommandEndpoint = '/applications/${process.env.APP_ID}/commands';
  
}