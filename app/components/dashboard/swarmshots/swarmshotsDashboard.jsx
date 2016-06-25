
import {Component} from 'react';
import {connect} from 'react-redux';
const classNames = require('classnames');
const R = require('ramda');

let Shot = require('./shot.jsx');
let ShotModal = require('./shotModal.jsx');
let UploadShot = require('./uploadShotsModal.jsx');

const noop = () => {}

const Dash = ({swarmShots, uploadPerm}) => (
   <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
      <div className="row">
         <div className="col-sm-12">
            <div class="page-header">
              <h1>Swarm Shots</h1>
            </div>
         </div>
      </div>
      <div className="row">
         {(()=>{
            let arr = R.reverse(R.sortBy(R.prop('time'), swarmShots)).map((item, i) =>(
               <Shot shot={item} key={i} />
            ));

            if(uploadPerm){
               return R.prepend(<UploadShot/>, arr);
            }
            return arr;
         })()}
      </div>
      <div style={{width: "100%", height: "100%"}} >
         <ShotModal key={1234}/>
      </div>
   </div>
)

const mapStateToProps = (state, props) => {
   const perms = state.socketApi.perms;
   return {
      uploadPerm: perms && perms.indexOf('getS3Signature') >= 0,
      swarmShots: state.swarmShots.list
   }
}

const SwarmShotsDashboard = connect(
   mapStateToProps
)(Dash);

module.exports = SwarmShotsDashboard;
