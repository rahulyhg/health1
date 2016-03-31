
initialState={
  model:[],
  filteredModel:[]
}

export default function reducer(state, action){
  if(typeof(state)==='undefined'){
    return {}; //initial state
  }
  switch (action.type){
    case 'UPDATE':
    return action.data;

    case 'DELETE':
    var jarray = JSON.parse(JSON.stringify(state));
    jarray.forEach(function(item){
      delete item[action.data];
    })
    return jarray;

    case 'FILTER':
    var jarray = state.filter(function(item){
      if(item.description.indexOf(action.text) > -1){ //check if the habit description contain the substring
        return true;
      }else{
        return false;
      }
    });
    return jarray;

  }
  return state;
}
