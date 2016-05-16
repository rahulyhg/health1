import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from '../../../../node_modules/react/lib/ReactTestUtils';
import {assert} from 'chai'

import {NewHabitForm, DaysForm, QuestionDisplay, FrequencyForm,NewHabitInputBox, SubmitNewHabit, ProgressBar, NaviForm} from '../../../../js/Components/HomeComponents/addingHabit';
import AddingHabit from '../../../../js/Components/HomeComponents/addingHabit';

import formModel from "../../../../js/Model/HabitCreationModel.js";
import constant from "../../../../config/config.js"; //contants all constants


describe ('Adding a new habit UI', function(){

    describe('navigating through different forms', function(){

        describe('HabitCreationModel should have the correct properties after user input in all the forms', function(){
            let rootElement, rootNode,
                NaviFromInstance, naviNode;

            rootElement = ReactTestUtils.renderIntoDocument(<AddingHabit/>);
            rootNode = ReactDom.findDOMNode(rootElement);
            NaviFromInstance = ReactTestUtils.findRenderedComponentWithType(rootElement, NaviForm);
            naviNode = ReactDom.findDOMNode(NaviFromInstance);

            //NewHabitInputBox formModel
            var NewHabitInputBoxInstance = ReactTestUtils.findRenderedComponentWithType(rootElement, NewHabitInputBox);
            var descriptionInputComponent = ReactDom.findDOMNode(NewHabitInputBoxInstance);
            var actualInputBoxNode = descriptionInputComponent.children[1];
            it('habit description inputbox form should contain one input', function(){
              assert.equal(actualInputBoxNode.type, 'text');
            })
            actualInputBoxNode.value = 'new Habit';
            ReactTestUtils.Simulate.change(actualInputBoxNode);
            assert.equal(formModel.getDescription(), 'new Habit');

            //FrequencyForm
            ReactTestUtils.Simulate.click(naviNode.children[1]); //click the 'next' button, progress now at 25, NewHabitInputBox should appear for input
            var FrequencyFormInstance = ReactTestUtils.findRenderedComponentWithType(rootElement, FrequencyForm);
            var frequencyNode = ReactDom.findDOMNode(FrequencyFormInstance);
            it('frequency form should contain three radioButton and three label', function(){
              assert.equal(frequencyNode.children[1].children[0].type, 'radio');
              assert.equal(frequencyNode.children[1].children[2].type, 'radio');
              assert.equal(frequencyNode.children[1].children[4].type, 'radio');

              assert.equal(frequencyNode.children[1].children[1].tagName, 'LABEL');
              assert.equal(frequencyNode.children[1].children[3].tagName, 'LABEL');
              assert.equal(frequencyNode.children[1].children[5].tagName, 'LABEL');
              assert.equal(frequencyNode.children[1].children.length, 6);
            })
            ReactTestUtils.Simulate.click(frequencyNode.children[1].children[1]); //click and check the first button, Daily button
            assert.equal(formModel.getFrequency(), constant.DAILY);





            //DaysForm
            //NewHabitInputBox
            //SubmitNewHabit

        })



        describe('Rendering the proper forms base on click', function(){
          let rootElement, rootNode,
              NaviFromInstance, naviNode;

          beforeEach(function(){
            rootElement = ReactTestUtils.renderIntoDocument(<AddingHabit/>);
            rootNode = ReactDom.findDOMNode(rootElement);
            NaviFromInstance = ReactTestUtils.findRenderedComponentWithType(rootElement, NaviForm);
            naviNode = ReactDom.findDOMNode(NaviFromInstance);
          })


          it('should have two buttons for navigating', function(){
            assert.equal(naviNode.children[0].tagName, 'BUTTON');
            assert.equal(naviNode.children[1].tagName, 'BUTTON');
          });

          it('should change progress state(in root component) depends on click', function(){
            ReactTestUtils.Simulate.click(naviNode.children[1]); //'next' button should change state.progress of the root component
            ReactTestUtils.Simulate.click(naviNode.children[1]);
            assert.equal(rootElement.state.progress, 50); //two click should change progress to 25+25
            ReactTestUtils.Simulate.click(naviNode.children[0]); //'prev' button clicked
            assert.equal(rootElement.state.progress, 25); //two click should change progress to 25+25
          });

          it('should render the correct form depending on root component\'s state.progress', function(){
            ReactTestUtils.Simulate.click(naviNode.children[1]);
            //since progress is now at 25, the only form that got rendered should be frequency
            assert.throws(() => ReactTestUtils.findRenderedComponentWithType(rootElement, NewHabitInputBox));

            assert.doesNotThrow(()=>ReactTestUtils.findRenderedComponentWithType(rootElement, FrequencyForm));

            assert.throws(() => ReactTestUtils.findRenderedComponentWithType(rootElement, DaysForm));
            assert.throws(()=>ReactTestUtils.findRenderedComponentWithType(rootElement, NewHabitInputBox));
            assert.throws(()=>ReactTestUtils.findRenderedComponentWithType(rootElement, SubmitNewHabit));
          });


        });

    });

})
describe('submitting to server restapi', function(){

})

describe('regarding rendering habit form for adding new habit', function(){
  var renderedElement = ReactTestUtils.renderIntoDocument(<NewHabitForm progress={50}/>);
  var renderedNode = ReactDom.findDOMNode(renderedElement);
  it('should have a QuestionDisplay component which show the question', function(){
    assert.isOk(ReactTestUtils.findRenderedComponentWithType(renderedElement, QuestionDisplay));
  });

  it('should render the correct component/form base on the props', function(){
    //progress is set to 50, so it should render DaysForm
    assert.isOk(ReactTestUtils.findRenderedComponentWithType(renderedElement, DaysForm));
  });
})
