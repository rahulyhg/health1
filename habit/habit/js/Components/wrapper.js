import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import { Link } from 'react-router';

var Wrapper = React.createClass({
  render: function(){
    return(
      <div>
        <div className="header"></div>

        <ReactCSSTransitionGroup transitionName="route" transitionEnterTimeout={1000} transitionLeaveTimeout={300}>

          {React.cloneElement(this.props.children, {key:this.props.location.pathname})}

        </ReactCSSTransitionGroup>

        <ul id="route-navi-bar">
          <li> <Link to="/">Home</Link></li>
          <li> <Link to="/graph">Graph</Link></li>
          <li> <Link to="/contact">Contact</Link></li>
          <li>Random</li>
        </ul>
      </div>
    )
  }

});

export default Wrapper;
