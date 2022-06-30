import 'dotenv/config';
import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';
import { getRandomEmoji, DiscordRequest } from './utils.js';


//Gateway client
const client = new Client({intents: [Intents.FLAGS.GUILDS]});


//custom IDs for interactions below (can also just pass strings)
const Interactions = {
  START_BUTTON: 'start',
  DISMISS_BUTTON: 'dismiss'
}

//map games, including character name, channel IDs, etc.
let gameStates = {};

client.once('ready', () => {
  //Gateway connection is active
  console.log('ready');
});


//Handles application commands
client.on('interactionCreate', async (interaction) => {
  console.log('Interaction received: ', interaction);
  //Return if it's not a command
  if (!interaction.isCommand()) return;
  const { commandName, user } interaction;
  
  if (commandName == 'game') {
    const characterName = interaction.options.getString('character');
    //Saves their choice of character name
    gameStates[user.id] = {
      name: characterName,
    };
    
    const row = new MessageActionRow().addComponents (
    )
  }
}

