const React = require('react');
const { Component } = React;

class ShotModal extends Component {
   render(){
      return(
         <div style={{float:'left'}} className="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
               </div>
               <div className="modal-body">
                 <img src={this.props.img} className="imagepreview"/>
               </div>
             </div>
           </div>
         </div>
      )
   }
   componentDidMount(){
      $('#imagemodal').on('show.bs.modal', fixModalDisplay);
   }
   componentWillUnmount(){
      $('#imagemodal').off('show.bs.modal', fixModalDisplay);
   }
}

function fixModalDisplay(){
   $('.modal .modal-body').css('max-height',$( window ).height()*0.8);
   $('.modal .modal-body').css('height',$( window ).height()*0.8);
   $('.modal .modal-body').css('overflow-y','auto');
}

module.exports = ShotModal;
