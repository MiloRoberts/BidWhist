var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
var ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace",
];

exports.n2Card = function(cardNumber){
  suit = suits[Math.floor(cardNumber/13)];
  rank = ranks[cardNumber%13];
  return (rank + " of " + suit);
}

exports.n2CardObj = function(cardNumber){
  suit = suits[Math.floor(cardNumber/13)];
  rank = ranks[cardNumber%13];
  return {'suit': suit, 'rank': rank, 'id': cardNumber}
}

exports.compare = function(cardA, cardB){
    return cardA['id'] - cardB['id'];
}
