'use strict';
let URL = require('url');
let express = require('express');
let path = require('path');
let fs = require('fs');
let app = express();
let pgp = require('pg-promise')();
let R = require('ramda');
let session = require('express-session')({
   secret: 'some-secret',
   resave: true,
   saveUninitialized: true
});

let sharedsession = require('express-socket.io-session');

app.use(session);
app.use(express.static(path.join(__dirname, "/../app/dist")));

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname,'/../app/dist/index.html'));
});

let dbURL = process.env.DATABASE_URL;
if(!dbURL){
   console.log('process.env: ', process.env);
   throw new Error("No database url supplied!");
}
let parsed= URL.parse(dbURL);
let cn = {
   host: parsed.hostname,
   port: Number(parsed.port),
   database: parsed.path.replace(/\//,''),
   user: parsed.auth.split(':')[0],
   password: parsed.auth.split(':')[1] || '',
   ssl: true
}
let db = pgp(cn);
let server = require('http').Server(app);
let io = require('socket.io')(server);
// use socket.io session middlware
io.use(sharedsession(session, { autoSave:true }));

let port = Number(process.env.PORT) || 8001;
server.listen(port);

let irc = require('irc');

let pass = process.env.TWITCH_AUTH || fs.readFileSync('./ircpass', {encoding: 'utf8'});
const settings = {
   channels : ["#courtiebee", "#bberry7"],
   server : "irc.twitch.tv",
   port: 6667,
   secure: false,
   nick : "beestats",
   password : pass
}

const ircbot = new irc.Client(settings.server, settings.nick, {
   channels: [settings.channels[0] + " " + settings.password],
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
         io.to('beestats').emit('sneeze', {
            reporter: reporter,
            time: curTime,
            count: count
         });
      });
    }
});

const sessAPI = require('./sessapi.js')(db);

io.on('connection', function (socket) {
   let sess = socket.handshake.session;
   socket.join('beestats');
   db.any("select * from sneezes")
   .then((sneezes) => {
      let sortByCount = R.sortBy(R.prop('count'));
      sneezes = sortByCount(sneezes);
      socket.emit('initSneezes', sneezes.reverse());
   });
   db.any("select * from swarmshots")
   .then((shots) => {
      socket.emit('initSwarmshots', shots);
   });
   socket.on('twitchAuthLogin', function(authToken){
      sessAPI.init(authToken)
      .then(function(res){
         sess.token = res.token;
         sess.user = res.user;
         sess.perms = res.perms;
         if(res.perms.length){
            res.perms.forEach((permName)=>{
               socket.on(permName, sessAPI[permName]);
            });
         }
         socket.emit('twitchAuthed', {user: res.user, perms: res.perms});
      });
   });
   socket.on('twitchAuthLogout', function(){
      if(sess.perms && sess.perms.length){
         sess.perms.forEach((permName)=>{
            socket.removeListener(permName, sessAPI[permName]);
         });
      }
      sess = {};
   });

});

//keepalive for heroku
const http = require('http');
const second = 1000;
const minute = 60*second;


setInterval(function(){
   http.get('http://beestats.herokuapp.com');
},29*minute);
