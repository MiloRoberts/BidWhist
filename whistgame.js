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
  //socket.on('chat message', sendChat);
  socket.on('set name', setName);
  socket.on('new round', nextRound);
  socket.on('new game', newGame);
  socket.on('pick card', pickCard);
  socket.on('unpick card', unpickCard);
  socket.on('play card', playCard);
  socket.on('unplay card', unplayCard);
  socket.on('take kitty', takeKitty);

}

function playerConnected(user_id){
  users.identifyUser(user_id, socket.id);
  sendGameStatus();
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
        players = users.getPlayers();
        for(p in players){
          //console.log(" player " + p);
          //console.log(players[p]);
            let player = players[p];
            let s = io.sockets.sockets.get(player['socket'])
            if(s){
                console.log("emmitting player " + p + " hand");
                s.emit('hand', round.getHand(player['id']));
            }
        }

        io.emit('table top', round.getTable());
    }

}

function pickCard(user_id, card_id){
    round.pickCard(user_id, card_id);
    //update user's hand
    socket.emit('hand', round.getHand(user_id));
}

function unpickCard(user_id, card_id){
    round.unpickCard(user_id, card_id);
    //update user's hand
    socket.emit('hand', round.getHand(user_id));
}

function playCard(user_id, card_id){
    round.playCard(user_id, card_id);
    //emit table update to everyone
    io.emit('table top', round.getTable());
    //update user's hand
    socket.emit('hand', round.getHand(user_id));
}

function unplayCard(user_id){
    round.unplayCard(user_id);
    //emit table update to everyone
    io.emit('table top', round.getTable());
    //update user's hand
    socket.emit('hand', round.getHand(user_id));
}

function takeKitty(user_id){
    kitty_cards = round.takeKitty(user_id);

    //emit table update to everyone
    io.emit('table top', round.getTable());

    //emit users's hand which now includes the kitty
    socket.emit('hand', round.getHand(user_id));
}
