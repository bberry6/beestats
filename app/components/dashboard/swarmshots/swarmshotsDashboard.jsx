
import {Component} from 'react';
import {connect} from 'react-redux';

let Shot = require('./shot.jsx');
let ShotModal = require('./shotModal.jsx');

const Dash = ({swarmShots}) => (
   <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
      <div className="row">
         <div className="col-sm-12">
            <div class="page-header">
              <h1>Swarm Shots</h1>
            </div>
         </div>
      </div>
      <div className="row">
         {
            swarmShots.map((item, i) =>(
                  <Shot img={item.img} key={i} />
            ))
         }
      </div>
      <div style={{width: "100%", height: "100%"}}>
      {(()=>{
         let selected = swarmShots.filter(i => i.selected)[0];
         return selected ? <ShotModal img={selected.img}/> : '';
      })()}
      </div>
   </div>
)

const mapStateToProps = (state, props) => {
   return {
      swarmShots: state.swarmShots
   }
}

const SwarmShotsDashboard = connect(
   mapStateToProps
)(Dash);

module.exports = SwarmShotsDashboard;
