var users = require('./users')
var deck = require('./deck')
var cardLib = require('./card')

var player_hands = [[],[],[],[]];
var kitty = [];
var kitty_holder = null;
var tabled_cards = [null, null, null, null];
var tricks = [0,0];
//var dealer = 0;

var debug = false; //true;

exports.initRound = function(){
    //todo any initial conditions
}

exports.newRound = function(){
  player_hands = [[],[],[],[]];
  kitty = [];
  kitty_holder = null;
  tabled_cards = [null, null, null, null];
  tricks = [0,0];

  deck.shuffle();
  dealCards();
  //dealer = (dealer + 1) % 4;
  if(debug){
      deck.log();
      console.log(player_hands);
      console.log(kitty);
  }
}

exports.getHand = function(socket_id){
    seat_number = users.seatFromSocket(socket_id);
    return player_hands[seat_number];
}
exports.getTable = function(){
    return {
        "cards":tabled_cards,
        "tricks": tricks,
        "kitty": kitty.length,
        "kitty_holder": kitty_holder
    };
}

exports.playCard = function(socket_id, card_id){
    //console.log(card_id);
    seat_number = users.seatFromSocket(socket_id);
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
}

exports.unplayCard = function(socket_id){
    let seat_number = users.seatFromSocket(socket_id);

    played_card = tabled_cards[seat_number];

    if(played_card){
        player_hands[seat_number].push(played_card);
        player_hands[seat_number].sort(cardLib.compare);
        tabled_cards[seat_number] = null;
    }
}

exports.takeKitty = function(socket_id){
    if(kitty.length > 0 && kitty_holder == null){
        let seat_number = users.seatFromSocket(socket_id);
        kitty_holder = seat_number
        while(kitty.length > 0) {
            let card =  kitty.pop();
            player_hands[seat_number].push(card);
        }
        player_hands[seat_number].sort(cardLib.compare);
    }
}

exports.pickCard = function(socket_id, card_id){
    let seat_number = users.seatFromSocket(socket_id);
    
    my_hand = player_hands[seat_number];

    console.log(my_hand);
    for( i in my_hand ){
        if(card_id == my_hand[i]["id"]){
            my_hand[i]["picked"] = true;
        }
    }

    return true;
}

exports.unpickCard = function(socket_id, card_id){
    let seat_number = users.seatFromSocket(socket_id);
    
    my_hand = player_hands[seat_number];

    for( i in my_hand ){
        if(card_id == my_hand[i]["id"]){
            my_hand[i]["picked"] = false;
        }
    }

    return true;
}
exports.discardPicks = function(socket_id){
    let seat_number = users.seatFromSocket(socket_id);

    my_hand = player_hands[seat_number];
    for( i = 0 ; i < my_hand.length; i++ ){
        if(my_hand[i]["picked"]){
            my_hand.splice(i, 1); //remove the card from my hand array
            i--; //decrement so we don't skip a space
        }
    }
    tricks[seat_number%2]++; //incremenet team's score
}

exports.takeTrick = function(socket_id){
  //only if 4 cards are played
    if( tabled_cards[0]
       && tabled_cards[1]
       && tabled_cards[2]
       && tabled_cards[3]){

        let seat_number = users.seatFromSocket(socket_id);
        tricks[seat_number%2]++; //incremenet team's score
    }
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

