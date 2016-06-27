
import {Component} from 'react';
import {connect} from 'react-redux';

const ShotImg = ({shot, socketApi, onClick, onDelete, deletePerm}) => (
   <div className="col-md-3 thumb">
      <div className="thumbnail">
         <button type="button" onClick={onDelete(socketApi)} className="close" aria-hidden="true" style={{width: '30px', color: 'red', display: deletePerm ? "block" : "none"}}>&times;</button>
         <p>Uploaded By: {shot.uploadedby}</p>
         <p>Date: {(new Date(Number(shot.time))).toLocaleString()}</p>
         <a href="#" onClick={ onClick }>
            <img className="img" src={shot.url} style={{height: '250px'}} alt/>
         </a>
      </div>
   </div>
)

const mapStateToProps = (state, {shot}) => {
   const perms = state.socketApi.perms;
   return {
      shot,
      deletePerm: perms && perms.indexOf('swarmShotDeleted') >= 0,
      socketApi: state.socketApi
   }
}

const mapDispatchToProps = (dispatch, {shot}) => {
   return {
      onClick: () => {
         dispatch({
            type: "SELECT_SHOT",
            selected: shot
         });
         $('#imagemodal').modal('show');
      },
      onDelete: (socketApi) => {
         return () =>{
            $("#loadingOverlay").show();
            socketApi.socket.emit('swarmShotDeleted', shot, function(){
               dispatch({
                  type: 'DELETE_SHOT',
                  selected: shot
               });
               $("#loadingOverlay").hide();
            });
         }
      }
   }
}

const Shot = connect(
   mapStateToProps,
   mapDispatchToProps
)(ShotImg);

module.exports = Shot;
