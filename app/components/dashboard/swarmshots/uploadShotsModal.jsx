
import {Component} from 'react';
import {connect} from 'react-redux';
import DropZone from 'react-dropzone';

const ShotsModal = ({onDrop, socketApi}) => (
   <div className="col-md-3">
      <DropZone onDrop={onDrop(socketApi)} accept='image/*' multiple={false} style={{border: '2px dashed rgb(102,102,102)', borderRadius: '5px', height: '316px'}}>
         <br/>
         <h3 style={{textAlign: 'center'}}>Drop a file or click here to upload!</h3>
      </DropZone>
   </div>
)

const mapStateToProps = (state) => {
   return {
      socketApi: state.socketApi
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onDrop: (socketApi)=>{
         return (files) => {
            if(files.length){
               let file = files[0];
               $("#loadingOverlay").show();
               socketApi.socket.emit('getS3Signature', {
                  name: file.name,
                  type: file.type
               }, function({url, signedRequest}){
                  uploadFile(file, signedRequest, ()=>{
                     const t = Date.now();
                     socketApi.socket.emit('swarmShotUploaded', {uploadedBy: socketApi.user.name, time: t, url});
                     dispatch({
                        type: "ADD_SHOT",
                        newShot: {
                           time: t,
                           uploadedby: socketApi.user.name,
                           url
                        }
                     });
                     $("#loadingOverlay").hide();
                  });
               });
            }
         }
      }
   }
}

const UploadShotsModal = connect(
   mapStateToProps,
   mapDispatchToProps
)(ShotsModal);

module.exports = UploadShotsModal;


function uploadFile(file, signedRequest,cb){
   const xhr = new XMLHttpRequest();
   xhr.open('PUT', signedRequest);
   xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
         if(xhr.status === 200){
            cb();
         }
         else{
            alert('Could not upload file.');
         }
      }
   };
   xhr.send(file);
}
