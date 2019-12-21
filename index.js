const roomsList = require('./map.json')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// This Object carries the Player Info
const playerInfo = {
  name: null,
  currentRoom: 'tst_0',
  inventary: {},
};

// This Object have all the available items
const itemsList = {
  scr_0: {
    name: 'Pergamino',
    use: () => {
      console.log('Bonvena aventuristo');
    },
  },
};

const availableCommands = {
  helpi: help,
  movigxi: move,
  eliri: endGame,
  cxirkauxrigardu: lookAround,
};

const availableDirections = {
  nordo: 'north',
  oriento: 'east',
  sudo: 'south',
  okcidento: 'west',
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
  console.log('Disponeblaj direktoj:');
  for (const command in availableDirections) {
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
  readline.question('kiu direkto vi volas prenu? ', input => {
    const direction = availableDirections[input];
    const room = roomsList[playerInfo.currentRoom];
    if (direction && room[direction]) {
      playerInfo.currentRoom = room[direction];
      where();
    } else {
      console.log('Ne estas vojo en tio direkto!');
    }
    main();
  });
}

function lookAround() {
  const room = roomsList[playerInfo.currentRoom];
  if (room.items.length > 0) {
    for (const item of room.items) {
      console.log('Estas ' + itemsList[item].name + ' en tiu ĉambro!');
    }
  } else {
    console.log('Estas neniuj eroj en tiu ĉambro!');
  }
  main();
}

function endGame() {
  console.log('Adiaŭ!');
  readline.close();
}
