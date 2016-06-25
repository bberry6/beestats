const R = require('ramda');


const defaults = {
   selected: undefined,
   list: []
}

const swarmShots = (state = defaults, action) => {
   switch(action.type){
      case 'INIT_SHOTS':
         return Object.assign({}, state, {
            list: action.swarmshots
         });
      case 'SELECT_SHOT':
         return Object.assign({}, state, {
            selected: action.selected
         });
      case "ADD_SHOT":
         return Object.assign({}, state, {
            list: state.list.concat(action.newShot)
         });
      case "DELETE_SHOT":
         return Object.assign({}, state, {
            list: R.reject(R.whereEq(action.selected), state.list)
         });
      default:
         return state;
   }
};

module.exports = swarmShots;
