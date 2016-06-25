let SidebarOption = require("./option.jsx");
const React = require('react');
const { Component } = React;

const sidebarDisplay = ({sidebar, sidebarVisible, socketApi, onClickConnect, onClickDisconnect}) =>(
   <div>
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
         </div>
      </div>
      <footer className="footer" style={{position:'fixed',bottom:0, zIndex:1000 }}>
         <span className="twitch-connect" style={{cursor: 'pointer'}} onClick={onClickConnect}>
            <img src="http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_white.png" style={{"width": '30px'}}  href="#"/>
            Log-in
         </span>
         <span className="twitch-disconnect" style={{display: 'none', cursor: 'pointer'}} onClick={onClickDisconnect}>
            <img src="http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_white.png" style={{"width": '30px'}}  href="#"/>
            Logout: {(socketApi.user && socketApi.user.name) || ''}
         </span>
      </footer>
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
