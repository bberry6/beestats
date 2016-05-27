
const sidebarVisible = (state = true, action) => {
   switch(action.type){
      case "TOGGLE_VISIBILITY":
         return !state;
      default:
         return state;
   }
};


module.exports = sidebarVisible;
