(function($){
  $.fn.slideMenu = function(options){

    var settings = $.extend({
        handler: 'click',
        position: 'left',
        icon: 'fa-user'
    }, options);

    this.prepend("<li><i class='fa " + settings.icon + "'  style='position:relative; color:gray'></i></li>");

    this.children().first().css({
      position: 'relative',
      paddingTop: '25px',
      paddingLeft: '3px',
      left: '35%',
      height: '80px',
      width: '25px',
      background: 'white',
      borderRadius: '0px 15px 15px 0px',
      float: 'right'
    });

    this.css({
      position: 'absolute',
      backgroundColor: 'white',
      boxShadow: '0px 0px 10px #888888',
      zIndex: '100000',
      listStyle: 'none',
      borderRadius: '0px 5px 5px 0px',
      padding: '10px',
      paddingBottom: '50px',
      minHeight: '300px',
      width: '120px',
      maxWidth: '120px',
      left: '-115px'
    });

    if (settings.handler === 'click'){
      this.on('click', function(){
        var on = $(this).data('switch');
        $(this).stop().animate({
          left: (on ? -115: 0)
        });
        $(this).data('switch', !on);
      })

    }else if(settings.handler === 'hover'){
      this.on('mouseleave mouseenter', function(e){
        $(this).stop().animate({
          left: (e.type === 'mouseenter') ? 0 : -115
        })
      })
    }
  }
})(jQuery);
