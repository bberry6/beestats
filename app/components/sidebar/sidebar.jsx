let SidebarOption = require("./option.jsx");
const React = require('react');
const { Component } = React;

const sidebarDisplay = ({sidebar, sidebarVisible, socketApi, onClickConnect, onClickDisconnect}) =>(
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
         <footer className="footer">
            <img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png" className="twitch-connect" href="#" onClick={onClickConnect}/>
            <span className="twitch-disconnect" style={{display: 'none'}} onClick={onClickDisconnect}>
               <img src="http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_white.png"  href="#"/>
               {(socketApi.user && socketApi.user.name) || ''}
            </span>
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
      onClickConnect: ()=>{
         dispatch({
            type: "TWITCH_CONNECT"
         });
      },
      onClickDisconnect: () => {
         dispatch({
            type: "TWITCH_DISCONNECT"
         });
      }
   };
};

import { connect } from 'react-redux';

const Sidebar = connect(
   mapStateToProps,
   mapDispatchToProps
)(sidebarDisplay);

module.exports = Sidebar;
