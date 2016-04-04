import store from "../store/store";

/*
*formModel: store state of forms information, and provide a api to manipulate the data
*when user is ready and all info is filled in, updateHabitListing will be used to update
*RestApi
*  Used for the whole AddingNewHabit's components hierarchy
*/


var formModel = {
  newHabitInfo: {
    description: "",
    frequency: "",
    startDay: "",
    days: []
  },
  addDescription: function(description){
    this.newHabitInfo.description = description;
  },
  addFrequency: function(selection){
    this.newHabitInfo.frequency = selection;
  },

  addStartDay: function(startDay){
    this.newHabitInfo.startDay = startDay;
  },
  /**
  * Store day into the days array property. If day already exist in Days array,
  *       it means the user is actually unchecking and we should delete it
  * @param {Number} day
  */
  addDays: function(day){
    var found = false;
    var length = this.newHabitInfo.days.length;
    for (var i = 0; i< length; i++){
      if(this.newHabitInfo.days[i]==day){//the changed checkbox existed in array, so this mean the user unchecked the box, so we take it out of array
        this.newHabitInfo.days.splice(i, 1); //deleting from array
        found = true;
        break;
      }
    }
    //if we didnt find item in array we add it in
    (!found) ? this.newHabitInfo.days.push(day) : "" ;
  },
  getDays: function(){
    return this.newHabitInfo.days;
  },
  getFrequency: function(){
    return this.newHabitInfo.frequency;
  },
  getDescription: function(){
    return this.newHabitInfo.description;
  },
  getStartDay: function(){
    return this.newHabitInfo.startDay;
  },
  //this is called after the new habit is added to RestApi,
  //So the form is empty for user to fill in a new habit
  clearModel: function(){
    this.newHabitInfo.description = "";
    this.newHabitInfo.frequency = "";
    this.newHabitInfo.days = [];
    this.newHabitInfo.startDay = "";
  },
  //ajax call to server api and add the new habit to database
  //if successful update the model root (display original habit list and this new one)
  //also clear formHabit so new habit can be added
  //Takes in a callback, if ajax success feed the callback with true, so addinghabit.js will know to reset form progress
  updateHabitListing: function(callback){

    var userId = 123; //for testing purposes
    if(sessionStorage.userid){
      userId = sessionStorage.userid;
    }

    if(this.validate()){
      console.log(this.newHabitInfo.days.join(" "));
      var newHabitData = {
        userid: userId,
        description: this.newHabitInfo.description,
        frequency: this.newHabitInfo.frequency,
        startDay: this.newHabitInfo.startDay,
        days: this.newHabitInfo.days.join(" ")
      }
      $.ajax({
          url: "/health1/server/habit/user",
          type: 'POST',
          data: newHabitData,
          success: function(data){

              var serverRequest = $.get("/health1/server/habit/user", {userid: userId}, function(result){
                result = JSON.parse(result);
                store.dispatch({type:'UPDATE', data: result});
              });
              callback(true);
          },
          error: function(data) {
              alert('there was an error when submitting to server!'); //or whatever
              callback(false);
          }
      });

      this.clearModel();

    }else{//user not logged in
      alert("You didnt fill out all the forms yet/you must log in first");
    }
  },
  /**check if user's input are valid
  * @return {boolean} validate
  */
  validate: function(){
    return (this.newHabitInfo.description != "" && this.newHabitInfo.frequency!="" && this.newHabitInfo.startDay!="" && this.newHabitInfo.days.length!=0)
  }
}

export default formModel;
