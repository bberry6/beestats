
const socket = (state = {}, action) => {
   switch(action.type){
      case 'CONNECTED':
         return action.socket;
      default:
         return state;
   }
};

module.exports = socket;
