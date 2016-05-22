'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
app.use(express.static(path.join(__dirname, "../app/dist")));

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(7777);

let irc = require('irc');

let pass = fs.readFileSync('./ircpass');

const settings = {
channels : ["#bberry7"],
server : "irc.twitch.tv",
port: 6667,
secure: false,
nick : "beestats",
password : pass
}

const ircbot = new irc.Client(settings.server, settings.nick, {
channels: [settings.channels[0] + " " + settings.password],
debug: true,
password: settings.password,
username: settings.nick
});

let totalSneezes = 0;

let reporter = ''
ircbot.addListener('message',  (fr, ch, message) => {
    if(message.indexOf('!sneeze') === 0){
      reporter = fr;
    }
    if(message.indexOf('Sneeze counter') > -1  && fr === 'moobot'){
      io.to('sneezeRoom').emit('sneeze', {
         reporter: reporter,
         time: Date.now(),
         count: Number(message.split(' ')[2])
      });
   }
});

io.on('connection', function (socket) {
   socket.join('sneezeRoom');
   socket.on('join', (from, msg)=>{
      socket.leave(msg.toLeave);
      socket.join(msg.toJoin);
   });
});
