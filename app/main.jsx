var React = require("react");
var ReactDOM = require("react-dom");
var Redux = require('redux');
//var Sidebar = require("./components/sidebar/sidebar.jsx");
//var SidebarToggle = require('./components/sidebartoggle/sidebartoggle.jsx');
//var Dashboard = require('./components/dashboard/dashboard.jsx');
var FontAwesome = require('react-fontawesome');
var classNames = require('classnames');
var io = require('socket.io-client');

/*

*/


// main.jsx

const sidebar = (state = {}, action) => {
   switch(action.type){
      case 'CHANGE_SCENE':
         return {
            name: action.name,
            id: action.id,
            img: action.img
         };
      default:
         return {
            name: 'Sneezes',
            id: 0,
            img: 'courtieFace.png'
         };
   }
};

const sidebarVisible = (state = true, action) => {
   switch(action.type){
      case "TOGGLE_VISIBILITY":
         return !state
      default:
         return state;
   }
}


var initSneezes = [{
   reporter: 'bberry7',
   time: Date.now(),
   count: 99
},{
   reporter: 'bberry7',
   time: Date.now(),
   count: 98
},{
   reporter: 'bberry7',
   time: Date.now(),
   count: 97
},{
   reporter: 'bberry7',
   time: Date.now(),
   count: 96
},{
   reporter: 'initial sneezes',
   time: Date.now(),
   count: 95
}];
var sneezeList = (state = initSneezes, action) => {
   switch(action.type){
      case 'ADD_SNEEZE':
         return [
            {
            reporter: action.reporter,
            count: action.count,
            time: action.time
         },
         ...state];
      default:
         return state;
   }
};



const { combineReducers } = Redux;
const beeStatsApp = combineReducers({
   sidebar,
   sidebarVisible,
   sneezeList
});

const { createStore } = Redux;
const store = createStore(beeStatsApp);

const { Component } = React;

class SidebarOption extends Component {
   render(){
      return (
         <li onClick={(e)=> {
            store.dispatch({
               name: this.props.opt.name,
               id: this.props.opt.id,
               img: this.props.opt.img,
               type: 'CHANGE_SCENE'
            })
         }}>
             <a href="#">
                <img src={this.props.opt.img} style={{marginRight: "10px", marginLeft: "-10px"}} />
                <span>{store.getState().sidebarVisible ? this.props.opt.name : ''}</span>
             </a>
         </li>
      )
   }
}

class SidebarToggle extends Component {
   render(){
      return (
         <a href="#menu-toggle" id="menu-toggle" onClick={()=>{
            $("#wrapper").toggleClass("toggled");
            store.dispatch({
               type: "TOGGLE_VISIBILITY"
            });
         }}>
            <FontAwesome style={{marginLeft: '5px'}} name={store.getState().sidebarVisible ? 'chevron-left' : 'chevron-right'}/>
         </a>
      )
   }
}


var _scenes = [{name: 'Sneezes', img:'courtieFace.png'},
               {name:'Bites (TBD)',img: 'courtieBee.png'},
               {name:'Subs ???',img:'courtieHeart.png'},
               {name:'Tournies (TBD)',img: 'courtieBam.png'},
               {name: 'Homegames (TBD)',img: 'courtieWink.png'}];
_scenes = _scenes.map((itm, idx) => {
   return Object.assign({}, {id: idx }, itm);
});

class BeeStats extends Component {
   render() {
      return (
            <div className="row">
               <div className="col-sm-3 col-md-2 sidebar">
                  <div className="page-header" style={{marginTop:"-15px"}}>
                     <h3>{store.getState().sidebarVisible ? 'Bee Stats' : ''}</h3>
                  </div>
                  <ul className="nav nav-sidebar">
                  {
                     _scenes.map(function(s){
                        return (
                           <SidebarOption opt={s} key={s.id} />
                        );
                     })
                  }
                  </ul>
               </div>
            </div>
      )
   }
}


var socket = io('http://10.0.0.3:7777');
socket.on('sneeze', (data) => {
   console.log('RECEIVED DATA: ', data);
   store.dispatch({
      count: data.count,
      reporter: data.reporter,
      time: data.time,
      type: 'ADD_SNEEZE'
   })
});

class SneezeItem extends Component {
   render(){
      return(
         <tr>
            <td>
               {(new Date(this.props.sneeze.time)).toLocaleString()}
            </td>
            <td>
               {this.props.sneeze.reporter}
            </td>
            <td>
               {this.props.sneeze.count}
            </td>
         </tr>
      )
   }
}

class Dashboard extends Component {
   render() {
      return (
         <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
            <div className="row">
               <div className="col-sm-12">
                  <div class="page-header">
                    <h1>Sneezes <small>Stat tracking for Courtneys sneezes</small></h1>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-xs-5">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Recent</h4>
                     </div>
                     <div className="panel-body">
                        <table className="table table-striped table-hover">
                           <thead>
                              <tr>
                                 <th>Date</th>
                                 <th>Reporter</th>
                                 <th>Count</th>
                              </tr>
                           </thead>
                           <tbody>
                           {
                              store.getState().sneezeList.map((sneeze) =>{
                                 return (
                                    <SneezeItem sneeze={sneeze} key={sneeze.count} />
                                 )
                              })
                           }
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <div className="col-xs-7">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Frequency</h4>
                     </div>
                     <div className="panel-body">Some stuff here</div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Top 5 Reporters</h4>
                     </div>
                     <div className="panel-body">Some stuff here</div>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

const render = () => {
   ReactDOM.render( <div>
      <BeeStats/>
      <Dashboard/>
      </div>,
      document.getElementById("root"));
}
store.subscribe(render);
render();
