
const swarmShots = (state = [], action) => {
   switch(action.type){
      case 'INIT_SHOTS':
         return action.swarmshots;
      case 'SELECT_SHOT':
         return state.map((shot)=>{shot.selected = shot.img === action.selectedImg; return shot; });
      default:
         return state;
   }
};

module.exports = swarmShots;
