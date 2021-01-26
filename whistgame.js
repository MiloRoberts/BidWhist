var io;
var socket;
var users = require('./lib/users')
var deck = require('./lib/deck')
var cardLib = require('./lib/card')
var user_id;
var player_hands = [[],[],[],[]];
var kitty = [];
//var scores = [0,0];
//var dealer = 0;
var tabled_cards = [null, null, null, null];
var trick_count = [0,0];

var debug = true;

exports.initGame = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;

  socket.on('identify', playerConnected);
  socket.on('disconnect', playerExit);
  //socket.on('chat message', sendChat);
  socket.on('set name', setName);
  socket.on('new round', newRound);
  socket.on('new game', newGame);
  socket.on('play card', playCard);
  socket.on('unplay card', unplayCard);
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
        newRound();
        sendGameStatus();
    }
}

function newRound(){
  deck.shuffle();
  dealCards();
  //dealer = (dealer + 1) % 4;
  tabled_cards = [null, null, null, null];
  trick_count = [0,0];
  if(debug){
      deck.log();
      console.log(player_hands);
      console.log(kitty);
  }
  sendGameStatus();
}

function dealCards(){
    for(i = 0; i < 4; i++){
        for(j = 0; j < 12; j++){
            player_hands[i].push(deck.draw())
        }
        player_hands[i].sort(cardLib.compare);
        kitty.push(deck.draw());
    }
}

function playCard(card_id){
    seat_number = users.getSeat(user_id)
    
    player_hands[seat_number]
    //TODO
}

function unplayCard(){
    seat_number = users.getSeat(user_id)
    player_hands[seat_number].push(cardLib.n2CardObj(card_id))
    player_hands[seat_number].sort(cardLib.compare);
    //TODO
}

function discardKitty(){
}
function takeKitty(){
}
function takeTrick(){
}

function sendGameStatus(){
    //send each player their hand
    players = users.getPlayers();
    for(p in players){
        let player = players[p];
        let s = io.sockets.sockets.get(player['socket'])
        if(s){
            s.emit('hand', player_hands[player['seat']]);
        }
    }
    //TODO
}
