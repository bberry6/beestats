const classNames = require('classnames');
const React = require('react');
const { Component } = React;

class SidebarOption extends Component {
   componentDidMount(){
      const {store} = this.context;
      this.unsubscribe = store.subscribe(() => {
         this.forceUpdate();
      });
   }
   componentWillUnmount(){
      this.unsubscribe();
   }
   render(){
      let {store} = this.context;
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
SidebarOption.contextTypes = {
   store: React.PropTypes.object
};


module.exports = SidebarOption;
