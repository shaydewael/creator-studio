import 'dotenv/config';
import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';
import {
  getRandomEmoji,
  DiscordRequest,
  GetCurrentGame,
  SaveCurrentGame,
  GetRoom,
} from './utils.js';
// import your game file
import { MyGame } from './game.js';

//Gateway client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// You could use a JSON object instead if you wanted to but I think a map is easier
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
export const ActiveGames = new Map();

/**
 * Description of current room
 * @param game Current game for user
 * @returns Text description of current room
 */
function look(game) {
  const roomId = game.room;
  const currentRoom = GetRoom(roomId);

  const roomText = `__You are in **${currentRoom.name}**__
${currentRoom.desc}`;

  // Send message with description
  return roomText;
}

/**
 * Lists inventory for user
 * @param game Current game for user
 * @returns Embed of inventory list for user
 */
function inventory(game) {
  /*
   * items is an array of item objects
   * [{ name: 'item name', desc: 'item desc' }]
   */
  const currentItems = game.items;
  let inventoryText = '';

  let inventoryEmbed = {
    title: 'Your items',
    description: "You currently don't have any items",
  };

  for (let item of currentItems) {
    inventoryText.concat(`**${item.name}**: ${item.desc}\n`);
  }

  // If the user has items, then add the item list that was created in the for loop
  if (currentItems.length !== 0) {
    inventoryEmbed.description = inventoryText;
  }

  return inventoryEmbed;
}

/**
 * Get directions for current room and turn them into buttons
 * @param game Current game for user
 * @returns Component that's a row of buttons
 */
function go(game) {
  const roomId = game.room;
  const currentRoom = GetRoom(roomId);
  // TODO: i think one row can only have three directions
  let buttonRow = new MessageActionRow();

  for (let exit of currentRoom.exits) {
    // Create button
    let button = new MessageButton()
      .setCustomId('GO_'+exit.id)
      .setLabel(exit.dir)
      .setStyle('PRIMARY');
    // Add button
    buttonRow.addComponents(button);
  }

  return buttonRow;
}

/**
 * Go to new room
 * @param game Current game for user
 * @param userId Current user
 * @param roomId Selected room ID
 * @returns Saved game
 */
function goToRoom(game, userId, roomId) {
  game.room = roomId;
  // Save new room
  SaveCurrentGame(userId, game);

  return game;
}

/**
 * Take an item
 * @param game Current game for user
 * @param item Selected item
 */
function take(game, item) {}

/**
 * Use an item
 * @param game Current game for user
 * @param item Selected item
 */
function use(game, item) {}

// Handles commands
client.on('interactionCreate', async (interaction) => {
  //Return if it's not a command
  if (!interaction.isCommand()) return;
  console.log('Command received: ', interaction);

  const { commandName, user } = interaction;
  const currentGame = GetCurrentGame(user.id);

  switch (commandName) {
    case 'look':
      // Get room description
      const roomText = look(currentGame);
      // Reply to command
      await interaction.reply({
        content: roomText,
      });
      break;
    case 'inventory':
      // Get current inventory
      const currentInventory = inventory(currentGame);
      // Reply to command with an embed
      await interaction.reply({
        embeds: [currentInventory],
      });
      break;
    case 'go':
      const currentDirections = go(currentGame);
      // Reply with buttons
      // ephemeral means only that person will see the message
      await interaction.reply({
        content: 'Pick a direction to go',
        components: [currentDirections],
        ephemeral: true
      });
      break;
    case 'take':
      break;
    // add select menu
    case 'use':
      break;
    // add select menu
  }
});

// Handles buttons
client.on('interactionCreate', async (interaction) => {
  //return if it's not a button
  if (!interaction.isButton()) return;
  console.log('Button received: ', interaction);

  // Custom ID is the new room ID
  const { customId, user } = interaction;
  const currentGame = GetCurrentGame(user.id);

  // this was created from go()
  if (customId.startsWith('GO_')) {
    // remove "GO_"
    const newRoomId = customId.slice(3);
    // Go to room!
    const updatedGame = goToRoom(currentGame, user.id, newRoomId);
    // Get room description
    const roomText = look(updatedGame);
    // Reply to command
    await interaction.reply({
      content: roomText
    });
  } else {
    await interaction.reply({
      content: 'hmmm not a valid room'
    })
  }
});

client.once('ready', () => {
  // Connection to your app is ready
  console.log('app is ready to go');
});

//initiates connection to gateway
client.login(process.env.BOT_TOKEN);
