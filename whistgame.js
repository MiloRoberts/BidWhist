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
  socket.on('take kitty', takeKitty);

}

function playerConnected(user_id){
  users.identifyUser(user_id, socket.id);
  io.emit('players', users.getPlayers());
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
    round.playCard(user_id, card_id);
    //emit table update to everyone
    io.emit('table top', round.getTable());
    //update user's hand
    socket.emit('hand', round.getHand(user_id));
}

function unPlayCard(user_id){
    round.unplayCard(user_id);
    //emit table update to everyone
    io.emit('table top', round.getTable());
    //update user's hand
    socket.emit('hand', round.getHand(user_id));
}

function takeKitty(user_id){
    kitty_cards = round.takeKitty(user_id);

    //emit users's hand which now includes the kitty
    socket.emit('hand', round.getHand(user_id));
    //emit table update to everyone
    io.emit('table top', round.getTable());
}
