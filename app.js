import 'dotenv/config';
import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';
import { getRandomEmoji, DiscordRequest } from './utils.js';


//Gateway client
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

// You could use a JSON object instead if you wanted to but I think a map is easier
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
const activeGames = new Map();

//custom IDs for interactions below (can also just pass strings)
const Interactions = {
  START_BUTTON: 'start',
  DISMISS_BUTTON: 'dismiss'
};

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
  const { commandName, user } = interaction;
  
  if (commandName == 'game') {
    const characterName = interaction.options.getString('character');
    //Saves their choice of character name
    gameStates[user.id] = {
      name: characterName,
    };
    
    const row = new MessageActionRow().addComponents (
      new MessageButton()
        .setCustomId(Interactions.START_BUTTON)
        .setLabel('Start Game')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomID(Interactions.DISMISS_BUTTON)
        .setLabel('Dismiss')
        .setStyle('SECONDARY')
    );

    //just for fun, in utils.js
    const randomEmoji = getRandomEmoji();
    const messageText = "Let's start playing! " + randomEmoji;
    
    
    //responding to interactions
    await interaction.reply({ content: messageText, components: [row]});
    
  }
});



//handles buttons
client.on('interactionCreate', async(interaction) => {
  //return if it's not a button
  if(!interaction.isButton()) return;
  
  const{ customId, user } = interaction;
  
  if (customId = Interactions.START_BUTTON) {
    const characterName = gameStates[user.id].name;
    
    //creates channel
    const createChannelEndpoint = '/guilds/${process.env.GUILD_ID}/channels';
    
    //handle errors from the DiscordAPI, *likely build this in
    try {
      //the method is in the REST API verb
      let guildResponse = await DiscordRequest(createChannelEndpoint, {
        method: 'POST',
        body: {
          name: 'game-${characterName}',
          type: 0,
          topic: 'Test channel for ${characterName}',
      },
    });
    guildResponse = await guildResponse.json();
    console.log('Channel Created: ', guildResponse);
      
    const gameChannelID = guildResponse.id;
    gameStates[user.id].channel = gameChannelID;
      
    //empty components array removes buttons
    //message formatting doc
    await interaction.update({
      content: 'Game tstarting in <#${gameChannelID}>',
      components: [],
    });
      
      //create message in channel
      const createMessageEndpoint = '/channels/${gameChannelID}/messages';
      
      //posts in new channel
  let msgResponse = await DiscordRequest(createMessageEndpoint, {
      method: 'POST',
      body: {
      content: 'just startin a game in here',
      },                  
  });
      
  msgResponse = await msgResponse.json();
    
  console.log('Posted message: ', msgResponse);
  } catch (e) {
    console.log('Error starting game: ', e);
  }
       
} else if (customId == Interactions.DISMISS_BUTTON) {
  await interaction.update({ content: 'No game, ok ok', components: [] });
}

});




//initiates connection to gateway
client.login(process.env.BOT_TOKEN);
    
      


          

