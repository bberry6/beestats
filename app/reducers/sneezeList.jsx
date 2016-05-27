
const sneezeList = (state = [], action) => {
   switch(action.type){
      case 'ADD_SNEEZE':
         return [
            {
            reporter: action.reporter,
            count: action.count,
            time: action.time
         },
         ...state];
      case 'INIT_SNEEZES':
         return action.sneezes;
      default:
         return state;
   }
};

module.exports = sneezeList;
