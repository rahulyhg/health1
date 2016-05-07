import {assert} from 'chai'
import GraphRoot from '../../../js/Components/graphComponents/graphRoot';
import sinon from 'sinon';

import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from '../../../node_modules/react/lib/ReactTestUtils';

import store from '../../../js/store/store';
import { Provider } from 'react-redux';


'use strict';
/**
 * generate an array for all the completed days for given month and year base on the completedDays array
 * @param {number} month - 0-11
 * @param {number} year - yyyy
 * @param {array} completedDays - the plcompleted days for each week for a certain habit
 * @return {array} filteredComplete - SORTED
*/
function getAllCompletedDay(month, year, completedDays){ //return an array contains only completed date for the given month and year
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
function getAllPlannedDay(month, year, days){
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
* merge two chart arr together, first chart arr get modified, assume same month and year for both chart
* @param {array} chartData
* @param {array} chartData2
* @return {array} chartData
*/
function mergeTwoChartData(chartData, chartData2){
  var i = 0,
      j = 0;
  while(i < chartData.length && chartData2.length>0){
    Object.assign(chartData[i], chartData2[j]);
    i++; j++;
  }
  return chartData;
}




describe('Graphing helper functions', function(){

  describe('getAllPlannedDay', function(){
    var april2016;
    beforeEach(function(){

      var renderedElement = ReactTestUtils.renderIntoDocument(<Provider store = {store}><GraphRoot/></Provider>);
      
      april2016 = getAllPlannedDay(3, 2016, "13");





    })

    it("should return an array", function(){
      assert.typeOf(april2016, 'array');
    });
    it('each item in array should be a integer/number', function(){
      assert.typeOf(april2016[1], 'Number');
    });
    it('should return an array of dates that user is suppose to complete for a given month and year', function(){
      assert.deepEqual(april2016, [4, 6, 11, 13, 18, 20, 25, 27]);
    });
  });

  describe("getAllCompletedDay", function(){
    var april2016;
    beforeEach(function(){
      april2016 = getAllCompletedDay(3, 2016, ["2016-01-04", "2016-02-04", "2016-03-04", "2016-04-04"])
    })
    it('should return an array', function(){
      assert.typeOf(april2016, 'array');
    });
    it('each item in array should be a number not string', function(){
      assert.typeOf(april2016[0], 'Number');
    });
    it('should return an array containing only days (out of the completed) within the specific months and year', function(){
      assert.deepEqual(april2016, [4]);
    });
  });

  describe('mergeTwoChartData', function(){
    var chartData, chartData2, chart;
    beforeEach(function(){
       chartData = [{date: 4, first: 2}, {date: 5, second: 3}];
          chartData2 = [{date: 4, second: 3}, {date: 5, first: 4}];
       chart = mergeTwoChartData(chartData, chartData2);
    })

    it('return an array', function(){
      assert.typeOf(chart, 'array');
    });
    it('return the correct array of JSON depending on the argument', function(){
      assert.deepEqual(JSON.stringify(chart), JSON.stringify([{date: 4, first: 2, second: 3}, {date: 5, second: 3, first: 4}]));
    });
  })

})
