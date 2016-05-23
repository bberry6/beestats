'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
app.use(express.static(path.join(__dirname, "../app/dist")));

app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
});


var pgp = require('pg-promise')();
var R = require('ramda');
var cn = {
   host: 'localhost',
   port: 5432,
   database: 'beestats',
   user: 'brett'
}
var db = pgp(cn);

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

let irc = require('irc');

let pass = fs.readFileSync('./ircpass', {encoding: 'utf8'});
console.log('pass:', pass);
const settings = {
   channels : ["#courtiebee"],
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
      let curTime = Date.now();
      let count = Number(message.split(' ')[2]);
      db.none("insert into sneezes(count, reporter, time) values ($1, $2, $3)",[count, reporter, curTime.toString()])
      .then(() => {
         io.to('sneezeRoom').emit('sneeze', {
            reporter: reporter,
            time: curTime,
            count: count
         });
      });
    }
});

io.on('connection', function (socket) {
   socket.join('sneezeRoom');
   db.any("select * from sneezes")
   .then((sneezes) => {
      let sortByCount = R.sortBy(R.prop('count'));
      sneezes = sortByCount(sneezes);
      socket.emit('initSneezes', sneezes.reverse());
   });
   socket.on('join', (from, msg)=>{
      socket.leave(msg.toLeave);
      socket.join(msg.toJoin);
   });
});
