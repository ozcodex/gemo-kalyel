const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const playerInfo = {
  name: '',
  currentRoom: 'tst_0',
};

readline.question('Kiu estas vi? ', name => {
  console.log('Saluton ' + name + '!');
  playerInfo.name = name;
  readline.close();
});
