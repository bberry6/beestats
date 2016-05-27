const React = require('react');
const { Component } = React;

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

module.exports = SneezeItem;
