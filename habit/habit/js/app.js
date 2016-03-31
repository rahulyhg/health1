import '../plugins/leanModal/jquery.leanModal.min.js';

import React from "react";
import ReactDom from "react-dom";
import HabitModel from "./Components/habitListing.js";
import AddingNewHabit from "./Components/addingHabit.js"
import Filter from './Components/filter.js'

import { Provider } from 'react-redux';
import store from './store/store'
// var userId;
//
// if (sessionStorage.userid){
//   userId = sessionStorage.userid;
//
// }else{
//   userId = 123;
// }
// console.log(userId);

  ReactDom.render(
    <Provider store = {store}>
      <HabitModel />
    </Provider>,
    document.getElementById('habit_listing')
  );

  (function initializeListing(){
    var serverRequest = $.get("/health1/server/habit/user", {userid:123}, function(result){
      result = JSON.parse(result);
      console.log(result);
      store.dispatch({type:'UPDATE', data: result});
    })
  })();

  ReactDom.render(
    <Provider store = {store}>
      <Filter />
    </Provider>,
    document.getElementById('filterDiv')
  );

  ReactDom.render(
    <AddingNewHabit />,
    document.getElementById('new_habit_popup')
  );

  $("#add_more").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
  $(".habits_display").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
