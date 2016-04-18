
var initialState={
  model:[],
  filteredModel:[],
  pastQuotes:[],
  quote: "Mistake",
  futureQuotes:[]
}

export default function habitsReducer(state, action){
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
          item.completed_Days = action.data.completed_Days;
          return;
        }
      })
      jarray.filteredModel.forEach(function(item){
        if (item.habitid == action.data.id){
          item.completed_Days = action.data.completed_Days;
          return;
        }
      })
      return jarray;

     case 'DELETE':
      var modelAfterDel = state.model.filter(function(item){
        return item.habitid != action.id;
      });
      var filteredModelAfterDel = state.filteredModel.filter(function(item){
        return item.habitid != action.id;
      });
      return Object.assign({}, state, {model: modelAfterDel, filteredModel: filteredModelAfterDel});


      //////for quote.js
      case 'SUBMIT_QUOTE':
        if(state.quote === action.newQuote){
          return state; //quote werent changed no need to do anything
        }
        var newPast = state.pastQuotes.slice();
        newPast.push(state.quote);
        //need to empty the future stack, cause after a new submit there shouldnt be any redo
        return Object.assign({}, state, {pastQuotes: newPast, quote: action.newQuote, futureQuotes: []});

      case "UNDO":
        if (state.pastQuotes.length <= 0){
          return state; //nothing to undo, return state
        }
        var newFuture = state.futureQuotes.slice();
        newFuture.push(state.quote);
        var newCurrent = state.pastQuotes[state.pastQuotes.length-1];
        var newPast = state.pastQuotes.slice(0, state.pastQuotes.length-1);

        return Object.assign({}, state, {pastQuotes: newPast, quote: newCurrent, futureQuotes: newFuture});

      case "REDO":
          if(state.futureQuotes.length <= 0){
            return state; //nothing to redo, return state
          }

          var newPast = state.pastQuotes.slice();
          newPast.push(state.quote);
          var newCurrent = state.futureQuotes[state.futureQuotes.length-1];
          var newFuture = state.futureQuotes.slice(0, state.futureQuotes.length-1);

          return Object.assign({}, state, {pastQuotes: newPast, quote: newCurrent, futureQuotes: newFuture});

    ///end of quote.js actions




  }
  return state;
}
