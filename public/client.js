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
      socket.emit("set name", nameInput.value);
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
    console.log(players);
  });

  socket.on("hand", function (hand) {
    console.log(hand[0]["suit"]);
    console.log(hand[0]["rank"]);
    document.getElementsByClassName("hand")[0].innerHTML =
      hand[0]["rank"] + " of " + hand[0]["suit"];
    document.getElementsByClassName("hand")[1].innerHTML =
      hand[1]["rank"] + " of " + hand[1]["suit"];
    document.getElementsByClassName("hand")[2].innerHTML =
      hand[2]["rank"] + " of " + hand[2]["suit"];
    document.getElementsByClassName("hand")[3].innerHTML =
      hand[3]["rank"] + " of " + hand[3]["suit"];
    document.getElementsByClassName("hand")[4].innerHTML =
      hand[4]["rank"] + " of " + hand[4]["suit"];
    document.getElementsByClassName("hand")[5].innerHTML =
      hand[5]["rank"] + " of " + hand[5]["suit"];
    document.getElementsByClassName("hand")[6].innerHTML =
      hand[6]["rank"] + " of " + hand[6]["suit"];
    document.getElementsByClassName("hand")[7].innerHTML =
      hand[7]["rank"] + " of " + hand[7]["suit"];
    document.getElementsByClassName("hand")[8].innerHTML =
      hand[8]["rank"] + " of " + hand[8]["suit"];
    document.getElementsByClassName("hand")[9].innerHTML =
      hand[9]["rank"] + " of " + hand[9]["suit"];
    document.getElementsByClassName("hand")[10].innerHTML =
      hand[10]["rank"] + " of " + hand[10]["suit"];
    document.getElementsByClassName("hand")[11].innerHTML =
      hand[11]["rank"] + " of " + hand[11]["suit"];
  });

  newRound.addEventListener("click", function () {
    socket.emit("new round");
  });
});
