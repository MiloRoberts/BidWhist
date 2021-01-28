window.addEventListener("load", function () {
  var socket = io();

  var nameForm = document.getElementById("nameForm");
  var nameInput = document.getElementById("nameInput");

  var newRound = document.getElementById("newRound");

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

  socket.emit("identify", userId);

  nameForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (nameInput.value) {
      socket.emit("set name", userId, nameInput.value);
      //input.value = '';
    }
  });
  /*
    socket.on('chat message', function(msg) {
      var item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
    */

  socket.on("players", function (players) {
    
      //player1_name = document.querySelectorAll('#player1>.name')[0];
    console.log(players);
    console.log(socket.id);
    for( i in players){
        var name = document.querySelectorAll('#player'+(players[i]["seat"]+1)+'>.name')[0];
        console.log(name);
        console.log(players[i]["name"]);
        name.innerText = players[i]["name"];
        if(players[i]["socket"] == socket.id){
            document.querySelectorAll('#player'+(players[i]["seat"]+1)+'>.playfield')[0].setAttribute('id', 'my-playfield');
        }
    }

  });
  socket.on("table top", function(table){
      //console.log(table);
    for (i = 0; i < 4; ++i) {
      var playfield = document.getElementsByClassName("playfield")[i]

      if(playfield){ //make sure we have valid data
        //remove any children
        while (playfield.firstChild) {
            console.log('wat');
            playfield.removeChild(playfield.firstChild);
        }
        if(table[i]){ //there is a card here
            if(playfield.id == "my-playfield"){
              var item = document.createElement('button');
              item.setAttribute('id', table[i]["id"]);
              item.innerHTML = table[i]["rank"] + " of " + table[i]["suit"];
              item.addEventListener("click", function (e) {
                  e.preventDefault();
                  //alert(this.getAttribute("id"));
                  socket.emit("unplay card", userId, this.getAttribute("id"));
              });

              playfield.appendChild(item);
            } else {
              var item = document.createElement('div');
              item.innerText = table[i]["rank"] + " of " + table[i]["suit"];
              item.setAttribute('id', table[i]["id"]);
              playfield.appendChild(item);
            }
        } //end if table[i]
      } //end if(playfield)
    } //end for 0 to 3
  });

  socket.on("hand", function (hand) {
    
    var hand_div = document.getElementById("hand");
    //clear all existing entries first
    while (hand_div.firstChild) {
        hand_div.removeChild(hand_div.firstChild);
    }

    //create and add card buttons to the hand
    for (i = 0; i < hand.length; ++i) {
      var item = document.createElement('button');
      item.setAttribute('class', 'hand');
      item.setAttribute('id', hand[i]["id"]);
      item.innerHTML = hand[i]["rank"] + " of " + hand[i]["suit"];
      item.addEventListener("click", function (e) {
          e.preventDefault();
          //alert(this.getAttribute("id"));
          socket.emit("play card", userId, this.getAttribute("id"));
      });
      hand_div.appendChild(item);
    }

  }); //end on "hand"

  newRound.addEventListener("click", function () {
    socket.emit("new round");
  });
});
