import React from "react";
import formModel from "./../Model/HabitCreationModel.js";
import constant from "../../config/config.js"; //contants all constants

/*
*formModel: store state of forms information, and provide a api to manipulate the data
*  Used for the whole AddingNewHabit's components hierarchy
*/
"use strict";


    var AddingNewHabit = React.createClass({

      getInitialState: function(){
        return{
          progress: 0
        }
      },

      handleUserClick: function(direction){ //direction is either -1:left or 1:right
        var progressIncrement = 0;
        if(direction==-1 && this.state.progress!=0){
          progressIncrement = -25;
        }else if(direction==1 && this.state.progress!=100){
          progressIncrement = 25;
        }
        this.setState({progress: this.state.progress + progressIncrement});
      },

      resetProgress: function(){
        this.setState({progress: 0});
      },
      render: function(){
        return(

          <div id="habit_input_modal">
            <div id="instruction_header">
              <div className="success progress" role="progressbar" tabIndex={0} aria-valuenow={25} aria-valuemin={0} aria-valuetext="25 percent" aria-valuemax={100}>
                <ProgressBar progress={this.state.progress} />
              </div>
              <div className="wrapper-Clear">
                <div style={{float: 'left'}}>
                  <p>Hi there...</p>
                </div>
                <div id = "new_habit_navigate" style={{float: 'right'}}>
                  <NaviForm onUserNavi = {this.handleUserClick}
                            progress = {this.state.progress}
                  />
                </div>
              </div>
            </div>
            <NewHabitForm progress={this.state.progress}
                          resetProgress={this.resetProgress} />
          </div>
        )}

    });

    var NaviForm = React.createClass({
        userClick: function(direction){
          this.props.onUserNavi(direction);
        },
        render: function(){
          return(
            <div>
              <button style = {{marginRight: '10%'}} onClick={this.userClick.bind(this, -1)}>
                {this.props.progress!=0 ?
                  "Previous"
                  : <div style={{color: '#95a5a6'}}>Previous</div>
                }
              </button>
              <button onClick={this.userClick.bind(this, 1)}>
                {this.props.progress!=100 ?
                  "Next"
                  : <div style={{color: '#95a5a6'}}>Next</div>
                }
              </button>
            </div>
          )
        }
    });

    var ProgressBar = React.createClass({
      render: function(){
        var progress = this.props.progress;
        return(
          <div className="progress-meter" style={{width: progress+'%'}} />
        )
      }
    });

    var NewHabitForm = React.createClass({
        getInitialState: function(){
          return{
            questions:["What is your new habit description?",
            "how often do you plan to do this?",
            "which days of the week?",
            "When is/was your start day",
            "Are you are done? hit submit and start your development"]
          }
        },

        render: function(){
          var questionNum= this.props.progress / 25;
          return(
            <div id="habit_input_body">
              <QuestionDisplay question={this.state.questions[questionNum]}
                               questionNum={questionNum}
              />

              {/*decide which form to show client to fill in*/}
              {this.props.progress==0 ?
                <NewHabitInputBox type = {"description"}
                                  getValue = {formModel.getDescription} //callback f
                                  setValue = {formModel.addDescription} //callback f
                />
                : this.props.progress==25 ?
                    <FrequencyForm />
                  : this.props.progress==50 ?
                      <DaysForm />
                      : this.props.progress==75 ?
                          <NewHabitInputBox type = {"startDay YY-MM-DD"}
                                        getValue = {formModel.getStartDay} //callback f
                                        setValue = {formModel.addStartDay} //callback f
                          />
                          : this.props.progress==100 ?
                            <SubmitNewHabit resetProgress={this.props.resetProgress} />
                            : console.log("error")
                            }
            </div>
          )}
    });

    var SubmitNewHabit = React.createClass({
      updateHabitList: function(){
        var self = this;
        formModel.updateHabitListing(function(success){
          (success) ? self.props.resetProgress() : "" ;
        });
      },
      render: function(){
        return(
          <button onClick={this.updateHabitList}> click me </button>

        )}

    });

    //this components used for getting description of habit and start-date
    //depends on what props this child's parent, NewHabitForm, feed this child
    var NewHabitInputBox = React.createClass({
      userInput: function(event){
        var setValue = this.props.setValue.bind(formModel);
        setValue(event.target.value);
      },
      render: function(){
        var getValue = this.props.getValue.bind(formModel);
        return(
          <fieldset className="fieldset">
          <legend>{this.props.type}</legend>
          <input type="text" defaultValue={getValue()} onChange={this.userInput}/>
          </fieldset>
        )
      }
    });

    var FrequencyForm = React.createClass({
      userInput: function(selection){
        formModel.addFrequency(selection);
      },

      render: function(){
        return(
          <fieldset className="fieldset">
          <legend>How Often?</legend>
          <div id="frequency-wrapper">
            <input type="radio" name="HowOften" id="Daily" onChange={this.userInput.bind(this, constant.DAILY)} defaultChecked = {formModel.getFrequency() == constant.DAILY}/><label htmlFor="Daily">Daily</label>
            <input type="radio" name="HowOften" id="Weekly" onChange={this.userInput.bind(this, constant.WEEKLY)} defaultChecked = {formModel.getFrequency() == constant.WEEKLY}/><label htmlFor="Weekly">Weekly</label>
            <input type="radio" name="HowOften" id="BiWeekly" onChange={this.userInput.bind(this, constant.BIWEEKLY)} defaultChecked = {formModel.getFrequency() == constant.BIWEEKLY}/><label htmlFor="BiWeekly">Bi-Weekly</label>
          </div>
          <div className="wrapper-Clear-Flow" />
          </fieldset>
        )
      }

    });
    var DaysForm = React.createClass({
      userInput: function(day){
        console.log("clicked on" + day);
        formModel.addDays(day);
      },

      render: function(){
        return(
          <fieldset className="fieldset">
          <legend>Which days?</legend>
          <ul className ="checkbox-grid">
          <li><input id="Monday" type="checkbox" onClick={this.userInput.bind(this, 1)} defaultChecked={formModel.getDays().indexOf(1) > -1}/><label htmlFor="Monday">Monday</label></li>
          <li><input id="Tuesday" type="checkbox" onClick={this.userInput.bind(this, 2)} defaultChecked={formModel.getDays().indexOf(2) > -1} /><label htmlFor="Tuesday">Tuesday</label></li>
          <li><input id="Wednesday" type="checkbox" onClick={this.userInput.bind(this, 3)} defaultChecked={formModel.getDays().indexOf(3) > -1} /><label htmlFor="Wednesday">Wednesday</label> </li>
          <li><input id="Thursday" type="checkbox" onClick={this.userInput.bind(this, 4)} defaultChecked={formModel.getDays().indexOf(4) > -1} /><label htmlFor="Thursday">Thursday</label></li>
          <li><input id="Friday" type="checkbox" onClick={this.userInput.bind(this, 5)} defaultChecked={formModel.getDays().indexOf(5) > -1} /><label htmlFor="Friday">Friday</label></li>
          <li><input id="Saturaday" type="checkbox" onClick={this.userInput.bind(this, 6)} defaultChecked={formModel.getDays().indexOf(6) > -1} /><label htmlFor="Saturaday">Saturaday</label></li>
          <li><input id="Sunday" type="checkbox" onClick={this.userInput.bind(this, 7)} defaultChecked={formModel.getDays().indexOf(7) > -1} /><label htmlFor="Sunday">Sunday</label></li>
          </ul>
          </fieldset>
        )
      }
    });

    //For displaying questions and information to user
    //base on their previous choices and current form input
    var QuestionDisplay = React.createClass({
        render: function(){
          var display = "";
          //if we are displaying question 3, we display special comments
          if (this.props.questionNum == 2){
            display = formModel.getFrequency();
            if(display == ""){
              display = "You should go back and choose the frequency first!"
            }else if (display == constant.DAILY){
              display = "Daily?! We got a hardworker here! and " + this.props.question;
            }else if (display == constant.WEEKLY){
              display = "Weekly! RockOn! and " + this.props.question;
            }else if(display == constant.BIWEEKLY){
              display = "BiWeekly! nice! and " + this.props.question;
            }
          }else{ //for all other questions, we add nothing to the display
            display = this.props.question;
          }
          return <p>{display}</p>
        }
    });

export default AddingNewHabit;
