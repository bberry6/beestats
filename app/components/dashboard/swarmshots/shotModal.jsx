
import {Component} from 'react';
import {connect} from 'react-redux';
const R = require('ramda');
const classNames = require('classnames');

const ShotModal = ({shot}) => {
   fixModalDisplay();
   return (
   <div style={{float:'left', display: 'none'}} className="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
     <div className="modal-dialog">
      <div className="modal-content">
         <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" style={{width: '30px'}}>&times;</button>
            Uploaded By: {shot.uploadedby}<br/>
            Date: {(new Date(Number(shot.time))).toLocaleString()}
         </div>
         <div className="modal-body">
           <img src={shot.url} className="imagepreview"/>
         </div>
      </div>
     </div>
   </div>
)};

const mapStateToProps = ({swarmShots}) => {
   return {
      shot: swarmShots.selected || {}
   }
}

const fixModalDisplay = ()=>{
   $('#imagemodal .modal-body').css('max-height',$( window ).height()*0.8);
   $('#imagemodal .modal-body').css('height',$( window ).height()*0.8);
   $('#imagemodal .modal-body').css('overflow-y','auto');
}

const connectedShotsModal = connect(mapStateToProps)(ShotModal);

module.exports = connectedShotsModal;
