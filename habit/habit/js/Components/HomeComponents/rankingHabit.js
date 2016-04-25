import React from 'react';
import store from '../../store/store';
import {connect} from 'react-redux';


var RankingRoot = React.createClass({
  render: function(){
    return(
      <ComputeRanks list={this.props.habitModel} />
    );
  }
});

var mapStateToProps = function(state){
    return {habitModel: state.model}
}

var ReduxRankingRoot = connect(mapStateToProps)(RankingRoot); //now reduxrankingRoot replaced RankingRoot

var ComputeRanks = React.createClass({
  getInitialState: function(){
    return {
            new_Notify_Counts: 0
    }
  },
  handleCounts: function(change){
    console.log("in counts");
      this.setState({new_Notify_Counts: this.state.new_Notify_Counts + change});
  },
  render: function(){
      var list = this.props.list.slice(0);
      list.sort(function(a, b){
         return b.completed_Days.length - a.completed_Days.length;
      }); //<Notification counts = {this.state.new_Notify_Counts}/>
    return(
      <div className = "text-center">
        <NotificationCount counts = {this.state.new_Notify_Counts} /> <span id="section-title">Achievements/Rewards</span>
        <DisplayLogic sortedList = {list}
                     changeCounts = {this.handleCounts}
        />
      </div>
    );
  }
})


var DisplayLogic = React.createClass({
  getInitialState: function(){
    return{
      changedHabit: [] //an array of habitID that was changed
    }
  },
  componentWillReceiveProps: function(nextProps){
    console.log("entering displaylist componentWillReceiveProps");
    //this.props.list hold the current list, nextProps.list holds the coming in new list
    //check changing. Find the changed habitID, store it in the startDate
    //then in render give the changedHabit a different css color.
    //also a new change/a new push to changedHabit, add one to Notification

    //also do a handle click, when a li is clicked, check if habitID is in changedHabit list, if it is
    //decrement parent notification count
    var self = this;
    var firstList = this.props.sortedList;
    var secondList = nextProps.sortedList;

    //find the unique (newly) added item
    var uniqueInSecond = secondList.filter(function(obj) {
      return !firstList.some(function(obj2) {
        return obj.habitid == obj2.habitid;
      });
    });

    //check for extra new habit from the newly coming props, find it and store in
    //this.state.changedHabit for rendering
    uniqueInSecond.forEach(function(item){
      self.props.changeCounts(1);
      self.setState({changedHabit: self.state.changedHabit.concat(item.habitid)});
    });

    //if there wasnt any newly coming props, there might have been a change in
    //one of the habits, find it and store in this.state.changedHabit for rendering
    if (uniqueInSecond.length == 0){
      console.log("enter find duplicate change ")
      for (var i = 0; i < firstList.length; i++){
        for (var j = 0; j < secondList.length; j++){
          if (firstList[i].habitid == secondList[j].habitid){
            if(JSON.stringify(firstList[i]) != JSON.stringify(secondList[j])){
              //get here when the two element has the same habitId but different contents
              if (self.state.changedHabit.indexOf(firstList[i].habitid) == -1){
                self.props.changeCounts(1);
                self.setState({changedHabit: self.state.changedHabit.concat(firstList[i].habitid)});
              }
              break;
            }
          }
        }
      }
    }
  },
  handleMouse: function(event){
    event.currentTarget.style.backgroundColor = 'white';
    this.props.changeCounts(-1); //since the user clicked on one of the newly added list item, we should decrement one of the notification count

    //take out the clicked li element, which will triger a re-rendering
    //so the clicked li element will not have a click handler on it
    var newArr = this.state.changedHabit.filter(function(item){
      return item != event.currentTarget.id;
    })
    this.setState({changedHabit: newArr });
  },
  render: function(){
    return(
      <DisplayListing sortedList = {this.props.sortedList}
                      changedHabit = {this.state.changedHabit}
                      handleMouse = {this.handleMouse} />
    )
  }
});

var DisplayListing = React.createClass({
  render: function(){
    var self = this;
    return(
      <div id = "listing-boxes-wrapper">
        <ul className="listing-boxes">
          {
            this.props.sortedList.map(function(item, index){
              if (self.props.changedHabit.indexOf(item.habitid) > -1) {
                return  <li key={index} id = {item.habitid} style={{backgroundColor: '#DDDDDD'}} className = "text-center" onClick={self.props.handleMouse}>{item.description} : <br/>
                          <Awards days = {item.completed_Days} />
                          <DeleteHabit habitid= {item.habitid} />
                        </li>
              }else{
                return  <li key={index} className =" text-center">{item.description} : <br/>
                          <Awards days = {item.completed_Days} />
                          <DeleteHabit habitid= {item.habitid} />
                        </li>
              }
            })
          }
        </ul>
      </div>
    )
  }
})

var DeleteHabit = React.createClass({
  handleClick: function(habitid){
    //later, should also attach userid and token, for valification
    $.ajax({
       url: '/health1/server/habit/'+habitid,
       type: 'DELETE',
       success: function(result){
         //if successful delete it from redux store. so user can see the updateHabitListing via the frontend UI
           store.dispatch({type:'DELETE', id: habitid});
       }
    });
  },
  render(){
      return(
        <span onClick={this.handleClick.bind(this, this.props.habitid)}><i id= "delete-icon" className='fa fa-times'></i></span>
      )
  }

});



var Awards = React.createClass({
  render: function(){
    var count = 1;
    (this.props.days.constructor === Array) ? count = this.props.days.length: "";
    return(
      <div>Completed Counts: <span>{count}</span>
      </div>
    )
  }
});
var NotificationCount = React.createClass({
  render: function(){
    return(
      <span id='notification-bubble'>
      {this.props.counts}
      </span>
    )
  }
})
export default ReduxRankingRoot;
