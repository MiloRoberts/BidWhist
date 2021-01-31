var users = new Map();
var sockets_to_users = new Map();
var seats = [];

const max_seats = 4;

exports.identifyUser = function(user_id, socket) {
  if(users.has(user_id)){
    users.get(user_id)['socket'] = socket;
  } else {
    users.set(user_id, {'socket': socket, 'name': 'New Player'});
  }
  sockets_to_users.set(socket, user_id);

  if(seats.length < max_seats){
    seats.push(user_id);
  //} else {
    //TODO: what do you do when you have too many players?
  }
}

exports.disconnectUser = function(socket_id){
  //TODO
}

exports.setName = function(user_id, name){
    user = users.get(user_id);
    if(user){
        user['name'] = name;
    }
}

exports.shuffleSeats = function() {
  for (seat in seats) {
    var randomnumber = Math.floor(Math.random() * seats.length);
    var placeholder = seats[randomnumber];
    seats[randomnumber] = seats[seat];
    seats[seat] = placeholder;
  }
}

exports.getPlayers = function() {
  //TODO we can do to improve this
    players = [];
    for(s=0;s<4; s++){
        if(seats[s]){
            u = users.get(seats[s])
            if(u){
                players.push({'name':u['name'], 'seat': s, 'socket': u['socket'], 'id': seats[s]});
            }
        }
    }
    return players;
}

exports.isGameFull = function(){
    return seats.length >= max_seats;
}


exports.seatFromSocket(socket_id){
  if(sockets_to_users.has(socket_id)){
    user_id = sockets_to_users.get(socket_id);
    //TODO

  } else {
    return null;
  }
}


exports.getSeat = function(player_id){
  //TODO deprecate this
    if(seats[0] == player_id){
        return 0;
    } else if(seats[1] == player_id){
        return 1;
    } else if(seats[2] == player_id){
        return 2;
    } else if(seats[3] == player_id){
        return 3;
    }
}


/*
function logMapElements(value, key, map) {
  console.log(key)
  console.log(value);
}
*/
