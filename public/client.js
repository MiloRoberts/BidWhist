window.addEventListener("load", function() {

    var socket = io();

    var nameForm = document.getElementById('nameForm');
    var nameInput = document.getElementById('nameInput');

    var newRound = document.getElementById('newRound');
    
    var userId = localStorage.getItem('userId');
    if(userId == null){
      userId = 
        Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)+
        Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)+
        Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      localStorage.setItem('userId', userId);
    }

    socket.emit('identify', userId);

    nameForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (nameInput.value) {
        socket.emit('set name', nameInput.value);
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

    socket.on('players', function(players) {
      console.log(players);
    });

    socket.on('hand', function(hand) {
      console.log(hand);
    });


    newRound.addEventListener('click', function() {
      socket.emit('new round');
    });


});


