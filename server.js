const http = require('http').createServer();
const socket = require('socket.io')(http);
const serverInfo = require('./server.json');
const port = serverInfo.port;
const map = require(serverInfo.map);

const players = {};

//TODO add checksums
socket.on('connection', skt => {
  console.log('connected', skt.id);

  skt.on('initialPlayerInfo', playerInfo => {
    playerInfo.currentRoom = map.default;
    playerInfo.inventory = [];
    skt.emit('updatePlayerInfo', playerInfo);
    players[skt.id] = playerInfo;
    console.log(`received ${playerInfo.name}'s playerInfo`);
  });

  skt.on('get_room', cb => {
    let playerInfo = players[skt.id];
    let currentRoom = playerInfo.currentRoom;
    let room = map.rooms[currentRoom];
    cb(room);
  });

  skt.on('get_adjacent_rooms', cb => {
    let playerInfo = players[skt.id];
    let currentRoom = playerInfo.currentRoom;
    const room = map.rooms[currentRoom];
    let rooms = {};
    for (const direction in room.ways) {
      let target = room.ways[direction];
      if (target) {
        rooms[target] = map.rooms[target];
      }
    }
    cb(rooms);
  });

  skt.on('move', (direction, cb) => {
    let room = map.rooms[players[skt.id].currentRoom];
    if (direction && room.ways[direction]) {
      players[skt.id].currentRoom = room.ways[direction];
      cb();
    } else {
      cb('Ne estas vojo en tio direkto!');
    }
  });

  skt.on('msg', msg => {
    console.log('incoming msg:', msg);
  });
  skt.on('disconnect', evt => {
    players[skt.id] = undefined;
    console.log('disconnected', skt.id);
  });
});

socket.on('error', error => {
  console.log('ERROR', error);
});

http.listen(port, () =>
  console.log('la servilo aŭskultas sur la haveno:  ' + port),
);
