import React from 'react';
import store from '../store/store';
import {connect} from 'react-redux';


var RankingRoot = React.createClass({
  render: function(){
    return(
      <ComputeRanks list={this.props.habitModel} />
    );
  }
});

var mapStateToProps = function(state){
    return {habitModel: state.filteredModel}
}

var ReduxRankingRoot = connect(mapStateToProps)(RankingRoot); //now reduxrankingRoot replaced RankingRoot

var ComputeRanks = React.createClass({
  render: function(){
      var list = this.props.list.slice(0);
      list.sort(function(a, b){
         var alength = 1, blength = 1;
         (a.startDate.constructor === Array) ? alength = a.startDate.length : "";
         (b.startDate.constructor === Array) ? blength = b.startDate.length : "";
         return blength - alength;
      });
    return(
      <div className = "text-center">
        Achievements/Rewards:
        <DisplayList sortedList = {list} />
      </div>
    );
  }
})

var DisplayList = React.createClass({
  render: function(){
    return(
      <div id = "listing-boxes-wrapper">
        <ul className="listing-boxes">
          {
            this.props.sortedList.map(function(item, index){
              return  <li key={index} className = "text-center">{item.description} :
                        <Awards days = {item.startDate} />
                      </li>
            })
          }
        </ul>

      </div>
    )
  }
});

var Awards = React.createClass({
  render: function(){
    var count = this.props.days.length;
    
    return(
      <span>{this.props.days}</span>
    )
  }
});

export default ReduxRankingRoot;
