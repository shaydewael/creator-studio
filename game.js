// This simple game disk can be used as a starting point to create a new adventure.
// Change anything you want, add new rooms, etc.
export const MyGame = {
  roomId: 'start', // Set this to the ID of the room you want the player to start in.
  rooms: [
    {
      id: 'start', // Unique identifier for this room. Entering a room will set the disk's roomId to this.
      name: 'The First Room', // Displayed each time the player enters the room.
      desc: `Describe how to play. you can use *asterisks*, **bold text**, __underline__, ~~strike through~~, or ~~**a combination**~~`, // Displayed when the player first enters the room.
      items: [
        {
          name: 'door',
          desc: 'It leads NORTH.', // Displayed when the player looks at the item.
        },
        {
          name: 'vines',
          desc: `They grew over the DOOR, blocking it from being opened.`,
        },
        {
          name: 'axe',
          desc: `You could probably USE it to cut the VINES, unblocking the door.`,
          isTakeable: true, // Allows the player to take the item.
        },
      ],
      exits: [
        {
          dir: 'north', // "dir" can be anything. If it's north, the player will type "go north" to get to the room called "A Forest Clearing".
          id: 'clearing',
          block: `The DOOR leading NORTH is overgrown with VINES.`, // If an exit has a block, the player will not be able to go that direction until the block is removed.
        },
      ],
    },
    {
      id: 'clearing',
      name: 'A Forest Clearing',
      desc: `It's a forest clearing. To the SOUTH is The First Room.`,
      exits: [
        {
          dir: 'south',
          id: 'start',
        },
      ],
    },
  ],
};
