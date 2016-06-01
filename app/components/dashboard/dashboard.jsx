const React = require('react');
const { Component } = React;

let SneezesDashboard = require('./sneezes/sneezesDashboard.jsx');
let SwarmShotsDashboard = require('./swarmshots/swarmshotsDashboard.jsx');
let NotReady = require('./notReady/notReady.jsx');

class Dashboard extends Component {
   componentDidMount(){
      const {store} = this.context;
      this.unsubscribe = store.subscribe(() => {
         this.forceUpdate();
      });
   }
   componentWillUnmount(){
      this.unsubscribe();
   }
   render() {
      let {store} = this.context;
      return (
         <div>
         {(() => {
           switch (store.getState().sidebar.filter((i)=>{return i.active})[0].name) {
             case "Sneezes":
               return <SneezesDashboard store={store}/>;
             case "Swarm Shots":
               return <SwarmShotsDashboard store={store}/>
             default:
               return <NotReady />;
           }
         })()}
         </div>
      )
   }
}
Dashboard.contextTypes = {
   store: React.PropTypes.object
};

module.exports = Dashboard;
