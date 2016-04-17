import React from 'react';


class Quote extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      navigation: 0, //0: first quote, 1:second etc
      draggable: true, //0: cant be drag, but can edit, if 1 child will render a new quote with a handler
                        //when 0 can edit, will also give option/menu to get random quote or check old quote
      pos: {x:0, y:0}, //position of the quote, last location
      quote: "MISTAKE"
    }
  }
  switchDraggability(){
    this.setState({draggable:!this.state.draggable});
  }
  handleDrag(){
     $("#quote-text").hide();

  }
  handleDragEnd(e){
    var x = e.pageX;
    var y = e.pageY;
    //top: y minus mouseposition relative to the original position
    $("#"+e.currentTarget.id).show().css({
      top: y -340 + "px",
      left: x -575+ "px"
    })
  }
  render(){
    return(
      <div>
        <i className="fa fa-quote-left"  style ={{cursor: "pointer", fontSize: "15px"}} onClick={this.switchDraggability.bind(this)}></i>
        {(this.state.draggable
              ? <span>
                  <span id = "quote-text" draggable ="true" onDrag={this.handleDrag.bind(this)} onDragEnd={this.handleDragEnd.bind(this)}>
                    <DisplayQuote quote={this.state.quote}/>
                  </span>
                  <i className="fa fa-quote-right"></i>
                </span>
             :  <span>
                  <span id = "quote-text" contentEditable="true">
                    <DisplayQuote quote={this.state.quote}/>
                  </span>
                  <i className="fa fa-quote-right"></i>
                  <Editor cancel={this.switchDraggability.bind(this)}/>
                </span>
        )}
      </div>
    )
  }
}


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
    var random =  <MenuListItem handleClick={this.handleClick.bind(this)} key = "1"
                                handleDrag={this.handleDrag.bind(this)} handleDragStart={this.handleDragStart.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                texts="random" />;
    var history = <MenuListItem handleClick={this.handleClick.bind(this)} key = "2" handleDragStart={this.handleDragStart.bind(this)} handleDrag={this.handleDrag.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                texts="history" />;
    var submit =  <MenuListItem handleClick={this.handleClick.bind(this)} key = "3" handleDragStart={this.handleDragStart.bind(this)} handleDrag={this.handleDrag.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                texts="submit" />;
    var cancel =  <MenuListItem handleClick={this.props.cancel.bind(this)} key = "4" handleDragStart={this.handleDragStart.bind(this)} handleDrag={this.handleDrag.bind(this)} handleDragEnd={this.handleDragEnd.bind(this)}
                                texts="cancel" />;

    this.setState({order: [ {name: "random", component: random},
                            {name: "history", component: history},
                            {name: "submit", component: submit},
                            {name: "cancel", component: cancel} ] });

  }
  handleClick(){
    console.log("clicked");
  }

  handleDrag(e){
    $("#quote-menu").css({
      borderStyle: 'dotted'
    });
  }
  handleDragStart(e){
    //console.log(e.currentTarget.offsetLeft); //3 73 143 213

    this.setState({dragged: e.currentTarget});
  }
  handleDragEnd(e){
    $("#quote-menu").css({
      borderStyle: 'none'
    });
    var x = e.pageX - $('#quote-menu').offset().left;
    var y = e.pageY - $('#quote-menu').offset().top;

    var newOrder = this.state.order.slice();
    var draggedEle;
    for(let i = 0; i<newOrder.length; i++){
      if(this.state.dragged.firstChild.innerHTML == newOrder[i].name){
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
    return(
      <li draggable="true"   key={this.props.key}
                             onClick={this.props.handleClick.bind(this)}
                             onDrag={this.props.handleDrag.bind(this)}
                             onDragStart={this.props.handleDragStart.bind(this)}
                             onDragEnd={this.props.handleDragEnd.bind(this)}><div>{this.props.texts}</div>
      </li>
    )
  }

}
export default Quote;
