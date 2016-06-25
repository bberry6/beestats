const mod = (db) => {

   'use strict';
   const bhttp = require('bhttp');
   const R = require('ramda');
   const AWS = require('aws-sdk');
   const S3 = new AWS.S3();

   const s3Bucket = process.env.S3_BUCKET_NAME;

   // this will be put in the database eventually
   const users = [
      {
         name: 'courtiebee',
         perms: ['getS3Signature','swarmShotUploaded','swarmShotDeleted']
      },
      {
         name: 'bberry',
         perms: ['getS3Signature','swarmShotUploaded','swarmShotDeleted']
      },
      {
         name: 'beestats',
         perms: ['getS3Signature','swarmShotUploaded','swarmShotDeleted']
      }
   ];


   const init = (tok) =>{
      return bhttp.request("https://api.twitch.tv/kraken/user", {
         headers: {
            Accept: 'application/vnd.twitchtv.v3+json',
            Authorization: 'OAuth '+tok
         },
         method: 'get'
      })
      .then((data) =>{
         let dbUser = R.find(R.propEq('name', data.body.name), users);
         return {
            token: tok,
            user: data.body,
            perms: dbUser ? R.prop('perms', dbUser)  : [] //users.
         };
      });
   }

   const getS3Signature = (fileData, cb) => {
      const fileName = fileData.name;
      const fileType = fileData.type;
      const s3Params = {
        Bucket: s3Bucket,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
      };
      S3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
          console.log(err);
          return cb(err);
        }
        const returnData = {
          signedRequest: data,
          url: `https://${s3Bucket}.s3.amazonaws.com/${fileName}`
        };
        cb(returnData);
      });
   }

   const swarmShotUploaded = (data) => {
      db.none('insert into swarmshots(url, time, uploadedby) values($1, $2, $3)', [data.url, data.time, data.uploadedBy])
      .catch(function(e){
         console.log('error inserting swarmshot: ', e);
      });
   }

   const swarmShotDeleted = (data, cb) => {
      const s3Params = {
        Bucket: s3Bucket,
        Key: data.url.substr(data.url.lastIndexOf('/') + 1)
      };
      S3.deleteObject(s3Params, function(err, res){
         if(err) {console.log(err, err.stack);}
         db.none('delete from swarmshots where url=$1', [data.url])
         .then(function(r){
            return cb();
         })
         .catch(function(e){
            console.log('error deleting swarmshot: ', e, e.stack);
            cb();
         });
      });
   }

   return {
      init,
      getS3Signature,
      swarmShotUploaded,
      swarmShotDeleted
   };
}
module.exports = mod;
