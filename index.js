const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// This Object carries the Player Info
const playerInfo = {
  name: null,
  currentRoom: 'tst_0',
};

// This Object have all the available rooms
const roomsList = {
  tst_0: {
    type: null,
    name: 'Testaĉambro Nulo',
    north: null,
    east: 'tst_1',
    south: null,
    west: null,
    items: {},
  },
  tst_1: {
    type: null,
    name: 'Testaĉambro Unu',
    north: null,
    east: null,
    south: null,
    west: 'tst_0',
    items: {},
  },
};

const availableCommands = {
  helpi: help,
  movigxi: move,
  eliri: endGame,
};

function main() {
  readline.question('kion vi volas fari? ', command => {
    const action = availableCommands[command];
    if (action) {
      action();
    } else {
      console.log(playerInfo.name + ' ne komprenas!');
      main();
    }
  });
}

// This function shows the available commands
function help() {
  console.log('Disponeblaj komandoj:');
  for (const command in availableCommands) {
    console.log(' - ' + command);
  }
  main();
}

// Entry Point, where everything starts
readline.question('Kiu estas vi? ', name => {
  console.log('Saluton ' + name + '!');
  playerInfo.name = name;
  where();
  main();
});

// This function prints the current position of player
function where() {
  const name = playerInfo.name;
  const room = roomsList[playerInfo.currentRoom];
  console.log(name + ' estas en la ĉambro ' + room.name);
}

//this function moves the player in the given direction
function move() {
  readline.question('kiu direkto vi volas prenu? ', direction => {
    //TODO: validate input
    const room = roomsList[playerInfo.currentRoom];
    if (room[direction]) {
      playerInfo.currentRoom = room[direction];
      where();
    } else {
      console.log('Ne estas vojo en tio direkto!');
    }
    main();
  });
}

function endGame() {
  console.log('Adiaŭ!');
  readline.close();
}
