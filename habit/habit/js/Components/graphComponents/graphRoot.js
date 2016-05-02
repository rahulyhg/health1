import React from 'react';
import store from '../../store/store'
import { connect } from 'react-redux';

import constant from "../../../config/config.js"; //contants all constants
import DayPicker from './dayPicker';
import LineGraph from './lineGraph';

class GraphRoot extends React.Component{

  constructor(props){
    super(props);
    this.state={
      year: 2016, //default year and month for displaying the graph, april 2016
      month: 3,
      currentHabitIndex: 0, //index for which habit to display on graph
      all: false //false: show all habits on graph, true: show only currentHabitIndex habit
    }
  }

  handleAllorOneSwitch(){
    this.setState({all: !this.state.all});
  }

  handleDateChange(target, value){
      if (target === "month"){
          this.setState({month: constant.monthtext.indexOf(value)});
      }else{ //year
          this.setState({year: value});
      }
  }

  handleHabitChange(index){
    this.setState({currentHabitIndex: index});
  }
  /**
   * generate an array for all the completed days for given month and year base on the completedDays array
   * @param {number} month - 0-11
   * @param {number} year - yyyy
   * @param {array} completedDays - the plcompleted days for each week for a certain habit
   * @return {array} filteredComplete - SORTED
  */
  getAllCompletedDay(month, year, completedDays){ //return an array contains only completed date for the given month and year
      var filteredComplete = [];
      var temp = [];
      for (let i = 0; i < completedDays.length; i++){
        temp = completedDays[i].split("-");
        if (temp[0] == year && temp[1] == (month + 1)) { //rmb js month is 0-11
          filteredComplete.push(parseInt(temp[2]));
        }
      }

      return filteredComplete.sort(function(a, b){return a-b});
  }

  /**
   * generate an array for graphing
   * @param {number} month - 0-11
   * @param {number} year - yyyy
   * @param {string} days - the planned-to-complete days for each week, e.g. Monday, wednesday, friday : "135"
   * @return {array} arr - contain all the planned days for the month/year, SORTED
  */
  getAllPlannedDay(month, year, days){
    var newDays = days.split("").map(function(item){ //convert to javascript days sunday:0, monday: 1 etc
      if(item == 7){
        return 0;
      }else{
        return parseInt(item);
      }
    });

    var d = new Date();
    var arr = [];

    d.setFullYear(year);
    d.setMonth(month);
    d.setDate(1);

    while(d.getMonth() === month){
      var check = d.getDay();
      if( newDays.indexOf(check) > -1){
        arr.push(d.getDate());
      }
      d.setDate(d.getDate()+1);
    }
    return arr;
  }

  /**
   * generate an array for graphing
   * @param {number} month - 0-11
   * @param {number} year - yyyy
   * @param {string} description - description of the habit
   * @param {array} plannedDays - contain all the planned days for the given month/year, must be sorted
   * @param {array} completedDays - contain all actual completed days for the given month/year, must be sorted
   * @return {array} graphArray
  */
  generateGraphArray(month, year, description, plannedDays, completedDays){
    var graphArray = [];
    var endDay = 30;
    //rmb javascript month is 0-11
    if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11){
      endDay = 31;
    }else if (month === 1 && year%4 !== 0 ){
      endDay = 28;
    }else if (month === 1 ){
      endDay = 29;
    }
    var count = 0,
        iterationPlan = 0,
        iterationActual = 0,
        temp = {};
    for (let i = 1; i <= endDay; i++){ //each day of the month
      //i is in planned and not in actual
      if(plannedDays[iterationPlan] === i && completedDays[iterationActual] !== i){
        //if(planned < actual){ //you skipped the day
        //for this day you didnt do what you were planned to do
        count = 0; //reset count
        iterationPlan++;
      }else if(plannedDays[iterationPlan] === i && completedDays[iterationActual] === i){ //i is in planned and also in actual
        count++;
        iterationPlan++;
        iterationActual++;
      }else if(completedDays[iterationActual] === i){ //i is not in planned and in actual
        count++;
        iterationActual++;
      }else{ //not in both
        //to next loop
      }

      temp[description]=count;
      temp["date"]=i;
      graphArray.push(temp);
      temp = {};
    }
    return graphArray;
  }
  /**
  * merge two chart arr together, first chart arr get modified, assume same month and year for both chart
  * @param {array} chartData
  * @param {array} chartData2
  */
  mergeTwoChartData(chartData, chartData2){
    var i = 0,
        j = 0;
    while(i < chartData.length && chartData2.length>0){
      Object.assign(chartData[i], chartData2[j]);
      i++; j++;
    }
    return chartData;
  }

  recursion(habitList){
    if(habitList.length === 0 ){
      return [];
    }
    var habit = habitList.pop();
    var chartData = this.generateGraphArray(this.state.month, this.state.year, habit.description,
                                              this.getAllPlannedDay(this.state.month, this.state.year, habit.day),
                                                this.getAllCompletedDay(this.state.month, this.state.year, habit.completed_Days));
    return this.mergeTwoChartData(chartData, this.recursion(habitList));
  }


  render(){
    var self = this;


    //both variable for graphingData, which is passed to LineGraph component for graphing
    var chartSeries = [];
    var chartData = [];
    console.log(this.props.modelForGraphing);
    if (this.props.modelForGraphing.length!==0){
      //true: show all, false: show only the specific one, base on this.state.currentHabitIndex
      if (this.state.all){
        chartData=this.recursion(this.props.modelForGraphing.slice()); //need opt, expensive call when there are a lot of habit
        for (let i = 0; i < this.props.modelForGraphing.length; i++){
          var obj = {
              field : this.props.modelForGraphing[i].description,
              name : this.props.modelForGraphing[i].description
          }
          chartSeries.push(obj);
        }
      }else{
        var index = this.state.currentHabitIndex;
        var habit = this.props.modelForGraphing;
        chartData = this.generateGraphArray(this.state.month, this.state.year, habit[index].description,
                                              this.getAllPlannedDay(this.state.month, this.state.year, habit[index].day),
                                              this.getAllCompletedDay(this.state.month, this.state.year, habit[index].completed_Days) );
        chartSeries = [{
                        field:habit[index].description,
                        name: habit[index].description,
                        color: '#ff7f0e'
                    }];
      }

    }
    //graphingData: pass it to LineGraph component for graphing
    var graphingData = {
        width: 1150,
        height: 300,
        margins: {left: 100, right: 100, top: 50, bottom: 50},
        chartSeries: chartSeries,

        // your x accessor
        x: function(d) {
          return new Date(self.state.year, self.state.month, d.date);
        },
        xScale: 'time',
        xLabel: 'day of the month',
        yLabel: 'chain',
        chartData: chartData
      }
      console.log(JSON.stringify(graphingData));
    return(
      <div>

        <div id = "habit-Line-graph"><LineGraph chartData={graphingData}/></div>
        {this.props.modelForGraphing.length!==0
          ? <DayPicker  handleDateChange={this.handleDateChange.bind(this)}
                        handleHabitChange={this.handleHabitChange.bind(this)}
                        habitList = {this.props.modelForGraphing}
                        handleAllOrOne = {this.handleAllorOneSwitch.bind(this)}
            />
          : console.log("didnt recieve model yet")}

      </div>
    )
  }
}


var mapStateToProps = function(state){
  return {modelForGraphing: state.model}
}

var newReduxGraphComp = connect(mapStateToProps)(GraphRoot);

newReduxGraphComp.propTypes={
    modelForGraphing: React.PropTypes.array
}




export default newReduxGraphComp;
