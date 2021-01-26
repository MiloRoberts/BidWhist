var io;
var socket;
var users = require('./lib/users')
var round = require('./lib/round')
var user_id;
//var scores = [0,0];
//var dealer = 0;
var trick_count = [0,0];

var debug = false;

exports.initGame = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;
  round.initRound(io, socket);

  socket.on('identify', playerConnected);
  socket.on('disconnect', playerExit);
  //socket.on('chat message', sendChat);
  socket.on('set name', setName);
  socket.on('new round', nextRound);
  socket.on('new game', newGame);
  socket.on('play card', playCard);
  //socket.on('unplay card', unplayCard);

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
function newGame(){
    if(users.isGameFull()){
        //scores = [0,0];
        users.shuffleSeats(); //pick teams
        io.emit('players', users.getPlayers());
        //dealer=0;
        round.newRound();
        sendGameStatus();
    }
}
function nextRound(){
    round.newRound();
    sendGameStatus();
}


function sendGameStatus(){
    round.sendHands();
    //round.sendTableTop();
    //send each player their hand
    //TODO
}

function playCard(card_id){
    round.playCard(card_id, user_id);
    //round.sendTableTop();
    //send each player their hand
}
function unPlayCard(){
    round.unplayCard(user_id);
    io.emit('table top', round.getTable());
    //send each player their hand
}
