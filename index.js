const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const playerInfo = {
  name: '',
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
};

readline.question('Kiu estas vi? ', name => {
  console.log('Saluton ' + name + '!');
  playerInfo.name = name;
  readline.close();
});
