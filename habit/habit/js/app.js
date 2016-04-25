import '../plugins/leanModal/jquery.leanModal.min.js';
import '../plugins/myPlugin/menuSlider.js';

import React from "react";
import ReactDom from "react-dom";
import HomeRoot from './Components/HomeComponents/homeRoot.js';
import GraphRoot from './Components/graphComponents/graphRoot.js';
import ContactUsRoot from './Components/contactUsComponents/contactUsRoot.js';
import Wrapper from './Components/wrapper.js';


import { Provider } from 'react-redux';
import store from './store/store';

import { Router, Route, hashHistory  } from 'react-router';

 require('../css/habit.scss');



ReactDom.render(
  <Provider store = {store}>
    <Router history={hashHistory}>
      <Route component={Wrapper}>
        <Route path="/" component={HomeRoot} />
        <Route path="/graph" component={GraphRoot} />
        <Route path="/contact" component={ContactUsRoot} />
      </Route>
    </Router>
  </Provider>,
document.getElementById('app-root')
);
