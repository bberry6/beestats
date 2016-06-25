const P = require('bluebird');

const defaults = {
   twitchAuthStatus: 'unauthorized',
   user: {},
   perms: []
}

const socket = (state = defaults, action) => {
   switch(action.type){
      case 'CONNECTED':
         return {
            socket: action.socket
         }
      case 'TWITCH_CONNECT':
         Twitch.login({
            redirect_uri: 'http://beestats.mooo.com/',
            //redirect_uri: 'http://localhost:8001/',
            scope:['user_read', 'channel_read']
         });
         return Object.assign({}, state, {
            twitchAuthStatus: 'authorizing'
         });
      case 'TWITCH_DISCONNECT':
         state.socket.emit('twitchAuthLogout');
         Twitch.logout();
         return defaults;
      case 'TWITCH_AUTHED':
         return Object.assign({}, state, {
            twitchAuthStatus: 'authorized',
            user: action.user,
            perms: action.perms
         });
      default:
         return state;
   }
};

module.exports = socket;
