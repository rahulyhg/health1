import React from 'react';
import constant from "../../../config/config.js"; //contants all constants
"use strict";



class DayPicker extends React.Component{
  constructor(props){
    super(props);
  }

  /**
   * putting the options for the selector drop downs. i.e. months, years, habits
   * @param {string} monthElementId
   * @param {string} yearElementId
   * @param {string} habitElementId
   */
  addOptionsToSelectors(monthElementId, yearElementId, habitElementId){
    var month = document.getElementById(monthElementId),
        year = document.getElementById(yearElementId),
        habitList = document.getElementById(habitElementId);

    var today=new Date();
    for (var m=0; m<12; m++){
        month.options[m]=new Option(constant.monthtext[m], constant.monthtext[m]);
    }
    month.options[today.getMonth()]=new Option(constant.monthtext[today.getMonth()], constant.monthtext[today.getMonth()], true, true);

    var thisyear=today.getFullYear(); thisyear= thisyear - 10;
    for (var y=0; y<20; y++){
      year.options[y]=new Option(thisyear, thisyear);
      thisyear+=1;
    }
    year.options[10]=new Option(today.getFullYear(), today.getFullYear(), true, true) //select today's year

    //putting the habit list in the drop down menu
    var propsHabitList = this.props.habitList;
    habitList.options[0]= new Option(propsHabitList[0].description, 0, true, true); // first item
    for (var h = 1; h < propsHabitList.length; h++){
        habitList.options[h]= new Option(propsHabitList[h].description, h);
    }

  }

  // componentDidMount(){
  //   //Once component is mount put the option for the selector drop down. i.e. months, years, habits
  //   this.addOptionsToSelectors('monthDropDown', 'yearDropDown', 'habitDropDown');
  // }

  handleChange(e){
    console.log("entered handle");
    if(e.target.id==='monthDropDown'){
      this.props.handleDateChange("month", e.target.value);
    }else{
      this.props.handleDateChange("year", e.target.value);
    }
  }

  handleHabitChange(e){
    this.props.handleHabitChange(e.target.value);
  }

  handleAllOrOne(){
    this.props.handleAllOrOne();
  }

  render(){
    return(
      <div id="graph-dropDown" className='noselect'>
        <select id="habitDropDown" onChange={this.handleHabitChange.bind(this)}></select>
        <select id="monthDropDown" onChange={this.handleChange.bind(this)}></select>
        <select id="yearDropDown" onChange={this.handleChange.bind(this)}></select>
        <input type="checkbox" id="allOrOne" name="allOrOne" onChange={this.handleAllOrOne.bind(this)}/><label className='noselect' htmlFor="allOrOne">show all</label>
      </div>
    )
  }
}

export default DayPicker;
