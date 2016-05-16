import React from 'react';
import ReactDom from 'react-dom';
import ContactUsRoot from '../../../js/Components/contactUsComponents/contactUsRoot';
import ReactTestUtils from '../../../node_modules/react/lib/ReactTestUtils';
import {assert} from 'chai';


describe('contactUsComponent', function(){
  var renderedNode;

  beforeEach(function(){
    var renderedElement = ReactTestUtils.renderIntoDocument(<ContactUsRoot/>);
    renderedNode = ReactDom.findDOMNode(renderedElement);
  });

  it('should render with correct markup', function(){
    assert.equal(renderedNode.tagName, 'DIV');
    assert.include(renderedNode.textContent, 'Contact us')
  });

})
