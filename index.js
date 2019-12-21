const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const playerInfo = {
  name: '',
  currentRoom: 'tst_0',
};

const roomsList = {
  tst_0: {
    type: '',
    id: '',
    north: '',
    east: '',
    south: '',
    west: '',
    items: {},
  },
}

readline.question('Kiu estas vi? ', name => {
  console.log('Saluton ' + name + '!');
  playerInfo.name = name;
  where()
  readline.close();
});

function where(){
  console.log(playerInfo.name + " estas en la ĉambro " + playerInfo.currentRoom)
}

;
