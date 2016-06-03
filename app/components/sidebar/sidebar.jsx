let SidebarOption = require("./option.jsx");
const React = require('react');
const { Component } = React;

const sidebarDisplay = ({sidebar, sidebarVisible}) =>(
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
)

const mapStateToProps = (state) => {
   return {
      sidebar: state.sidebar,
      sidebarVisible: state.sidebarVisible
   };
};

/*
const mapDispatchToProps = (dispatch) =>{
   return {
      onClick: (id) => { dispatch({...}) }
   };
};
*/

import { connect } from 'react-redux';

const Sidebar = connect(
   mapStateToProps
)(sidebarDisplay);

module.exports = Sidebar;
