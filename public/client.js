window.addEventListener("load", function () {
  var socket = io();
  socket.emit("identify", get_user_id());

  set_game_unstarted();


  socket.on("game", function (game){
      if(game['started']){
          set_game_started();
      //} else {
          //TODO ??

      }
  });



  socket.on("players", function (players) {

    for( i in players){
        var name = document.querySelectorAll('#player'+(players[i]["seat"]+1)+'>.name')[0];
        name.innerText = players[i]["name"];
        if(players[i]["socket"] == socket.id){
            document.querySelectorAll('#player'+(players[i]["seat"]+1)+'>.playfield')[0].setAttribute('id', 'my-playfield');
        }
    }

  });


  socket.on("table top", function(table){

    //Update played cards
    for (i = 0; i < 4; ++i) {
      var playfield = document.getElementsByClassName("playfield")[i]

      if(playfield){ //make sure we have valid data
        //remove any children
        while (playfield.firstChild) {
            playfield.removeChild(playfield.firstChild);
        }
        if(table["cards"][i]){ //there is a card here
            if(playfield.id == "my-playfield"){
              var item = document.createElement('button');
              item.setAttribute('id', table["cards"][i]["id"]);
              item.innerHTML = table["cards"][i]["rank"] + " of " + table["cards"][i]["suit"];
              item.addEventListener("click", function (e) {
                  e.preventDefault();
                  //alert(this.getAttribute("id"));
                  socket.emit("unplay card", this.getAttribute("id"));
              });

              playfield.appendChild(item);
            } else {
              var item = document.createElement('div');
              item.innerText = table["cards"][i]["rank"] + " of " + table["cards"][i]["suit"];
              item.setAttribute('id', table["cards"][i]["id"]);
              playfield.appendChild(item);
            }
        } //end if table["cards"][i]
      } //end if(playfield)
    } //end for 0 to 3
    
      console.log(table);

    var kitty_space = document.getElementById("kitty");
    while (kitty_space.firstChild) {
        kitty_space.removeChild(kitty_space.firstChild);
    }
    if(table["kitty"] > 0){
      var item = document.createElement('div');
        item.innerHTML = "Kitty: " + table["kitty"] + " cards";
      kitty_space.appendChild(item);

      item = document.createElement('button');
      item.innerHTML = "Take";
      item.addEventListener("click", function (e) {
          e.preventDefault();
          //alert(this.getAttribute("id"));
          socket.emit("take kitty", this.getAttribute("id"));
      });
      kitty_space.appendChild(item);

    }

  });

  socket.on("hand", function (hand) {
    new_hand(hand);

    if(check_discard_ready()){
        enable_dicard();
    } else {
        disable_discard();
    }

  }); //end on "hand"

  // new game section
    /*
  document.getElementById("newGame").addEventListener("click", function () {
    socket.emit("new game");
  });
  */

  // new round section
  document.getElementById("newRound").addEventListener("click", function () {
    socket.emit("new round");
  });

  // name change section
  document.getElementById("nameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    nameInput = document.getElementById("nameInput");
    if (nameInput.value) {
      socket.emit("set name", nameInput.value);
    }
  });


  document.getElementById("discard-button").addEventListener("click", function () {
    if(check_discard_ready()){
        socket.emit("discard");
        set_playing();
    }
  });

    // set up functions for when a hand card is clicked
  hand_set = document.getElementsByClassName('hand-card')
    for(i in hand_set){
        console.log(i);
        console.log(hand_set[i]);
        if(hand_set[i]){
          hand_set[i].addEventListener("click", function (e) {
            e.preventDefault();
            if(is_discarding()){
                toggle_picked(this);
      
                if(is_card_picked(card)){
                    socket.emit("unpick card", this.getAttribute("id"));
                } else {
                    socket.emit("pick card", this.getAttribute("id"));
                }
      
                if(check_discard_ready()){
                    enable_dicard();
                } else {
                    disable_discard();
                }
      
            } else { //not discarding, playing cards
                if(!card_on_table()){
                    play_card(card);
                    socket.emit("play card", this.getAttribute("id"));
                }
            }
          });
       }
    }
});
