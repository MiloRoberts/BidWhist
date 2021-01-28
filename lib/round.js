var users = require('./users')
var deck = require('./deck')
var cardLib = require('./card')

var player_hands = [[],[],[],[]];
var kitty = [];
var tabled_cards = [null, null, null, null];
//var dealer = 0;

var debug = false; //true;

exports.initRound = function(){
    //todo any initial conditions
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

exports.getHand = function(user_id){
    seat_number = users.getSeat(user_id)
    return player_hands[seat_number];
}
exports.getTable = function(){
    return tabled_cards;
}

exports.playCard = function(user_id, card_id){
    //console.log(card_id);
    seat_number = users.getSeat(user_id)
    //console.log('seat number: ');
    //console.log(seat_number);
    if( tabled_cards[seat_number] == null){
        my_hand = player_hands[seat_number];

        //console.log(my_hand);
        let play_card = null;
        for( i in my_hand ){
            if(card_id == my_hand[i]["id"]){
                play_card = my_hand[i]
                my_hand.splice(i, 1); //remove the card from my hand array
                break;
            }
        }

        tabled_cards[seat_number] = play_card;
        return true;
    } else {
        console.log('card already on table');
        return false;
    }
    
    //console.log(my_hand);
    //console.log(play_card);
    //TODO
}

exports.unplayCard = function(user_id){
    let seat_number = users.getSeat(user_id)

    played_card = tabled_cards[seat_number];

    if(played_card){
        player_hands[seat_number].push(played_card);
        player_hands[seat_number].sort(cardLib.compare);
        tabled_cards[seat_number] = null;
      console.log('yay');
    }
    console.log(tabled_cards);
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

