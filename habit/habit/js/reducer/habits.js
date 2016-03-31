
var initialState={
  model:[],
  filteredModel:[]
}

export default function reducer(state, action){
  if(typeof(state)==='undefined'){
    return initialState; //initial state
  }
  switch (action.type){
    case 'UPDATE': //whenever we make a call to RestApi. filterList should also be reseted
    //return action.data;
    return Object.assign({}, state, {model: action.data, filteredModel: action.data});
    //
    // case 'DELETE':
    // var jarray = JSON.parse(JSON.stringify(state));
    // jarray.forEach(function(item){
    //   delete item[action.data];
    // })
    // return jarray;

    case 'FILTER':
    var jarray = state.model.filter(function(item){
      if(item.description.indexOf(action.text) > -1){ //check if the habit description contain the substring
        return true;
      }else{
        return false;
      }
    });
    return Object.assign({}, state, {filteredModel: jarray});

  }
  return state;
}
