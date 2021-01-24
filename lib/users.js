var users = new Map();
var seats = [null,null,null,null];
var debug = true;

exports.identifyUser = function(id, socket) {
  if(users.has(id)){
    users.get(id)['socket'] = socket;
  } else {
    users.set(id, {'socket': socket, 'name': 'Player'});
  }
  
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

exports.disconnectUser = function(id){
    //console.log(id);
  //user = users.get(id)
  //if(user){
    //user['socket'] = null;
  //}
}

exports.setName = function(id, name){
    user = users.get(id);
    if(user){
        user['name'] = name;
    }
  if(debug){
    users.forEach(logMapElements);
  }
}

exports.seatUser = function(id){
    if(seats[0] == null){
        seats[0] = id
    } else if(seats[1] == null){
        seats[1] = id
    } else if(seats[2] == null){
        seats[2] = id
    } else if(seats[3] == null){
        seats[3] = id
    }
  //TODO what happens if a 5th person joins

}

exports.shuffleSeats = function() {
  //TODO
}

exports.getPlayers = function() {
    players = [];
    for(s=0;s<4; s++){
        if(seats[s]){
            u = users.get(seats[s])
            if(u){
                players.push({'name':u['name'], 'seat': s});
            }
        }
    }
    return players;
}

function logMapElements(value, key, map) {
  console.log(key)
  console.log(value);

}