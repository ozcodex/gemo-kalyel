const words = require('./words.json');
const port = require('./server.json').port;
const io = require('socket.io-client');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
var map = require('./map.json');

var connected = false;
var socket;

// This Object carries the Player Info
var playerInfo = {
  name: null,
  currentRoom: map.default,
  inventory: ['scr_0'],
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
  inventaro: inventory,
  kaptuErojn: takeAllItems,
  konekti: connect,
};

const availableDirections = {
  nordo: 'north',
  oriento: 'east',
  sudo: 'south',
  okcidento: 'west',
};

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

// Main function, understood the commands
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

// ------------------------------------------- //
//                                             //
//                NETWORK PLAY                 //
//                                             //
// ------------------------------------------- //

function connect() {
  //regular expression to validate ip
  var rx = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
  readline.question('kiu estas la IP de la servilo? ', ip => {
    //TODO: check if the port is reachable
    if (!rx.test(ip)) {
      console.log('malvalida IP-adreso');
    } else {
      socket = io('http://' + ip + ':' + port);
      socket.on('connect', () => {
        connected = true;
        socket.emit('initialPlayerInfo', playerInfo);
      });
      //change the user info according to server's map
      socket.on('updatePlayerInfo', data => {
        playerInfo = data;
      });
      socket.on('updateMap', data => {
        map = data;
      });
    }
    main();
  });
}

// ----------- END NETWORK PLAY --------------- //

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
  const room = map.rooms[playerInfo.currentRoom];
  console.log(name + ' estas en la ' + room.type + ' ' + room.name);
}

// This function moves the player in the given direction
function move() {
  readline.question('kiu direkto vi volas prenu? ', input => {
    const direction = availableDirections[input];
    const room = map.rooms[playerInfo.currentRoom];
    if (direction && room.ways[direction]) {
      playerInfo.currentRoom = room.ways[direction];
      where();
    } else {
      console.log('Ne estas vojo en tio direkto!');
    }
    main();
  });
}

// This function shows all the objects present in the room
function lookAround() {
  where();
  const room = map.rooms[playerInfo.currentRoom];
  // Give a description about the available paths
  for (const direction in room.ways) {
    let target = room.ways[direction];
    if (target)
      console.log(
        'Estas ' +
          map.rooms[target].type +
          ' en ' +
          words[direction] +
          ' direckto',
      );
  }
  // Give a description about the items on the room
  if (room.items.length > 0) {
    for (const item of room.items) {
      console.log('Estas ' + itemsList[item].name + ' en tiu ĉambro!');
    }
  } else {
    console.log('Estas neniuj eroj en tiu ĉambro!');
  }
  main();
}

// This function shows all the objects present in the player's inventory
function inventory() {
  const inventory = playerInfo.inventory;
  if (inventory.length > 0) {
    for (const item of inventory) {
      console.log('Vi havas ' + itemsList[item].name + ' en via inventaro.');
    }
  } else {
    console.log('Vi ne havas artikolojn en via inventaro');
  }
  main();
}

// This function takes all items in the room and appends to player's inventory
function takeAllItems() {
  const room = map.rooms[playerInfo.currentRoom];
  if (room.items.length > 0) {
    for (const item of room.items) {
      playerInfo.inventory.push(item);
      console.log(playerInfo.inventory);
      console.log(room.items);
    }
    map.rooms[playerInfo.currentRoom].length = 0;
    console.log(room.items);
  }
}

function endGame() {
  if (connected) socket.disconnect();
  console.log('Adiaŭ!');
  readline.close();
}
