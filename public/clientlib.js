var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
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
function n2Card(cardNumber) {
  suit = suits[Math.floor(cardNumber / 13)];
  rank = ranks[cardNumber % 13];
  return rank + " of " + suit;
};

function get_user_id(){
  var userId = localStorage.getItem("userId");
  if (userId == null) {
    userId =
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5) +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5) +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5);
    localStorage.setItem("userId", userId);
  }
  return userId;
}

function set_game_unstarted(){
    //TODO
}

function set_game_ready(){
    //TODO
}

function set_game_started(){
    //TODO
}

function check_discard_ready(){
    if(document.getElementsByClassName("picked").length == 4) {
        return true;
    }
    return false;
}

function enable_discard(){
    document.getElementById("discard-button")
        .removeAttribute("disabled")
        .classList.remove("hidden");
}

function disable_discard(){
    document.getElementById("discard-button")
        .setAttribute("disabled", "disabled")
        .classList.add("hidden");
}

function is_discarding(){
  return document.getElementById("hand").classList.contains("kitty-discard");
}

function set_discarding(){
  document.getElementById("hand").classList.add("kitty-discard");
}

function set_playing(){
  document.getElementById("hand").classList.remove("kitty-discard");
}

function toggle_picked(card){
  card.classList.toggle("picked");
}

function is_card_picked(card){
  return card.classList.contains("picked");
}

function unplay_card(){
    if(card_on_table()){
        played_card = document.getElementById("my-played-card");
        if(played_card.dataset.id){
            played_card.dataset.id = null;
            played_card.classList.remove("on-table");
            played_card.innerHTML = ""

            hand_card = document.getElementById(played_card.dataset.id);
            hand_card.classList.remove("hidden");
        }
    }
}

function play_card(card){
    if(!card_on_table()){
        played_card = document.getElementById("my-played-card");
        card.classList.add('hidden');
        played_card.dataset.id = card.id
        played_card.innertHTML = card.innerHTML;
        played_card.classList.add('on-table');
    }
}

function card_on_table(){
    //check if there is already a card on the table
    played_card = document.getElementById("my-played-card");
    return played_card.dataset.id !== null
}


function new_hand(hand){
    hand_cards = document.getElementsByClassName("hand-card");
    for(i = 0; i < hand_cards.length; i++){
        if(hand[i]){
            hand_cards[i]
                .setAttribute("id", hand[i]["id"])
                .classList.remove("hidden");
            hand_cards[i].innerHTML = n2Card(hand[i]["id"]);
          if(hand[i]["picked"]){
            hand_cards[i].classList.add("picked");
          }
        } else {
            hand_cards[i]
                .removeAttribute("id")
                .classList.add("hidden").remove("picked");
            hand_cards[i].innerHTML = "";
        }
    }
}

function clear_trick(){
    document.getElementsByClassName("playfield")
}
