var users = require('./users')
var deck = require('./deck')
var cardLib = require('./card')

var io;
var socket;
var player_hands = [[],[],[],[]];
var kitty = [];
var tabled_cards = [null, null, null, null];

var debug = false; //true;

exports.initRound = function(in_io, in_socket){
  io = in_io;
  socket = in_socket;
  //socket.on('play card', playCard);
  //socket.on('unplay card', unplayCard);
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

/*exports.sendHands = function(){
    players = users.getPlayers();
    for(p in players){
        let player = players[p];
        let s = io.sockets.sockets.get(player['socket'])
        if(s){
            s.emit('hand', player_hands[player['seat']]);
        }
    }
}
*/
exports.getHand = function(user_id){
    seat_number = users.getSeat(user_id)
    return player_hands[seat_number];
}
exports.getTable = function(){
    return tabled_cards;
}

exports.playCard = function(card_id, user_id){
    //console.log(card_id);
    seat_number = users.getSeat(user_id)
    //console.log('seat number: ');
    //console.log(seat_number);

    my_hand = player_hands[seat_number];

    //console.log(my_hand);
    play_card = null;
    for( card_idx in my_hand ){
        if(card_id == my_hand[card_idx]["id"]){
            play_card = my_hand[card_idx]
            //remove the card from my hand array
            my_hand.splice(card_idx, 1);
            break;
        }
    }

    tabled_cards[seat_number] = play_card;
    
    //console.log(my_hand);
    //console.log(play_card);
    //TODO
}

exports.unplayCard = function(user_id){
    seat_number = users.getSeat(user_id)

    played_card = tabled_cards[seat_number];

    if(played_card){
        player_hands[seat_number].push(played_card);
        player_hands[seat_number].sort(cardLib.compare);
        tabled_cards[seat_number] = null;
    }
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

