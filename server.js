const http = require('http').createServer();
const socket = require('socket.io')(http);
const serverInfo = require('./server.json');
const port = serverInfo.port;
const map = require(serverInfo.map);

const players = {};

//TODO add checksums
socket.on('connection', skt => {
  console.log('connected', skt.id);
  skt.emit('updateMap', map);

  skt.on('initialPlayerInfo', playerInfo => {
    playerInfo.currentRoom = map.default;
    playerInfo.inventory = [];
    skt.emit('updatePlayerInfo', playerInfo);
    players[skt.id] = playerInfo;
    console.log(`received ${playerInfo.name}'s playerInfo`);
  });

  skt.on('msg', msg => {
    console.log('incoming msg:', msg);
  });
  skt.on('disconnect', evt => {
    console.log('disconnected', skt.id);
  });
});

socket.on('error', error => {
  console.log('ERROR', error);
});

http.listen(port, () =>
  console.log('la servilo aŭskultas sur la haveno:  ' + port),
);
