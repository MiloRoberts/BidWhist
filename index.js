const PORT = process.env.PORT || 3000;
const express = require('express') ;
const app = express();
//const app = require('express')();

// Create a simple Express application
/*
app.configure(function() {
    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname,'public')));
});
*/

const http = require('http').Server(app);
const io = require('socket.io')(http);

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: 'index.html',
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

//app.listen(PORT, () => console.log(`Listening on ${PORT}`));
app.use(express.static('public', options))

var whist = require('./whistgame');


io.on('connection', (socket) => {
  whist.initGame(io, socket);
  //socket.broadcast.emit('hi');
  //console.log('a user connected ' + socket.id);
});

http.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
