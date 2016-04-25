import React from 'react';




class DayPicker extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    //putting the option for the selector drop down. i.e. months, years, habits
    var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    var month = document.getElementById('monthDropDown');
    var year = document.getElementById('yearDropDown');
    var habitList = document.getElementById('habitDropDown');

    var today=new Date();
    for (var m=0; m<12; m++){
        month.options[m]=new Option(monthtext[m], monthtext[m]);
    }
    month.options[today.getMonth()]=new Option(monthtext[today.getMonth()], monthtext[today.getMonth()], true, true);
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
  render(){
    return(
      <div id="graph-dropDown">
        <select id="habitDropDown" onChange={this.handleHabitChange.bind(this)}></select>
        <select id="monthDropDown" onChange={this.handleChange.bind(this)}></select>
        <select id="yearDropDown" onChange={this.handleChange.bind(this)}></select>
      </div>
    )
  }
}

export default DayPicker;
