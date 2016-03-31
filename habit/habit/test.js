import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { connect } from 'react-redux';
"use strict";

function red(state, action){
  if(typeof(state)==='undefined'){
    return {};
  }
  switch (action.type){
    case 'UPDATE':
    return action.data;
    case 'DELETE':

      var jarray = JSON.parse(JSON.stringify(state));
  console.log("the array: " + state);
      jarray.forEach(function(item){
        delete item[action.data];
      })
    return jarray;
  }
  return state;
}

var store = createStore(red);

var Start = React.createClass({
  render: function(){
    return(
      <div>
         the second habit is:  {JSON.stringify(this.props.data)}
         <UserInput />
      </div>
    )
  }
})

var UserInput = React.createClass({
    handleClick: function(){
      var serverRequest = $.get("/health1/server/habit/user", {userid:123}, function(result){
        result = JSON.parse(result);
        store.dispatch({type:'UPDATE', data: result});
      });
    },
    handleDeleteClick: function(){
      var value = document.getElementById('deleteIt').value;

      store.dispatch({type: 'DELETE', data:value})

    },
    render: function(){
      return(
        <div>
        <button onClick={this.handleClick}>click me to update</button>
        <input type= "text" id = "deleteIt"></input>
        <button onClick={this.handleDeleteClick}>click me to deletee</button>
        </div>
    )
  }
})

function mapStateToProps(state){
  return {data: state}
}

var NewComponent = connect(mapStateToProps)(Start)

ReactDom.render(
  <Provider store={store}>
  <NewComponent />
  </Provider>,
  document.getElementById('myDiv')
)








// var Hello = React.createClass({
//   getInitialState: function(){
//     return{
//       data:[]
//     }
//   },
//   render: function(){
//     return(
//       <div>
//       <Greeting name = {this.props.name} />
//       <FormInput />
//       </div>
//     );
//   }
// })
//
// var FormInput = React.createClass({
//   handleChange: function(event){
//     store.dispatch({type: "ADD",  text: event.target.value});
//   },
//   render: function(){
//     return(
//     <form>
//       please enter your pet name: <input type="text" onChange={this.handleChange}></input>
//     </form>
//   )
//   }
// })
//
//
//
// var Greeting = React.createClass({
//   getInitialState: function(){
//     return {
//       counter: 0
//     }
//   },
//   changeCounter: function(pro){
//     if (pro == "next"){
//       this.setState({counter: this.state.counter + 1});
//     }else{
//       this.setState({counter: this.state.counter - 1});
//     }
//     console.log(this.state.counter);
//   },
//   render: function(){
//
//     return(
//       <div>
//       hello World, {this.props.name}
//       <NewComponent name = {this.state.counter}/>
//       <AllButton handleClick = {this.changeCounter} />
//       </div>
//     )
//   }
// })
//
// var AllButton = React.createClass({
//   userClick: function(pro){
//     this.props.handleClick(pro);
//   },
//   render: function(){
//     return(
//       <div>
//       <button onClick={this.userClick.bind(this, "next")}>next</button>
//       <button onClick={this.userClick.bind(this, "previous")}>previous</button>
//       </div>
//     )
//   }
//
// })
//
// var Pet = React.createClass({
//   render: function(){
//     return(
//       <div>
//       Your name is: {this.props.name} <br />
//       Your pet name is: {this.props.petName}
//       </div>
//     )
//   }
// })
//
// var mapStateToProps = function(state){
//   console.log("mapping state is " + JSON.stringify(state));
//     return {petName:JSON.stringify(state.pet.breed)};
// };
// var NewComponent = connect(mapStateToProps)(Pet);
//
//
// var initialState = {
//   person: {
//             name: "",
//             age: ""
//  },
//   pet: {
//       breed: ""
//   }
//
// }
//
// function reducer(state, action){
//   console.log(JSON.stringify(state));
//   if(typeof(state) === 'undefined'){
//     return initialState;
//   }
//   switch(action.type){
//     case "ADD":
//       return Object.assign({}, state, {pet: {breed : action.text} });
//
//   }
//   return state;
// }
//
// var store = createStore(reducer);
//
//
// ReactDom.render(
//   <Provider store = {store}>
//     <Hello name={"Veagle"}/>
//   </Provider>,
//   document.getElementById("myDiv")
// )
