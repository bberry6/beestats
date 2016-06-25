// dependencies
const React = require("react");
const ReactDOM = require("react-dom");
const Redux = require('redux');
const io = require('socket.io-client');
const classNames = require('classnames');

// components
const Sidebar = require("./components/sidebar/sidebar.jsx");
const Dashboard = require("./components/dashboard/dashboard.jsx");

// reducers
const sidebar = require('./reducers/sidebar.jsx');
const sneezeList = require('./reducers/sneezeList.jsx')
const sidebarVisible = require('./reducers/sidebarVisible.jsx');
const swarmShots = require('./reducers/swarmshots.jsx');
const socketApi = require('./reducers/socketApi.jsx');

// build app.
const { combineReducers } = Redux;
const beeStatsApp = combineReducers({
   sidebar,
   sidebarVisible,
   sneezeList,
   swarmShots,
   socketApi
});

window.React = React;

// get store
const { createStore } = Redux;
const store = createStore(beeStatsApp);
const { Component } = React;
import { Provider } from 'react-redux';

const init =  () => {
   // render app
   const render = () => {
      ReactDOM.render( <Provider store={store}>
         <div>
         <Sidebar/>
         <Dashboard/>
         </div>
         </Provider>,
         document.getElementById("root")
      );
   }
   store.subscribe(render);
   render();

   // init socket.io
   let socket = io(window.location.protocol + "//" + window.location.host);
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
   socket.on('initSwarmshots', (data) => {
      store.dispatch({
         type: "INIT_SHOTS",
         swarmshots: data
      });
   });
   socket.on('twitchAuthed', data => {
      store.dispatch({
         type: "TWITCH_AUTHED",
         user: data.user,
         perms: data.perms
      });
   });
   store.dispatch({
      type: "CONNECTED",
      socket
   });

   Twitch.events.addListener('auth.login', function(){
      socket.emit('twitchAuthLogin', Twitch.getToken());
      $('.twitch-connect').hide();
      $('.twitch-disconnect').show();
   });
   Twitch.events.addListener('auth.logout', function(){
      socket.emit('twitchAuthLogout');
      $('.twitch-connect').show();
      $('.twitch-disconnect').hide();
   });

   Twitch.init({clientId: 'sdueuuz1fe2m3m8lnmnfkxr0tlzckbl'}, function(err, status){
      //console.log('initilized after login');
   });
}

// render when google is done loading
google.charts.setOnLoadCallback(init);
