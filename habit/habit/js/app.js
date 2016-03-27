require('../plugins/leanModal/jquery.leanModal.min.js');

import React from "react";
import ReactDom from "react-dom";
import HabitModel from "./Components/habitListing.js";
import AddingNewHabit from "./Components/addingHabit.js"

// var userId;
//
// if (sessionStorage.userid){
//   userId = sessionStorage.userid;
//
// }else{
//   userId = 123;
// }
// console.log(userId);

  var userId = 123;
  ReactDom.render(
    <HabitModel source = "/health1/server/habit/user"
    userid = {userId}
    />,
    document.getElementById('habit_listing')
  );
  ReactDom.render(
    <AddingNewHabit />,
    document.getElementById('new_habit_popup')
  );

  $("#add_more").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
  $(".habits_display").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
