import React from "react";
import { connect } from 'react-redux';
import constant from "../../config/config.js"; //contants all constants
import store from '../store/store';
import '../../plugins/calendar/jquery.pickmeup.min.js';
"use strict";



  //this Component is only for storing the habits data from server
  //the root component for the habit listing section
  var HabitModel = React.createClass({
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
        <NavHabit dataList={this.props.data} />
        </div>
      );
    }
  });

  var mapStateToProps = function(state){
    return {data: state.filteredModel}
  }

  var NewHabitModelCreatedByRedux = connect(mapStateToProps)(HabitModel)

  //This is the immediate child of root
  var NavHabit = React.createClass(
    {
      getInitialState: function(){
        return{
          pageNum: 1,
          currentHabit: []
        }
      },
      handleUserClick: function(pageFlip){ //pageFlip: a positive num means the user clicked next, a negative means previous page
        var maxPage = Math.ceil(this.props.dataList.length/constant.DISPLAYING_AMOUNT);

        if ( (this.state.pageNum != 1 || pageFlip != -1) &&
             (this.state.pageNum != maxPage || pageFlip != 1) &&
             (this.state.pageNum != 1 || pageFlip != 1 || maxPage != 0)
           ){
          this.setState({
            pageNum: this.state.pageNum + pageFlip
          });
        }
      },
      handleCurrentHabit: function(data){
        this.setState({
          currentHabit: data
        });
      },
      render: function(){
        console.log("everything get rerender");
        return (
          <div>
          <HabitList
          pageNumber={this.state.pageNum}
          list={this.props.dataList}
          onHabitClick={this.handleCurrentHabit}
          />
          <PageNav
          onUserClick={this.handleUserClick}
          currentPageNum={this.state.pageNum}
          maxPage={Math.ceil(this.props.dataList.length/constant.DISPLAYING_AMOUNT)}
          />
          <CurrentHabit
          habit={this.state.currentHabit}
          />
          </div>
        )
      }
    });

    var HabitList = React.createClass({

      //this callback is to tell parent (NavHabit) which habit is clicked, so CurrentHabit component will render the selected habit info
      handleCurrentHabit: function(data){
        this.props.onHabitClick(data);
      },

      render: function(){
        var newList = [];
        //get the current page number from parent(NavHabit) so we can determine which habits to display
        var start = (this.props.pageNumber-1) * constant.DISPLAYING_AMOUNT;
        var end = start + constant.DISPLAYING_AMOUNT - 1;

        //pushing the habit item that need to display to newList
        for (var i=start; i <= end; i++){
              newList.push(this.props.list[i]);
        }

        return (
            <div id="habit-section"> <p>Browse your habits below:</p>
              <div id = "habit_wrapper">
                <ul id = "habit_list">
                {   newList.map(function(dataRow, i) { //mapping each habit that need to display to a li element, and whenever each item is clicked it will trigger a modal
                  if (dataRow != undefined){
                    console.log("add habits display");
                    return  <li className="habits_display" key={i} onClick={this.handleCurrentHabit.bind(this, dataRow)} href="#current_habit_modal">{dataRow.description}</li>
                  }else{
                    return <li className="habits_display" key={i} onClick={this.handleCurrentHabit.bind(this, "")} href="#current_habit_modal" style={{color: 'white'}}>Click below to add a new habit</li>
                  }
                }, this)
                //each list habit item can trigger the modal to appear when clicked, this is made possible with a Jquery plugin that get initialize later on
              }
              <hr></hr>
                  <li className = " text-center" id="add_more" href="#habit_input_modal">It begins here</li>
                </ul>
              </div>
            </div>
        );
      }
    });

    //Direct child of NavHabit, use to handle the Page number
    var PageNav = React.createClass({
      handleClicks: function(page){
        this.props.onUserClick(page);
      },
      render: function(){
        var prevClassName = "";
        var nextClassName = "";
        var temp = "";
        (this.props.maxPage==0 || this.props.maxPage==1) ? temp = "disabled" : "";
        if(this.props.currentPageNum == 1){
              prevClassName = "pagination-previous disabled";
              nextClassName = "pagination-next " + temp;
        }else if(this.props.currentPageNum == this.props.maxPage){
              prevClassName = "pagination-previous";
              nextClassName = "pagination-next disabled";
        }else{
              prevClassName = "pagination-previous";
              nextClassName = "pagination-next";
        }
        return(
          <div id = "habit_listing_nav">
            <ul className="pagination text-center" role="navigation" aria-label="Pagination">
              <li className={prevClassName} onClick={this.handleClicks.bind(this, -1)}>
              {(this.props.currentPageNum == 1
                  ? "Previous"
                  : <a>Previous</a>
                )}
              </li>
              <li className={nextClassName} onClick={this.handleClicks.bind(this, 1)}>
                {(this.props.currentPageNum == this.props.maxPage || this.props.maxPage == 0
                    ? "Next"
                    : <a>Next</a>
                  )}
              </li>
            </ul>
          </div>
        );
      }
    });

    var CurrentHabit = React.createClass({

      componentDidUpdate : function(prevProps){
        var main = this;
        $('#calendar_button').pickmeup({
          mode: 'multiple',
          format: 'Y-m-d',
          position: 'bottom',

          before_show: function(){
            var self = $(this); // dont think u need the $
            //the following is nesscary because pickmeup set_date mutiate the array
            var completed_Days = JSON.parse(JSON.stringify(main.props.habit.completed_Days));

            if (completed_Days.length > 0){
                self.pickmeup('set_date', completed_Days);
            }else{
                self.pickmeup('clear'); //if there is no completed days, clear it, so it wont show the previous viewed habit days
            }
          },

          hide: function(){
            var self = $(this);
            var habitID = main.props.habit.habitid;
            //newDates: contain all the completed dates
            //oldDates: are the completed dates before this current user selection
            //we use both to update RestApi. If both success we can just update
            //client habit model with newDates
            var newDates = self.pickmeup('get_date', true);
            var oldDates = main.props.habit.completed_Days;

            var newlyAddedDays = newDates.filter(function(item){
              return !oldDates.some(function(item2){
                return item == item2;
              });
            });

            var deletedDays = oldDates.filter(function(item){
              return !newDates.some(function(item2){
                return item == item2;
              });
            });

            if (newlyAddedDays.length > 0){ // there were newly added dates, PUT to restapi
              $.ajax({
                type: 'PUT',
                data: {completed: JSON.stringify(newlyAddedDays)},
                url: '/health1/server/habit/days/' + habitID,
                success: function(data){
                  //successful call to restapi, so we can update current viewing
                },
                error: function(data){
                  alert("ERROR writing to server, couldnt update habit" + JSON.stringify(data));
                }
              });
            }

            if (deletedDays.length > 0 ){ // there were deleted dates, DELETE to restapi
              $.ajax({
                type: 'DELETE',
                data: {completed: JSON.stringify(deletedDays)},
                url: '/health1/server/habit/days/' + habitID,
                success: function(data){
                  //successful call to restapi, so we can update current viewing
                },
                error: function(data){
                  alert("ERROR writing to server, couldnt delete days" + JSON.stringify(data));
                }
              });
            }
            //update the client's habit model, note even if failed to upload to server
            //it will still update user UI (for presenting to employer purpose)
            //if server fail it will alert
            store.dispatch(
              {
                type:'UPDATE_HABIT_COMPLETED',
                data: {
                  id: habitID,
                  completed_Days: newDates
                }
              });
            }
          });
          return true;
        },

    convertNumToDay: function(i){
        return ["M","T","W","Th","Fri","Sat","Sun"][i-1];

    },
    convertNumToFreq: function(i){ //see config.js for constant
        if(constant.DAILY == i){ return "Daily"}
        else if(constant.WEEKLY == i){return "Weekly"}
        else if(constant.BIWEEKLY == i){return "BiWeekly"}
    },
    render: function(){
        console.log("render");
        //If user clicked on a habit on the listing, display the info, else display empty
        if (this.props.habit != ""){
          var completedDate = this.props.habit.completed_Days;
          var popup =
          <div id="habit_detail_list_wrapper">

              <ul className="habit_detail_list">

                <li>Description <div>
                                  {this.props.habit.description}
                                </div>
                </li>
                <li>Planned Start Day <div>
                                      {this.props.habit.startDate}
                                      </div>
                </li>
                <li>Completed dates <div> <ul className = "checkbox-grid">
                              {
                                 completedDate.sort().map(function(item, i){
                                    return <li key={i}> {item} </li>
                                })
                              }
                              <div className="wrapper-Clear-Flow" />
                              </ul> </div>
                </li>
                <li>Frequency <div>{this.convertNumToFreq(this.props.habit.frequency)}</div>
                </li>
                <li>Planned days <div>{
                                        this.props.habit.day.split("").sort().map(function(item){
                                            return this.convertNumToDay(item) + " ";
                                        }, this)

                                      }</div>
                </li>
                <div className="wrapper-Clear-Flow" />
              </ul>
            <div id ='calendar_button' className ="text-center"> Open Calendar </div>
          </div>
        }else{
          var popup ="Nothing to see here" ;
        }

        return(
          <div id = "current_habit_modal" >
            {popup}
          </div>
        )
      }
    });


export default NewHabitModelCreatedByRedux;
