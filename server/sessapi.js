'use strict';
const bhttp = require('bhttp');
const R = require('ramda');

module.exports = {
   init: function(tok){
      bhttp.request("https://api.twitch.tv/kraken/user", {
         headers: {
            Accept: 'application/vnd.twitchtv.v3+json',
            Authorization: 'OAuth '+tok
         },
         method: 'get'
      })
      .then((data) =>{
         console.log('got user data: ', data.body);
         //userPerms = users.filter(data.body)
         return {
            token: tok,
            user: data.body,
            permissions: [] //users.
         };
      });
   },
   getApi: (perms) => {
      return perms.map(getPerm)
   }
}

function getPerm(perm){
   return api[perm]
}

const api = {
   uploadSwarmshot: (file) => {
      return;
   }
}

// this will be put in the database eventually
const users = [
   {
      name: 'courtiebee',
      perms: ['uploadSwarmshot']
   },
   {
      name: 'bberry',
      perms: '*'
   }
]
