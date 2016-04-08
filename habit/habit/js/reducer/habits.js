
var initialState={
  model:[],
  filteredModel:[]
}

export default function reducer(state, action){
  if(typeof(state)==='undefined'){
    return initialState; //initial state
  }
  switch (action.type){
    case 'UPDATE': //whenever we make a call to RestApi. Update model, but filterList should also be reseted
                   //because habitListiing (what user sees) read from filteredModel 
      return Object.assign({}, state, {model: action.data, filteredModel: action.data});

    case 'FILTER':
      var jarray = state.model.filter(function(item){
        if(item.description.indexOf(action.text) > -1){ //check if the habit description contain the substring
          return true;
        }else{
          return false;
        }
      });
      return Object.assign({}, state, {filteredModel: jarray});

    case 'UPDATE_HABIT_COMPLETED':
    console.log("in update habit");
      var jarray = JSON.parse(JSON.stringify(state));
      jarray.model.forEach(function(item){
        if (item.habitid == action.data.id){
          item.startDate = action.data.startDate;
          return;
        }
      })
      jarray.filteredModel.forEach(function(item){
        if (item.habitid == action.data.id){
          item.startDate = action.data.startDate;
          return;
        }
      })

      return jarray;

  }
  return state;
}
