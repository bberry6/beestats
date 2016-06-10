
const socket = (state = {}, action) => {
   switch(action.type){
      case 'CONNECTED':
         return {
            socket: action.socket
         }
      case 'TWITCH_CONNECT':
         Twitch.login({
            redirect_uri: 'http://beestats.mooo.com/',
            scope:['user_read', 'channel_read']
         });
         return Object.assign({}, state, {
            twitchAuthStatus: 'authorizing'
         });
      case 'TWITCH_DISCONNECT':
         console.log('getting otken in disconnect: ', Twitch.getToken());
         Twitch.logout();
         return Object.assign({}, state, {
            twitchAuthStatus: 'unauthorized'
         });
      case 'TWITCH_AUTHED':
         return Object.assign({}, state, {
            twitchAuthStatus: 'authorized',
            user: action.user
         });
      default:
         return state;
   }
};

module.exports = socket;
