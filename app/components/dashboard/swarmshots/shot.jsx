
import {Component} from 'react';
import {connect} from 'react-redux';

const ShotImg = ({img, onClick}) => (
   <div className="col-md-3 thumb">
      <a className="thumbnail" href="#" onClick={ onClick }>
         <img className="img" src={img} alt/>
      </a>
   </div>
)

const mapStateToProps = (state, props) => {
   return {
      img: props.img
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onClick: () => {
         dispatch({
            type: "SELECT_SHOT",
            selectedImg: ownProps.img
         });
         $('#imagemodal').modal('show');
      }
   }
}

const Shot = connect(
   mapStateToProps,
   mapDispatchToProps
)(ShotImg);

module.exports = Shot;
