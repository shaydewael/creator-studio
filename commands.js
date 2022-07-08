import 'dotenv/config';

import { DiscordRequest } from './utils.js';

//Command payloads
const LOOK_COMMAND = {
  name: 'look',
  description: 'Look at current room',
  type: 1
};

const TAKE_COMMAND = {
  name: 'take',
  description: 'Place an item in your inventory',
  type: 1
};

const GO_COMMAND = {
  name: 'go',
  description: 'Move to a different room',
  type: 1
};

const USE_COMMAND = {
  name: 'use',
  description: 'Use an item from inventory or in current room',
  type: 1
};

const INVENTORY_COMMAND = {
  name: 'inventory',
  description: 'List items in your inventory',
  type: 1
};

async function installCommands(...commands) {
  const installCommandEndpoint = '/applications/${process.env.APP_ID}/commands';
  
  for (let c of commands) {
    //install command
    try {
      await DiscordRequest(installCommandEndpoint, {
        method: 'POST',
        body: c,
      });
      console.log('${c.name} command installed');
    } catch (err) {
        console.error('Error installing command: ', err);
    }
  }
}

//pass in any new commands you want to install
installCommands(LOOK_COMMAND, TAKE_COMMAND, GO_COMMAND, USE_COMMAND, INVENTORY_COMMAND);