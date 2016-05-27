const React = require('react');
const { Component } = React;

class NotReady extends Component {
   render(){
      return (
         <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
            <h1>Not Ready Yet!</h1>
         </div>
      )
   }
}

module.exports = NotReady;
