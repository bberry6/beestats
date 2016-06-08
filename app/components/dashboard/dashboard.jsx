import { Component } from 'react';
import {connect} from 'react-redux';

let SneezesDashboard = require('./sneezes/sneezesDashboard.jsx');
let SwarmShotsDashboard = require('./swarmshots/swarmshotsDashboard.jsx');
let NotReady = require('./notReady/notReady.jsx');

const Dash = ({sidebar}) => (
   <div>
   {(() => {
     switch (sidebar.filter((i)=>{return i.active})[0].name) {
       case "Sneezes":
         return <SneezesDashboard/>
       case "Swarm Shots":
         return <SwarmShotsDashboard/>
       default:
         return <NotReady />
     }
   })()}
   </div>
)

const mapStateToProps = (state, props) => {
   return {
      sidebar: state.sidebar
   }
}

const Dashboard = connect(
   mapStateToProps
)(Dash);

module.exports = Dashboard;
