'use strict';
const request = require('bhttp').request;
const api = {
};

let usrToken = '';
module.exports = function(tok){

   request("https://api.twitch.tv/kraken/user", {
      headers: {
         Accept: 'application/vnd.twitchtv.v3+json',
         Authorization: 'OAuth '+tok
      },
      method: 'get'
   })
   .then((data) =>{
      console.log('got user data: ', data.body);
      return {
         token: tok,
         user: data.body
      };
   });
   /*
   .then((user)=> {
   return getUserPerms(user);
})
.then((perms) => {
return perms.reduce((result, perm)=>{
result[perm] = api[perm];
});
});
*/
}
