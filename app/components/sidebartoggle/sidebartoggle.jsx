const React = require('react');
const { Component } = React;
const FontAwesome = require('react-fontawesome');

class SidebarToggle extends Component {
   render(){
      const {store} = this.props;
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

module.exports = SidebarToggle;
