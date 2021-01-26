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
    for (i = 0; i < hand.length; ++i) {
      document.getElementsByClassName("hand")[i].innerHTML =
        hand[i]["rank"] + " of " + hand[i]["suit"];
      document
        .getElementsByClassName("hand")
        [i].setAttribute("id", hand[i]["id"]);
      document
        .getElementsByClassName("hand")
        [i].addEventListener("click", function (e) {
          e.preventDefault();
          alert(this.getAttribute("id"));
        });
    }
  });

  newRound.addEventListener("click", function () {
    socket.emit("new round");
  });
});
