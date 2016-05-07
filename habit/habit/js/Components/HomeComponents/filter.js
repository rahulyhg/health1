import React from 'react';
import store from '../../store/store';

var Filter = React.createClass({
  handleChange: function(event){
    store.dispatch({type:'FILTER', text: event.target.value});
  },
  render: function(){
    return(
    <div id ="filterDiv">
      <input type='text' placeholder='input your filter' onChange={this.handleChange}></input>
    </div>
    )
  }
})

export default Filter;
