import React from 'react';
import HabitModel from "./habitListing.js";
import AddingNewHabit from "./addingHabit.js"
import RewardComponent from './rankingHabit.js';
import Filter from './filter.js';
import Quote from './quote.js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

//This js file contain the main layout of the app
//all components here are presentational components, dumb components that doesnt compute anything
//only render and call other components from the other js components files
var HomeRoot = React.createClass({
  componentDidMount: function(){
    $("#reference").slideMenu({handler: 'click', icon: 'fa-user'});
  },
  render: function(){
    return(
      <div>
          <Filter />
          <ul id="reference">
            <li>Welcome,</li>
            <li>Veagle</li>
            <li><a>Log out</a></li>
            <li>Veagle</li>
          </ul>

          <div className = "wrapper-Clear">

            <div id = "wall-text">
              <p>Browse Your Habit Here</p>
            </div>
            <UpperLeft />

            <div id = "introduction-section">
                <ul id = "arrows">
                  <li className='arrow'></li>
                  <li className='arrow'></li>
                  <li className='arrow'></li>
                  <li><p>Click!</p></li>
                </ul>
                <IntroSection />
            </div>

            <UpperRight />

          </div>
          <div className="footer"></div>
      </div>
    )
  }
})


var UpperLeft = React.createClass({
  render: function(){
    return(
      <div id = "upper-left">

        <div id = "habit_listing">
          <HabitModel />
        </div>

        <div id ="new_habit_popup">
          <AddingNewHabit />
        </div>

      </div>
    )
  }
});


var IntroSection = React.createClass({
    render: function(){
        return(

          <div id = "intro-text">

            <ReactCSSTransitionGroup transitionName="introFirst" transitionAppear={true} transitionAppearTimeout={3000} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                <span key={"hello"}>  Hello, </span>
            </ReactCSSTransitionGroup>

            <br />

            <ReactCSSTransitionGroup transitionName="introSecond" transitionAppear={true} transitionAppearTimeout={3000} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
              <p>Welcome to a start</p>
            </ReactCSSTransitionGroup>

              <p>... of something <span >Wonderful</span> ...</p>

            <br />
            <div id="quotation-section">
              <Quote />
            </div>
          </div>
        )
    }
})

var UpperRight = React.createClass({
  render: function(){

    return(
      <div id = "upper-right">
        <RewardComponent />
      </div>
    )
  }

});


export default HomeRoot;
