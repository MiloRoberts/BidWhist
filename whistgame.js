var io;
var socket;
var users = require('./lib/users')
var round = require('./lib/round')
var scores = [0,0];
var game_started = false;

var debug = false;

exports.initGame = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;
  round.initRound();
  game_started = false;
  scores = [0,0];

  socket.on('identify', playerConnected);
  socket.on('disconnect', playerExit);
  socket.on('set name', setName);
  socket.on('new round', nextRound);
  socket.on('new game', newGame);
  socket.on('pick card', pickCard);
  socket.on('unpick card', unpickCard);
  socket.on('play card', playCard);
  socket.on('unplay card', unplayCard);
  socket.on('take kitty', takeKitty);
  socket.on('discard', discardKitty);

}

function playerConnected(user_id){
  users.identifyUser(user_id, socket.id);
  sendGameStatus();
}

function playerExit() {
  //console.log('user disconnected ' + socket.id);
  //users.disconnectUser(socket.id);
}

function setName(name){
  users.setName(socket.id, name);
  io.emit('players', users.getPlayers());
}
function newGame(){
    if(users.isGameFull()){
        game_started = true;
        scores = [0,0];
        users.shuffleSeats(); //pick teams
        io.emit('players', users.getPlayers());
        //dealer=0;
        round.newRound();
        sendGameStatus();
    }
}
function nextRound(){
    game_started = true;
    round.newRound();
    sendGameStatus();
}


function sendGameStatus(){
    io.emit('players', users.getPlayers());
    io.emit('game', {'started': game_started, 'score': scores});
    if(game_started){
        //send players their hands
        for(let [sock_id, sock_obj] of io.sockets.sockets){
            sock_obj.emit('hand', round.getHand(sock_id));
        }
        io.emit('table top', round.getTable());
    }

}

function pickCard(card_id){
    round.pickCard(socket.id, card_id);
    //update user's hand
    socket.emit('hand', round.getHand(socket.id));
}

function unpickCard(card_id){
    round.unpickCard(socket.id, card_id);
    //update user's hand
    socket.emit('hand', round.getHand(socket.id));
}

function playCard(card_id){
    round.playCard(socket.id, card_id);
    //emit table update to everyone
    io.emit('table top', round.getTable());
    //update user's hand
    socket.emit('hand', round.getHand(socket.id));
}

function unplayCard(){
    round.unplayCard(socket.id);
    //emit table update to everyone
    io.emit('table top', round.getTable());
    //update user's hand
    socket.emit('hand', round.getHand(socket.id));
}

function takeKitty(){
    kitty_cards = round.takeKitty(socket.id);

    //emit table update to everyone
    io.emit('table top', round.getTable());

    //emit users's hand which now includes the kitty
    socket.emit('hand', round.getHand(socket.id));
}

function discardKitty(){
    round.discardPicks(socket.id);

    //emit table update to everyone
    io.emit('table top', round.getTable());

    //emit users's hand which now includes the kitty
    socket.emit('hand', round.getHand(socket.id));
}
