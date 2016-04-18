import '../plugins/leanModal/jquery.leanModal.min.js';
import '../plugins/myPlugin/menuSlider.js';

import React from "react";
import ReactDom from "react-dom";
import HabitModel from "./Components/habitListing.js";
import AddingNewHabit from "./Components/addingHabit.js"
import Filter from './Components/filter.js'
import Quote from './Components/quote.js'

import { Provider } from 'react-redux';
import store from './store/store';

import RewardComponent from './Components/rankingHabit.js';

import { Router, Route, hashHistory  } from 'react-router';


  //Listing out all the habit
  ReactDom.render(
    <Provider store = {store}>
      <HabitModel />
    </Provider>,
    document.getElementById('habit_listing')
  );

  //filter bar for filting the list of habit
  ReactDom.render(
    <Provider store = {store}>
      <Filter />
    </Provider>,
    document.getElementById('filterDiv')
  );

  //adding new habit
  ReactDom.render(
    <AddingNewHabit />,
    document.getElementById('new_habit_popup')
  );

  //reward section
  ReactDom.render(
    <Provider store = {store}>
    <RewardComponent />
    </Provider>,
    document.getElementById('upper-right')
  );

  ReactDom.render(
    <Provider store={store}>
    <Quote />
    </Provider>,
    document.getElementById('quotation-section')
  );


  //adding some pop up affect to the overall user experience
  $("#add_more").leanModal({ top : 100, overlay : 0.8, closeButton: ".modal_close" });
  $(".habits_display").leanModal({ top : 50, overlay : 0.8, closeButton: ".modal_close" });
  $("#reference").slideMenu({handler: 'click', icon: 'fa-user'});
