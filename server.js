const http = require('http').createServer();
const socket = require('socket.io')(http);
const serverInfo = require('./server.json');
const port = serverInfo.port;
const map = require(serverInfo.map);

const players = {};

const log = (text, ...params) =>
  console.log(
    new Date().toLocaleTimeString() + ' - ' + text,
    params.length == 0 ? '' : params,
  );

//TODO add checksums
socket.on('connection', skt => {
  log('connected', skt.id);

  skt.on('initialPlayerInfo', playerInfo => {
    playerInfo.currentRoom = map.default;
    playerInfo.inventory = [];
    skt.emit('updatePlayerInfo', playerInfo);
    players[skt.id] = playerInfo;
    log(`received ${playerInfo.name}'s playerInfo`);
  });

  skt.on('get_room', cb => {
    let playerInfo = players[skt.id];
    let currentRoom = playerInfo.currentRoom;
    let room = map.rooms[currentRoom];
    room.id = currentRoom;
    room.players = []; //info about the players in the current room
    //add to room the info about the current players in that room
    for (const id in players) {
      //loop over the players to check if they are on the same room
      let player = players[id];
      if (id !== skt.id && player && player.currentRoom === currentRoom) {
        //avoid the current player, who is asking for the info
        room.players.push(player.name);
      }
    }
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

  skt.on('shout', msg => {
    let currentRoom = players[skt.id].currentRoom
    const room = map.rooms[currentRoom];
    skt.broadcast.emit('shout',currentRoom,room.ways);
  });

  skt.on('say', msg => {
    let currentRoom = players[skt.id].currentRoom
    let sender = players[skt.id].name
    //send the message to all the players on the same room
    for (const id in players) {
      let player = players[id];
      if (skt.id !== id){
        //avoid the same user
        //check if the player is in the speaker room
        if(player.currentRoom === currentRoom){
          socket.to(id).emit('msg',sender,msg)
        }
      }
    }
  });

  skt.on('msg', msg => {
    log('incoming msg:', msg);
  });

  skt.on('disconnect', evt => {
    let name = players[skt.id].name;
    players[skt.id] = undefined;
    log('disconnected', skt.id, name);
  });
});

socket.on('error', error => {
  console.log('ERROR', error);
});

http.listen(port, () =>
  console.log('la servilo aŭskultas sur la haveno:  ' + port),
);
