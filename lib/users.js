var users = new Map();
var sockets_to_users = new Map();
var seats = [];

const max_seats = 4;

exports.identifyUser = function(user_id, socket) {
  if(users.has(user_id)){
    users.get(user_id)['socket'] = socket;
  } else {
    users.set(user_id, {'socket': socket, 'name': 'New Player', 'seat': null});
  }
  sockets_to_users.set(socket, user_id);

  user = users.get(user_id);
  position = seats.length;
  if(user && user['seat'] == null && position < max_seats){
    seats.push(user_id);
    if(user){
        user['seat'] = position;
    }
  } //TODO: what do you do when you have too many players?
}

exports.disconnectUser = function(socket_id){
  //TODO
}

exports.setName = function(socket_id, name){
    seat = p_seat_from_socket(socket_id);
    user_id = seats[seat]
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
    for(s=0;s<max_seats; s++){
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


function p_seat_from_socket (socket_id){
  if(sockets_to_users.has(socket_id)){
    user_id = sockets_to_users.get(socket_id);
    user = users.get(user_id);
    if(user){
        return user['seat'];
    }
  }
  return null;
}

exports.seatFromSocket = p_seat_from_socket;

