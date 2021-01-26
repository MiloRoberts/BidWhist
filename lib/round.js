var users = require('./users')
var deck = require('./deck')
var cardLib = require('./card')

var io;
var socket;
var player_hands = [[],[],[],[]];
var kitty = [];
var tabled_cards = [null, null, null, null];

var debug = true;

exports.initRound = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;
  socket.on('play card', playCard);
  socket.on('unplay card', unplayCard);
}

exports.newRound = function(){
  player_hands = [[],[],[],[]];
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
}

exports.sendHands = function(){
    players = users.getPlayers();
    for(p in players){
        let player = players[p];
        let s = io.sockets.sockets.get(player['socket'])
        if(s){
            s.emit('hand', player_hands[player['seat']]);
        }
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

function dealCards(){
    for(i = 0; i < 4; i++){
        for(j = 0; j < 12; j++){
            player_hands[i].push(deck.draw())
        }
        player_hands[i].sort(cardLib.compare);
        kitty.push(deck.draw());
    }
}

