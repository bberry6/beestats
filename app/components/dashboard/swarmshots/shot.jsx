const React = require('react');
const { Component } = React;

class Shot extends Component {
   render(){
      let {store} = this.props;
      return(
         <div className="col-md-3 thumb">
            <a className="thumbnail" href="#" onClick={()=>
               store.dispatch({
                  type:'SELECT_SHOT',
                  selectedImg: this.props.img
               })
            }>
               <img className="img" src={this.props.img} alt/>
            </a>
         </div>
      )
   }
}
module.exports = Shot;
