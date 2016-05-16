import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from '../../../node_modules/react/lib/ReactTestUtils';
import {GraphRoot} from '../../../js/Components/graphComponents/graphRoot';
import DayPicker from '../../../js/Components/graphComponents/dayPicker';
import {assert} from 'chai'

'use strict';


  describe('dayPicker component', function(){
    var renderedElement = ReactTestUtils.renderIntoDocument(<DayPicker/>);
    var renderedNode = ReactDom.findDOMNode(renderedElement);
    it('should have the proper markup', function(){
      assert.equal(renderedNode.childElementCount, 5);
      assert.equal(renderedNode.children[0].id, 'habitDropDown');
      assert.equal(renderedNode.children[1].id, 'monthDropDown');
      assert.equal(renderedNode.children[2].id, 'yearDropDown');
      assert.equal(renderedNode.children[3].id, 'allOrOne');
      assert.equal(renderedNode.children[4].tagName, 'LABEL');

    })
  })



// describe('Matching select menu with graph', function(){
//   var renderedNode;
//   beforeEach(function(){
//     var renderedElement = ReactTestUtils.renderIntoDocument(<GraphRoot modelForGraphing={[{"habitid":"1417","userid":"123","description":"Cold Shower","startDate":"2016-03-03","frequency":"1","day":"1357246","completed_Days":["2016-04-08","2016-04-15"]} ]}/>);
//     renderedNode = ReactDom.findDOMNode(renderedElement);
//
//   })
//
//
//   it('selecting change parent state', function(){
//     console.log(ReactTestUtils.findRenderedDOMComponentWithTag('DayPicker'));
//
//   })
//
// })





describe('Graphing helper functions', function(){

  describe('getAllPlannedDay', function(){
    var plannedDay;

      beforeEach(function(){
        var renderedElement = ReactTestUtils.renderIntoDocument(<GraphRoot modelForGraphing={[]}/>);
        plannedDay = renderedElement.getAllPlannedDay(3, 2016, "13");
      })

    it("should return an array", function(){
      assert.typeOf(plannedDay, 'array');
    });
    it('each item in array should be a integer/number', function(){
      assert.typeOf(plannedDay[1], 'Number');
    });
    it('should return an array of dates that user is suppose to complete for a given month and year', function(){
      assert.deepEqual(plannedDay, [4, 6, 11, 13, 18, 20, 25, 27]);
    });
  });

  describe("getAllCompletedDay", function(){
    var completedDays;
    beforeEach(function(){
      var renderedElement = ReactTestUtils.renderIntoDocument(<GraphRoot modelForGraphing={[]}/>);
      completedDays = renderedElement.getAllCompletedDay(3, 2016, ["2016-01-04", "2016-02-04", "2016-03-04", "2016-04-04"])
    })
    it('should return an array', function(){
      assert.typeOf(completedDays, 'array');
    });
    it('each item in array should be a number not string', function(){
      assert.typeOf(completedDays[0], 'Number');
    });
    it('should return an array containing only days (out of the completed) within the specific months and year', function(){
      assert.deepEqual(completedDays, [4]);
    });
  });

  describe('mergeTwoChartData', function(){
    var chartData, chartData2, chart;
    beforeEach(function(){
      chartData = [{date: 4, first: 2}, {date: 5, second: 3}];
      chartData2 = [{date: 4, second: 3}, {date: 5, first: 4}];

      var renderedElement = ReactTestUtils.renderIntoDocument(<GraphRoot modelForGraphing={[]}/>);
      chart = renderedElement.mergeTwoChartData(chartData, chartData2);
    })

    it('return an array', function(){
      assert.typeOf(chart, 'array');
    });
    it('return the correct array of JSON depending on the argument', function(){
      assert.deepEqual(JSON.stringify(chart), JSON.stringify([{date: 4, first: 2, second: 3}, {date: 5, second: 3, first: 4}]));
    });
  })

})
