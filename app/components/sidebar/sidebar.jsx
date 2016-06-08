let SidebarOption = require("./option.jsx");
const React = require('react');
const { Component } = React;

const sidebarDisplay = ({sidebar, sidebarVisible, socketApi, onClick}) =>(
   <div className="row">
      <div className="col-sm-3 col-md-2 sidebar">
         <div className="page-header" style={{marginTop:"-15px"}}>
            <h3>{sidebarVisible ? 'Bee Stats' : ''}</h3>
         </div>
         <ul className="nav nav-sidebar">
         {
            sidebar.map(function(s, idx){
               return (
                  <SidebarOption opt={s} key={idx} />
               );
            })
         }
         </ul>
         <footer class="footer">
            <img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png" class="twitch-connect" href="#" onClick={onClick.bind(null, socketApi)}/>
         </footer>
      </div>
   </div>
)

const mapStateToProps = (state) => {
   return {
      sidebar: state.sidebar,
      sidebarVisible: state.sidebarVisible,
      socketApi: state.socketApi
   };
};

const mapDispatchToProps = (dispatch) =>{
   return {
      onClick: (socketApi)=>{
         console.log('calling twitch login');

         let loginWindow = Twitch.login({
            redirect_uri: 'http://localhost:8001/closed.html',
            popup: true,
            scope:['user_read', 'channel_read']
         });

         let callback = () => {
            if(loginWindow &&
                  loginWindow.location &&
                  loginWindow.location.hash){
               let hash = loginWindow.location.hash
               let token = hash.slice(hash.indexOf('token=')+'token='.length, hash.indexOf('&'))
               console.log('stole token:', token);
               loginWindow.close();
               socketApi.emit('twitchAuthLogin', token);
               return;
            }
            setTimeout(callback, 200);
         }
         callback();

      }
   };
};

import { connect } from 'react-redux';

const Sidebar = connect(
   mapStateToProps,
   mapDispatchToProps
)(sidebarDisplay);

module.exports = Sidebar;
