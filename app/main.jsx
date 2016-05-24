var React = require("react");
var ReactDOM = require("react-dom");
var Redux = require('redux');
//var Sidebar = require("./components/sidebar/sidebar.jsx");
//var SidebarToggle = require('./components/sidebartoggle/sidebartoggle.jsx');
//var Dashboard = require('./components/dashboard/dashboard.jsx');
var FontAwesome = require('react-fontawesome');
var io = require('socket.io-client');
var classNames = require('classnames');

// main.jsx

var _scenes = [{name: 'Sneezes', img:'courtieFace.png', active: true},
               {name:'Bites (Soon™)',img: 'courtieBee.png'},
               {name:'Subs (Soon™)',img:'courtieHeart.png'},
               {name:'Tournies (Soon™)',img: 'courtieBam.png'},
               {name: 'Homegames (Soon™)',img: 'courtieWink.png'}];
_scenes = _scenes.map((itm, idx) => {
   return Object.assign({}, {id: idx }, itm);
});

const sidebar = (state = _scenes, action) => {
   switch(action.type){
      case 'CHANGE_SCENE':
         return state.map((scene)=>{
            if(scene.active){
               var s= Object.assign({}, scene, {active: false});
               return s;
            }
            if(action.id === scene.id){
               return Object.assign({}, scene, {active: true});
            }
            return Object.assign({}, scene);
         });
      default:
         return state;
   }
};

const sidebarVisible = (state = true, action) => {
   switch(action.type){
      case "TOGGLE_VISIBILITY":
         return !state;
      default:
         return state;
   }
};

