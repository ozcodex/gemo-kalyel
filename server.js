const http = require('http').createServer();
const socket = require('socket.io')(http);
const port = require('./server.json').port;

socket.on('connection', skt => {
  console.log('connected');
  skt.send('Benvenu');
  skt.on('msg', msg => {
    console.log('iu diras:', msg);
  });
  skt.on('disconnect', evt => {
    console.log('disconnected');
  });
});

socket.on('error', error => {
  console.log('ERROR', error);
});

http.listen(port, () =>
  console.log('la servilo aŭskultas sur la haveno:  ' + port),
);
