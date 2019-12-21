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
    east: null,
    south: null,
    west: null,
    items: {},
  },
};

// Entry Point, where everything starts
readline.question('Kiu estas vi? ', name => {
  console.log('Saluton ' + name + '!');
  playerInfo.name = name;
  where();
  readline.close();
});

// This function prints the current position of player
function where() {
  const name = playerInfo.name;
  const room = roomsList[playerInfo.currentRoom];
  console.log(name + ' estas en la ĉambro ' + room.name);
}

//this function moves the player in the given direction
function move(direction){
  //TODO: validate input
  const room = roomsList[playerInfo.currentRoom];
  if (!room[direction]){
    console.log("Ne estas vojo en tio direkto")
    return
  }
  playerInfo.currentRoom = room[direction];
}
