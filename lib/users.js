var users = new Map();
var seats = [null,null,null,null];
var debug = true;

exports.identifyUser = function(user_id, socket) {
  if(users.has(user_id)){
    users.get(user_id)['socket'] = socket;
  } else {
    users.set(user_id, {'socket': socket, 'name': 'New Player'});
  }

  seatUser(user_id);
  
  if(debug){
    users.forEach(logMapElements);
  }
}

exports.getUserCount = function(){
  return users.size;
}

exports.getUserInSeat = function (seat){
  if(seats[seat]){
    return users.get(seats[seat]);
  }
  return null;
}

exports.disconnectUser = function(socket_id){
    //console.log(id);
  //user = users.get(id)
  //if(user){
    //user['socket'] = null;
  //}
}

exports.setName = function(user_id, name){
    user = users.get(user_id);
    if(user){
        user['name'] = name;
    }
  if(debug){
    users.forEach(logMapElements);
  }
}

function seatUser(user_id){
  console.log(seats);
  for(i in seats){
    if(seats[i]){
      if(seats[i] == user_id){
        return;
      }
    } else {
      seats[i] = user_id;
      return
    }
  }
  //TODO what happens if a 5th person joins

}

exports.shuffleSeats = function() {
  for (seat in seats) {
    var randomnumber = Math.floor(Math.random() * 4);
    var placeholder = seats[randomnumber];
    seats[randomnumber] = seats[seat];
    seats[seat] = placeholder;
  }
}

exports.getPlayers = function() {
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
    return seats[3] != null;
}

exports.getSeat = function(player_id){
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


function logMapElements(value, key, map) {
  console.log(key)
  console.log(value);
}
