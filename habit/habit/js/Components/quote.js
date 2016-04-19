import React from 'react';
import store from '../store/store';
import {connect} from 'react-redux';

class Quote extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      draggable: true, //0: cant be drag, but can edit, if 1 child will render a new quote with a handler
                        //when 0 can edit, will also give option/menu
    }
  }
  switchDraggability(){
    this.setState({ draggable:!this.state.draggable });
  }
  handleDrag(e){
    var x = e.pageX - $("#left-quote").offset().left;
    var y = e.pageY - $("#left-quote").offset().top;
    e.target.style.top = y + "px";
    e.target.style.left = x +"px";
  }
  handleDragEnd(e){
    var x = e.pageX - $("#left-quote").offset().left;
    var y = e.pageY - $("#left-quote").offset().top;
    e.target.style.top = y + "px";
    e.target.style.left = x +"px";
  }
  render(){
    return(
      <div>
        <i id = "left-quote" className="fa fa-quote-left" onClick={this.switchDraggability.bind(this)}></i>
        {(this.state.draggable
              ? //WHEN user can drag the quote, no mini menu here
                  <span id = "quote-text" draggable ="true" onDrag={this.handleDrag.bind(this)}
                                                            onDragEnd={this.handleDragEnd.bind(this)}>
                    <DisplayQuote quote={this.props.quote}/>
                  </span>
             : //WHEN user cannot drag the quote, can edit quote, also show mini menu/editor here
                <span>
                  <span id = "quote-text" contentEditable="true">
                    <DisplayQuote quote={this.props.quote}/>
                  </span>
                  <Editor closeMenu={this.switchDraggability.bind(this)}/>
                </span>
        )}
      </div>
    )
  }
}


var mapStateToProps = function(state){
  return {quote : state.quote}
}
//connect the parent component Quote to redux store, creating a new component call NewReduxQuoteComponent.
//Store will now pass the state:quote to Quote as props
var NewReduxQuoteComponent = connect(mapStateToProps)(Quote);


class DisplayQuote extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
        <span>{this.props.quote}</span>
    )
  }
}

class Editor extends React.Component{
  constructor(props){
    super(props);
    this.state={
      order: [],
      dragged: ""
    }
  }
  componentWillMount(){
    //refreshing memory, .bind(this). All the "this" inside the function will be refering to the binded (this)
    var redo =  <MenuListItem handleClick={this.handleRedoClick.bind(this)} key = "1" handleDrag={this.handleDrag.bind(this)} handleDragStart={this.handleDragStart.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                handleHover={this.handleHover.bind(this, "#42A65D")}
                                handleLeave = {this.handleLeave.bind(this)}
                                color = "#42A65D"
                                iconName = "fa-hand-o-right"
                                texts=" redo" />;
    var undo = <MenuListItem handleClick={this.handleUndoClick.bind(this)} key = "2" handleDragStart={this.handleDragStart.bind(this)} handleDrag={this.handleDrag.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                handleHover={this.handleHover.bind(this, "#3387B6")}
                                handleLeave = {this.handleLeave.bind(this)}
                                color="#3387B6"
                                iconName = "fa-hand-o-left"
                                texts=" undo" />;
    var submit =  <MenuListItem handleClick={this.handleSubmitClick.bind(this)} key = "3" handleDragStart={this.handleDragStart.bind(this)} handleDrag={this.handleDrag.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                handleHover={this.handleHover.bind(this, "#E54A45")}
                                handleLeave = {this.handleLeave.bind(this)}
                                color="#E54A45"
                                iconName = "fa-play"
                                texts=" submit" />;
    var cancel =  <MenuListItem handleClick={this.props.closeMenu.bind(this)} key = "4" handleDragStart={this.handleDragStart.bind(this)} handleDrag={this.handleDrag.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                handleHover={this.handleHover.bind(this, "#34B798")}
                                handleLeave = {this.handleLeave.bind(this)}
                                color="#34B798"
                                iconName = "fa-eject"
                                texts=" cancel" />;

    this.setState({order: [
                            {name: "submit", component: submit},
                            {name: "undo", component: undo},
                            {name: "redo", component: redo},
                            {name: "cancel", component: cancel} ] });

  }
  handleSubmitClick(){
    var ele = document.getElementById("quote-text");
    store.dispatch({type: "SUBMIT_QUOTE", newQuote: ele.textContent});
    this.props.closeMenu();
  }
  handleUndoClick(){
    store.dispatch({type: "UNDO"});
  }
  handleRedoClick(){
    store.dispatch({type: "REDO"});
  }
  handleClick(){
    console.log("clicked");
  }

  handleHover(color, e){
    e.stopPropagation();
    var ele = e.currentTarget;
      ele.style.backgroundColor = color;
      ele.style.color = 'white';
  }

  handleLeave(e){
    e.stopPropagation();
    var ele = e.currentTarget;
      ele.style.backgroundColor = 'white';
      ele.style.color = '#CBCBCB';
  }

  handleDrag(e){
    $("#quote-menu").css({
      borderStyle: 'dotted'
    });
    var x = e.pageX - $('#quote-menu').offset().left;
    var y = e.pageY - $('#quote-menu').offset().top;

    var newOrder = this.state.order.slice();
    var draggedEle;
    for(let i = 0; i<newOrder.length; i++){
      if(this.state.dragged.firstChild.innerHTML.indexOf(newOrder[i].name) > -1){
        draggedEle = newOrder.splice(i, 1);
        break;
      }
    }
    // this.state.dragged.style.display = '';
    if (x <= 73){ //put the dragged box in first
        newOrder.splice(0, 0, draggedEle[0]);
    }else if (74 <= x && x <= 143){ //put the dragged box in second
        newOrder.splice(1, 0, draggedEle[0]);
    }else if(144 <= x && x <= 213){ //put the dragged box in third
        newOrder.splice(2, 0, draggedEle[0]);
    }else {
        newOrder.splice(3, 0, draggedEle[0]);
    }

    this.setState({order: newOrder});

  }
  handleDragStart(e){
    //console.log(e.currentTarget.offsetLeft); //3 73 143 213
    this.setState({dragged: e.currentTarget});
  }

  handleDragEnd(e){
    $("#quote-menu").css({
      borderStyle: 'none'
    });
  }

  allowDrop(e){
    e.preventDefault();
  }

  render(){
    var print = [];
    for(let i = 0; i < this.state.order.length; i++){
      print.push(this.state.order[i].component);
    }
    return (
            <ul id="quote-menu" onDragOver={this.allowDrop.bind(this)}>
              { print }
            </ul>
          )
  }
}

class MenuListItem extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    var color = this.props.color;
    return(
      <li style ={{backgroundColor: color}} draggable="true"   key={this.props.key}
                             onClick={this.props.handleClick.bind(this)}
                             onDrag={this.props.handleDrag.bind(this)}
                             onDragStart={this.props.handleDragStart.bind(this)}
                             onDragEnd={this.props.handleDragEnd.bind(this)}>
                             <div
                                  onMouseEnter={this.props.handleHover.bind(this)}
                                  onMouseLeave={this.props.handleLeave.bind(this)}>
                                  <i style = {{color: "#CBCBCB"}} className={"fa " + this.props.iconName}></i>
                                  {this.props.texts}
                             </div>
      </li>
    )
  }

}
export default NewReduxQuoteComponent;
