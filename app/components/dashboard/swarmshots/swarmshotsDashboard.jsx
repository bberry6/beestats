const React = require('react');
const { Component } = React;

let Shot = require('./shot.jsx');
let ShotModal = require('./shotModal.jsx');

class swarmShotsDashboard extends Component {
   render(){
      let {store} = this.props;
      return(
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
                  store.getState().swarmShots.map((item, i) =>(
                        <Shot img={item.img} key={i} store={store} />
                  ))
               }
            </div>
            <div style={{width: "100%", height: "100%"}}>
            {(()=>{
               let selected = store.getState().swarmShots.filter(i => i.selected)[0];
               return selected ? <ShotModal img={selected.img}/> : '';
            })()}
            </div>
         </div>
      )
   }
   componentDidUpdate(){
      let {store} = this.props;

      if(store.getState().swarmShots.filter(i=>i.selected).length){
         $('#imagemodal').modal('show');
      }
   }
};

module.exports = swarmShotsDashboard;
