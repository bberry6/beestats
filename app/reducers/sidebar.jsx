var _scenes = [{name: 'Sneezes', img:'courtieFace.png', active: true},
               {name:'Bites (Soon™)',img: 'courtieBee.png'},
               {name:'Subs/Emotes (Soon™)',img:'courtieHeart.png'},
               {name: 'Homegames (Soon™)',img: 'courtieBam.png'},
               {name: 'Bad beats? (Soon™)', img: 'courtieTilt.png'}];
_scenes = _scenes.map((itm, idx) => {
   return Object.assign({}, {id: idx }, itm);
});
const sidebar = (state = _scenes, action) => {
   switch(action.type){
      case 'CHANGE_SCENE':
         return state.map((scene)=>{
            if(scene.active){
               var s= Object.assign({}, scene, {active: false});
               return s;
            }
            if(action.id === scene.id){
               return Object.assign({}, scene, {active: true});
            }
            return Object.assign({}, scene);
         });
      default:
         return state;
   }
};

module.exports = sidebar;
