var cardLib = require('./card')

var deck = [];

function buildDeck(){
  deck = [];
  for (i = 0; i < 52; i++){
    deck.push(cardLib.n2CardObj(i));
  }
}


exports.shuffle = function() {
  buildDeck();
  for (card in deck) {
    var randomnumber = Math.floor(Math.random() * 52);
    var placeholder = deck[randomnumber];
    deck[randomnumber] = deck[card];
    deck[card] = placeholder;
  }
}

exports.draw = function(){
  return deck.pop();
}

exports.count = function(){
  return deck.length;
}

exports.log = function(){
  console.log(deck);
}