/*
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
*/
var sneezeList = (state = [], action) => {
   switch(action.type){
      case 'ADD_SNEEZE':
         return [
            {
            reporter: action.reporter,
            count: action.count,
            time: action.time
         },
         ...state];
      case 'INIT_SNEEZES':
         return action.sneezes;
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
      let cn = classNames({'active': this.props.opt.active});
      return (
         <li className={cn} onClick={(e)=> {
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


class BeeStats extends Component {
   render() {
      var _scenes = store.getState().sidebar;
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


var socket = io(window.location.protocol + "//" + window.location.host);
socket.on('sneeze', (data) => {
   store.dispatch({
      count: data.count,
      reporter: data.reporter,
      time: data.time,
      type: 'ADD_SNEEZE'
   })
});
socket.on('initSneezes', (data) => {
   store.dispatch({
      type: 'INIT_SNEEZES',
      sneezes: data
   });
});

class SneezeItem extends Component {
   render(){
      return(
         <tr>
            <td>
               <h4>
               {(new Date(Number(this.props.sneeze.time))).toLocaleString()}
               </h4>
            </td>
            <td>
               <h4>
               {this.props.sneeze.reporter}
               </h4>
            </td>
            <td>
               <h4>
               {this.props.sneeze.count}
               </h4>
            </td>
         </tr>
      )
   }
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawSneezeFrequency);
google.charts.setOnLoadCallback(drawSneezeTopFive);

function drawSneezeFrequency() {
   let sneezeData = store.getState().sneezeList.reduce((freq, sn, i)=>{
      let snDate = new Date(Number(sn.time));
      let fDate = new Date((snDate.getMonth()+1) + '/' + snDate.getDate() +'/' + snDate.getFullYear());
      let fDateMillis = fDate.getTime().toString();
      if(!freq[fDateMillis]){
         freq[fDateMillis] = {d: fDateMillis, c: 0};
      }
      freq[fDateMillis].c++;
      return freq;
   },{});
   sneezeData = Object.keys(sneezeData).map((k, i)=>{
      return [new Date(Number(sneezeData[k].d)),sneezeData[k].c];
   });
   let data = new google.visualization.DataTable();
   data.addColumn('date', 'Time');
   data.addColumn('number', 'Count');

   data.addRows(sneezeData);

   var options = {
      hAxis: { title: "Time" },
      vAxis: { title: "Count"},
      curveType: 'function',
      legend: { position: 'none'}
   };

   var chart = new google.visualization.LineChart(document.getElementById('sneeze_frequency'));

   chart.draw(data, options);
}

function drawSneezeTopFive() {
   let sneezeData = store.getState().sneezeList.reduce((topFive, sn)=>{
      if(!topFive[sn.reporter]){
         topFive[sn.reporter] = 0;
      }
      topFive[sn.reporter]++;
      return topFive;
   },{});
   let colors = ['red','blue','green','purple','orange'];
   sneezeData = Object.keys(sneezeData).map((k, i)=>{
      return [k,sneezeData[k],'color:'+colors[i]];
   });
   console.log('sneezeData: ', sneezeData);
   let data = new google.visualization.DataTable();
   data.addColumn('string', 'Username');
   data.addColumn('number', 'Count');
   data.addColumn({type:'string',role:'style'})

   data.addRows(sneezeData);


   var options = {
      hAxis: { title: "Usernames"},
      vAxis: { title: "Count"},
      legend: {position: 'none'}
   };

   var chart = new google.visualization.ColumnChart(document.getElementById('sneeze_top_five'));

   chart.draw(data, options);
}

class SneezeFrequency extends Component {
   render(){
      return (
         <div id="sneeze_frequency"></div>
      )
   }
}

class SneezeTopFive extends Component {
   render(){
      return (
         <div id="sneeze_top_five"></div>
      )
   }
}

const formattedSeconds = (sec) => {
   var hours = Math.floor(sec/3600);
   var mins = Math.floor(sec/60).toString().slice(-2);
   return hours + ":" + mins + ":" + ('0' + sec % 60).slice(-2);
}


class StopWatch extends Component {
   constructor(props){
      super(props);
      this.state = {
         secondsElapsed: 0
      }

   }
   render(){
      return (
         <div className="row">
            <div className="col-sm-6">
               <h2>Since last sneeze:</h2>
            </div>
            <div className="col-sm-6">
               <h2>{formattedSeconds(this.state.secondsElapsed)}</h2>
            </div>
         </div>
      )
   }
   componentDidMount(){
      let lastSneeze = Math.floor(Number(store.getState().sneezeList[0].time)/1000);
      let getDiff = () => {
         let curTime = Math.floor((new Date().getTime())/1000);
         return curTime - lastSneeze;
      }
      var diff = getDiff();
      this.setState({secondsElapsed:diff});
      setInterval( () => {
         return this.setState({
            secondsElapsed: this.state.secondsElapsed + 1
         });
      }, 1000);
   }
}

var SneezesDashboard = React.createClass({
   render: ()=>{
      return(
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
                     <div className="panel-body" style={{textAlign: 'center'}}><h2>Sneeze Count: {store.getState().sneezeList[0].count}</h2></div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Recent</h4>
                     </div>
                     <div className="panel-body">
                        <table className="table table-striped table-hover">
                           <thead>
                              <tr>
                                 <th><h4>Date</h4></th>
                                 <th><h4>Reporter</h4></th>
                                 <th><h4>Count</h4></th>
                              </tr>
                           </thead>
                           <tbody>
                           {
                              store.getState().sneezeList.slice(0,20).map((sneeze) =>{
                                 return (
                                    <SneezeItem sneeze={sneeze} key={sneeze.id} />
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
                     <div className="panel-body">
                        <StopWatch />
                     </div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Top 5 Reporters</h4>
                     </div>
                     <div className="panel-body">
                        <SneezeTopFive />
                     </div>
                  </div>
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h4>Daily Frequency</h4>
                     </div>
                     <div className="panel-body">
                        <SneezeFrequency/>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      )
   },
   componentDidMount:()=>{
      drawSneezeFrequency();
      drawSneezeTopFive();
   }
});

class NotReady extends Component {
   render(){
      return (
         <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
            <h1>Not Ready Yet!</h1>
         </div>
      )
   }
}

class Dashboard extends Component {
   render() {
      return (
         <div>
         {(() => {
           switch (store.getState().sidebar.filter((i)=>{return i.active})[0].name) {
             case "Sneezes":
               return <SneezesDashboard/>;
             default:
               return <NotReady />;
           }
         })()}
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
