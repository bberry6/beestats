const classNames = require('classnames');
import {Component} from 'react';
import {connect} from 'react-redux';

const Option = ({active, img, name, sidebarVisible, onClick}) => (
   <li className={classNames({'active': active})} onClick={onClick}>
      <a href="#">
         <img src={img} style={{marginRight: "10px", marginLeft: "-10px"}} />
         <span>{sidebarVisible ? name : ''}</span>
      </a>
   </li>
)

const mapStateToProps = ( state, props ) => {
   return {
      active: props.opt.active,
      img: props.opt.img,
      name: props.opt.name,
      sidebarVisible: state.sidebarVisible
   };
};

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onClick: () => {
         console.log('option ownprops: ', ownProps);
         dispatch({
            name: ownProps.opt.name,
            id: ownProps.opt.id,
            img: ownProps.opt.img,
            type: 'CHANGE_SCENE'
         });
      }
   };
};

const SidebarOption = connect(
   mapStateToProps,
   mapDispatchToProps
)(Option);

module.exports = SidebarOption;
