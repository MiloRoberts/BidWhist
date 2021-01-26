var io;
var socket;
var users = require('./lib/users')
var round = require('./lib/round')
//var scores = [0,0];
//var dealer = 0;
var trick_count = [0,0];

var debug = false;

exports.initGame = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;
  round.initRound();

  socket.on('identify', playerConnected);
  socket.on('disconnect', playerExit);
  //socket.on('chat message', sendChat);
  socket.on('set name', setName);
  socket.on('new round', nextRound);
  socket.on('new game', newGame);
  socket.on('play card', playCard);
  socket.on('unplay card', unPlayCard);

}

function playerConnected(user_id){
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
  //TODO: look up user by socket.id
  //users.disconnectUser(user_id);
}

function setName(user_id, name){
  users.setName(user_id, name);
  //console.log('message: ' + msg);

  io.emit('players', users.getPlayers());
    //TODO: fix this to not send IDs;
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
    //round.sendHands();
    players = users.getPlayers();
    for(p in players){
      console.log(" player " + p);
      console.log(players[p]);
        let player = players[p];
        let s = io.sockets.sockets.get(player['socket'])
        if(s){
            console.log("emmitting player " + p + " hand");
            s.emit('hand', round.getHand(player['id']));
        }
    }

    //TODO send hands
    io.emit('table top', round.getTable());
    //round.sendTableTop();
    //send each player their hand
    //TODO
}

function playCard(user_id, card_id){
    console.log(card_id  +' ' + user_id);
    round.playCard(user_id, card_id);
    io.emit('table top', round.getTable());
    socket.emit('hand', round.getHand(user_id));
    //round.sendTableTop();
    //send each player their hand
}
function unPlayCard(user_id){
    round.unplayCard(user_id);
    io.emit('table top', round.getTable());
    socket.emit('hand', round.getHand(user_id));
    //send each player their hand
}
