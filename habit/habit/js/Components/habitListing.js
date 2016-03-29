import React from "react";
import constant from "../../config/config.js"; //contants all constants

"use strict";
  //this Component is only for storing the habits data from server
  //the root component for the habit listing section
  var HabitModel = React.createClass({
    getInitialState: function(){
      return {
        data: []
      };
    },
    componentDidMount: function(){
      console.log("let's mount");
      this.serverRequest = $.get(this.props.source, {userid:this.props.userid, token: this.props.token}, function(result){
        result = JSON.parse(result);
        this.setState({
          data: result
        });
        console.log("finish mount");
      }.bind(this));
    },
    render: function() {
      console.log("let's render");
      return (
        <div>
        <NavHabit dataList={this.state.data} />
        </div>
      );
    }
  });

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

      // componentDidUpdate: function(){
      //   $(".habits_display").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
      // },

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
            <div id="habit-section">habit list follows:
              <div id = "habit_wrapper">
                <ul id = "habit_list">
                {   newList.map(function(dataRow, i) { //mapping each habit that need to display to a li element, and whenever each item is clicked it will trigger a modal
                  if (dataRow != undefined){
                    console.log("add habits display");
                    return  <li className="habits_display" key={i} onClick={this.handleCurrentHabit.bind(this, dataRow)} href="#current_habit_modal">{dataRow.description}</li>
                  }else{
                    return <li className="habits_display" key={i} onClick={this.handleCurrentHabit.bind(this, "")}href="#current_habit_modal">Click add more to add a new habit here</li>
                  }
                }, this)
                //each list habit item can trigger the modal to appear when clicked, this is made possible with a Jquery plugin that get initialize later on
              }
              <hr></hr>
                  <li className = " text-center" id="add_more" style = {{marginTop: '30px', marginLeft: '8px', borderRadius: '6px 16px 16px 116px', MozBorderRadius: '6px 16px 16px 116px', WebkitBorderRadius: '6px 16px 16px 116px'}} href="#habit_input_modal">add more</li>
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
        (this.props.maxPage==0) ? temp = "disabled" : "";
        if(this.props.currentPageNum == 1){
              prevClassName = "pagination-previous disabled";
              nextClassName = "pagination-next" + temp;
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
      render: function(){
        //If user clicked on a habit on the listing, display the info, else display empty
        var popup =   (this.props.habit != "") ?
        <div>
          "The habit you clicked on is: "
          <br />
          "description:"
          {this.props.habit.description} <br />
          "start day:" {this.props.habit.startDate} <br />
          "goal day:" {this.props.habit.goalDate} <br />
        </div>
        :
        "Nothing to see here" ;
        return(
          <div id = "current_habit_modal">
            {popup}
          </div>
        )
      }
    });


export default HabitModel;
