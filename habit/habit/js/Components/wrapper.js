import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import store from '../store/store';

import { Link } from 'react-router';

var Wrapper = React.createClass({


  getInitialState: function(){
    return {
      loggedIn: 0 //default is 0 
    }
  },
  //since wrapper is the component that will get rendered first, getting the model from RestAPI here vs getting it
  //in graph or home component will enable user to go into graph or home route directly without worrying that the model
  //hasnt been GET yet
  //once RestApi response back, this will send a dispatch to redux store. There it will update the store and pass
  //the nesscary data to graph or home component, forcing them to re-render with the updated data
  componentDidMount: function(){
      var userId = 123; //for testing purposes
      if (sessionStorage.userid){
        userId = sessionStorage.userid;
      }

      var serverRequest = $.get("/health1/server/habit/user", {userid: userId}, function(result){
        result = JSON.parse(result);
        //have to parse completed_Days into an Array
        result.forEach(function(item){
            item.completed_Days = (item.completed_Days == null) ? [] : item.completed_Days.split(",");
        });

        store.dispatch({type:'UPDATE', data: result});
      });
  },

  render: function(){
    return(
      <div>
        <div className="header"></div>

        <ReactCSSTransitionGroup transitionName="route" transitionEnterTimeout={1000} transitionLeaveTimeout={300}>

          {React.cloneElement(this.props.children, {key:this.props.location.pathname})}

        </ReactCSSTransitionGroup>

        <ul id="route-navi-bar">
          <li> <Link to="/">Home</Link></li>
          <li> <Link to="/graph">Graph</Link></li>
          <li> <Link to="/contact">Contact</Link></li>
          <li>Random</li>
        </ul>
      </div>
    )
  }

});

export default Wrapper;
