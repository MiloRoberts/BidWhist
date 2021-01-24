var io;
var socket;
var users = require('./lib/users')
var deck = require('./lib/deck')
var user_id;

var debug = true;

exports.initGame = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;

  socket.on('identify', playerConnected);
  socket.on('disconnect', playerExit);
  //socket.on('chat message', sendChat);
  socket.on('set name', setName);
  socket.on('new round', newRound);

}

function playerConnected(userId){
  user_id = userId;
  users.identifyUser(user_id, socket.id);
  users.seatUser(user_id);
  /*console.log(users.getUsers())
    if(userId == users.getUsers()[1]['userId']){

        console.log(users.getUsers()[0]['socketId']);
        //console.log(io.sockets.sockets)
        var p1socket = io.sockets.sockets.get(users.getUsers()[0]['socketId']);
        p1socket.emit('chat message', 'Player 2 joined');
    }
    */
}

function playerExit() {
  console.log('user disconnected ' + socket.id);
  users.disconnectUser(user_id);
}

function setName(name){
  users.setName(user_id, name);
  //console.log('message: ' + msg);

  io.emit('players', users.getPlayers());
  //io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
}

function newRound(){
  deck.shuffle();
  if(debug){
      deck.log();
  }
}
