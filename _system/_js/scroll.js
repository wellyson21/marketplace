/**
 * Created by Lucas on 28/11/2017.
 */

function Scroll(settings){

  this.scrollHandler = null;

  if(!settings){

    this.scrollToFlag = true;
  }else{

    this.setScroll(settings);
  }
}

Scroll.prototype = {
  config: function(settings){

  let obj = {},
      is_append = $$(settings.element).find('.EssentialJS_wrap').length ? !1 : !0;

      obj.element = $$(settings.element);
      obj.is_append = is_append;
      obj.axis = settings.pos.toLowerCase();
      obj.SAxis = obj.axis;
      obj.style = settings.style;
      obj.event = settings.add_event;

      obj.start_x = settings.start_x !== undefined ? settings.start_x : 0;
      obj.start_y = settings.start_y !== undefined ? settings.start_y : 0;
      obj.element_height = obj.element[0].clientHeight;

      obj.element_scroll_height = is_append ? obj.element.pos(0).scrollHeight : obj.element.find('.EssentialJS_wrap')[0].scrollHeight;
      obj.rolled_scroll = obj.element_height / obj.element_scroll_height * 100;
      obj.rest_scroll = Math.ceil(obj.element_scroll_height * (100 - obj.rolled_scroll) / 100);
      obj.scroll_bar_height = obj.element_height * (obj.rolled_scroll - 4) / 100;
      obj.min_height_SB = 22;

      obj.parent_width = obj.element.parent().width();
      obj.element_width = obj.element[0].clientWidth;
      obj.element_scroll_width = obj.element.pos(0).scrollWidth;
      obj.rolled_scroll_left = obj.element_width / obj.element_scroll_width * 100;
      obj.rest_scroll_left = Math.ceil(obj.element_scroll_width * (100 - obj.rolled_scroll_left) / 100);
      obj.scroll_bar_width = obj.element_width * (obj.rolled_scroll_left - 4) / 100;

      obj.has_sbx = false;
      obj.has_sby = false;
      obj.stepSBY = 0;

      //default style
      obj.width_container = settings.width_container ? settings.width_container :(settings.widthContainer) ? settings.widthContainer : 9;
      obj.height_container = settings.height_container ? settings.height_container :(settings.HeightContainer) ? settings.HeightContainer : 9;
      obj.border_container = settings.border_container ? settings.border_container :(settings.borderContainer) ? settings.borderContainer : "1px solid darkgray";
      obj.border_scroll = settings.border_scroll ? settings.border_scroll :(settings.borderScroll) ? settings.borderScroll : "none";
      obj.background_container = settings.background_container ? settings.background_container :(settings.backgroundContainer) ? settings.backgroundContainer : 'transparent';
      obj.background_scroll = settings.background_scroll ? settings.background_scroll :(settings.backgroundScroll) ? settings.backgroundScroll: "darkggray";
      obj.hover_color_scroll = settings.hover_color_scroll ? settings.hover_color_scroll :(settings.hoverColorScroll) ? settings.hoverColorScroll: "gray";

      obj.scroll_bar_height = obj.scroll_bar_height > obj.min_height_SB ? obj.scroll_bar_height : obj.min_height_SB;
      obj.scroll_bar_width = obj.scroll_bar_width > obj.min_height_SB ? obj.scroll_bar_width : obj.min_height_SB;

      ///add wrap and scrollBar
      obj.wrap = obj.element.find('.EssentialJS_wrap').length ? obj.element.find('.EssentialJS_wrap')[0] : $$("<div>",{class: 'EssentialJS_wrap',innerHTML: obj.element.html()});
      $$(obj.wrap).css('height',obj.element_height);


  // console.log(is_append,obj.element_scroll_height);

      if(is_append){

        obj.element.html("");
        $$(obj.wrap).append(obj.element);
      }

      if(obj.axis === 'xy'){

        obj.has_sbx = obj.element_width < obj.element_scroll_width ? !0 : !1;
        obj.has_sby = obj.element_height < obj.element_scroll_height ? !0 : !1;

      }else{

        if(obj.axis === 'x' && obj.element_width < obj.element_scroll_width){

          obj.has_sbx = true;

        }else if(obj.axis === 'y' && obj.element_height < obj.element_scroll_height){

          obj.has_sby = true;
        }

      }


      if(obj.axis === 'xy'){

        if(obj.has_sbx) {

          if (!$$(obj.element).find('.EssentialJS_container_scroll.x').length) {
            let tag = $$('<span>', {class: "EssentialJS_container_scroll"});
            $$(tag).addClass('x').attr("data-EssentialJS_SBX",true).html("<span class='EssentialJS_scroll_bar'></span>");
            $$(tag).prepend($$(obj.element));
          }
        }else{

          $$(obj.element).find(".EssentialJS_container_scroll.x").remove();
        }

        if(obj.has_sby) {

          if(!$$(obj.element).find('.EssentialJS_container_scroll.y').length) {

            let tag = $$('<span>', {class: "EssentialJS_container_scroll"});
            $$(tag).addClass('y').attr("data-EssentialJS_SBY",true).html("<span class='EssentialJS_scroll_bar'></span>");
            $$(tag).prepend($$(obj.element));
          }
        }else{

          $$(obj.element).find(".EssentialJS_container_scroll.y").remove();
        }
      }else{

        if(obj.axis === 'x'){

          let tag = $$("<span>",{class: "EssentialJS_container_scroll"});

          if(obj.element_width < obj.element_scroll_width) {
            if (!obj.element.find(".EssentialJS_container_scroll." + obj.axis).length) {

              $$(tag).addClass(obj.axis).attr("data-EssentialJS_SBX", true).html("<span class='EssentialJS_scroll_bar'></span>").prepend(obj.element);
            }
          }else{

            obj.element.find(".EssentialJS_container_scroll."+obj.axis).remove();
            return false;
          }
        }else if(obj.axis === 'y'){

          if(obj.element_height < obj.wrap.scrollHeight){

            if(!obj.element.find(".EssentialJS_container_scroll."+obj.axis).length){

              let tag = $$("<span>",{class: "EssentialJS_container_scroll"});
              $$(tag).addClass(obj.axis).attr("data-EssentialJS_SBY",true).html("<span class='EssentialJS_scroll_bar'></span>").prepend(obj.element);
            }
          }else{

            obj.element.find(".EssentialJS_container_scroll."+obj.axis).remove();
            return false;
          }
        }
      }

    //set scroll bar height/width
    if(obj.axis === 'x' && obj.has_sbx){

      $$(obj.element).find('.EssentialJS_scroll_bar').css({width: obj.scroll_bar_width > obj.min_height_SB ? obj.scroll_bar_width : obj.min_height_SB});
    }else if(obj.axis === 'y' && obj.has_sby){

      $$(obj.element).find('.EssentialJS_scroll_bar').css({height: obj.scroll_bar_height > obj.min_height_SB ? obj.scroll_bar_height : obj.min_height_SB});
    }else if(obj.axis === 'xy'){

      obj.stepSBY = obj.has_sbx && obj.has_sby ? obj.height_container : 0;

      if(obj.has_sbx){

        $$(obj.element).find('.EssentialJS_container_scroll.x .EssentialJS_scroll_bar').css({width: obj.scroll_bar_width > obj.min_height_SB ? obj.scroll_bar_width : obj.min_height_SB});
      }
      if(obj.has_sby){

        $$(obj.element).find('.EssentialJS_container_scroll.y .EssentialJS_scroll_bar').css({height: obj.scroll_bar_height > obj.min_height_SB ? obj.scroll_bar_height : obj.min_height_SB});
      }
    }

    obj.element.css({
      margin: 0,
      overflow: 'hidden'
    }).addClass('Essential_element_default_style');

    $$(obj.wrap).css({
      height: obj.element.height() - obj.element.css('paddingTop') - obj.element.css('paddingBottom'),
      overflowX: 'hidden',
      overflowY: obj.axis === 'x' ? 'hidden' : 'hidden'
    });

    if(obj.has_sbx && obj.has_sby){

      $$(obj.element).find('.EssentialJS_container_scroll.y').css({height: 94 - (obj.height_container / $$(obj.element).find('.EssentialJS_container_scroll.y').height() * 100) + '%'});
    }

    obj.element_scroll_height = obj.wrap.scrollHeight;
    obj.container_scroll_bar = $$(obj.element).find('.EssentialJS_container_scroll');
    obj.container_scroll_bar_x = $$(obj.element).find('.EssentialJS_container_scroll.x');
    obj.container_scroll_bar_y = $$(obj.element).find('.EssentialJS_container_scroll.y');
    obj.scroll_bar = $$(obj.element).find('.EssentialJS_scroll_bar');
    obj.scroll_bar_x = $$(obj.element).find('.EssentialJS_container_scroll.x .EssentialJS_scroll_bar');
    obj.scroll_bar_y = $$(obj.element).find('.EssentialJS_container_scroll.y .EssentialJS_scroll_bar');
    obj.container_scrollBH = $$(obj.element).find('.EssentialJS_container_scroll.y').length ? $$(obj.element).find('.EssentialJS_container_scroll.y').height() : 1;

    obj.container_scrollBW = $$(obj.element).find('.EssentialJS_container_scroll.x').length ? $$(obj.element).find('.EssentialJS_container_scroll.x').width() : 1;

    obj.currentY = $$(obj.wrap).scrollTop();
    obj.currentSY = obj.currentY;

    obj.currentX = $$(obj.wrap).scrollLeft();
    obj.currentSX = obj.currentX;

    obj.step_wheel = 35;

    obj.element_height = obj.wrap.clientHeight;

    settings = null;
    return obj;
  },

  setScroll: function (settings) {

    if(!settings){return this;}

    let self = this;

    function main(data){

      if(!data){return false;}

      let element = data.element,

          axis = data.axis,
          SAxis = data.SAxis,
          style = data.style,
          event = data.event,

          start_x = data.start_x,
          start_y = data.start_y,
          element_height = data.element_height,
          element_scroll_height = data.element_scroll_height,
          rolled_scroll = data.rolled_scroll,
          rest_scroll = data.rest_scroll,
          rest_scrollYPX = element_scroll_height - element_height,
          scroll_bar_height = data.scroll_bar_height,
          min_height_SB = data.min_height_SB,

          parent_width = data.parent_width,
          element_width = data.element_width,
          element_scroll_width = data.element_scroll_width,
          rolled_scroll_left = data.rolled_scroll_left,
          rest_scroll_left = data.rest_scroll_left,
          rest_scrollXPX = element_scroll_width - element_width,
          scroll_bar_width = data.scroll_bar_width,

          has_sbx = data.has_sbx,
          has_sby = data.has_sby,
          stepSBY = data.stepSBY,

          //default style
          width_container = data.width_container,
          height_container = data.height_container,
          border_container = data.border_container,
          border_scroll = data.border_scroll,
          background_container = data.background_container,
          background_scroll = data.background_scroll,
          hover_color_scroll = data.hover_color_scroll,

          container_scroll_bar = data.container_scroll_bar,
          container_scroll_bar_x = data.container_scroll_bar_x,
          container_scroll_bar_y = data.container_scroll_bar_y,
          scroll_bar = data.scroll_bar,
          scroll_bar_x = data.scroll_bar_x,
          scroll_bar_y = data.scroll_bar_y,
          container_scrollBH = data.container_scrollBH,

          container_scrollBW = data.container_scrollBW,

          currentY = data.currentY,
          currentSY = data.currentSY,

          currentX = data.currentX,
          currentSX = data.currentSX,

          step_wheel = data.step_wheel,

          wrap = data.wrap,

          is_append = data.is_append
      ;

      data = null;

      /// start scroll
      if(is_append){

        if(has_sbx){

          $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: 'x',monitor: false});
          wrap.scrollLeft = start_x;
          wrap.scrollTop = 0;
        }else if(has_sby){

          $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: 'y',monitor: false});
          wrap.scrollTop = start_y;
          wrap.scrollLeft = 0;
        }
      }else{

        $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: 'y',monitor: false});
        wrap.scrollTop = $$(wrap).scrollTop() + 1 <= $$(wrap).scrollTop() + 1 ? $$(wrap).scrollTop() + 1 : $$(wrap).scrollTop() - 1;
      }

      function scWheel(evt){

        evt.stopPropagation();
        evt.preventDefault();

        if(parseInt(evt.deltaY) > 0 && currentSY < element_scroll_height - element_height){

          let rolle = (step_wheel / (element_scroll_height - element_height)),
              rollef = (element_scroll_height - element_height) / 100 * rolle * 100;
              rollef = currentSY + rollef > element_scroll_height - element_height ? element_scroll_height - element_height : currentSY + rollef;

          $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: 'y'});
          wrap.scrollTop = rollef;

        }else if(parseInt(evt.deltaY) < 0 && step_wheel >= 1){

          let rollef;
          if(currentSY > step_wheel){

            let rolle = (step_wheel / (element_scroll_height - element_height));
                rollef = (element_scroll_height - element_height) / 100 * rolle * 100;
                rollef = currentSY - rollef;
          }else{

            rollef = 0;
          }

          $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: 'y'});
          wrap.scrollTop = rollef;
        }

      }
      function scScroll(evt){

        SAxis = scScroll.data.axis;

        let STMax = rest_scrollYPX,
            SLMax = rest_scrollXPX,
            SRT = evt.target.scrollTop,
            SRL = evt.target.scrollLeft,
            TPERCENT = (SRT) / STMax * 100,
            LPERCENT = (SRL) / SLMax * 100,
            TSBDIFF = (scroll_bar_height - stepSBY) / container_scrollBH * TPERCENT,
            LSBDIFF = (scroll_bar_width / container_scrollBW * LPERCENT);

        if(SAxis === 'x'){

          $$(element).find('.EssentialJS_container_scroll.x .EssentialJS_scroll_bar').css({left: LPERCENT - LSBDIFF + '%',transition: '.1s'});
          currentSY = $$(wrap).scrollLeft();
        }else if(SAxis === 'y'){

          $$(element).find('.EssentialJS_container_scroll.y .EssentialJS_scroll_bar').css({top: TPERCENT - TSBDIFF + '%',transition: '0s'});
          currentSY = $$(wrap).scrollTop();
        }

        if(scScroll.data.monitor !== false){

          add_event();
        }
      }

      function scDrag(evt){

        evt.stopPropagation();
        $$(document).off("mousemove",scDragMM).on('mousemove',scDragMM,true,{startY: evt.clientY,startX: evt.clientX,scrollLeft: currentSX,scrollTop: currentSY,axis: $$(this).parent().attr('data-EssentialJS_SBX') ? 'x' : 'y'});
      }
      function scDragMM(evtMM){

        let rolleY =  evtMM.clientY - scDragMM.data.startY,
            rolleX =  evtMM.clientX - scDragMM.data.startX,
            top = rolleY,
            left = rolleX,
            offsetTopOS = scDragMM.data.scrollTop + top,
            offsetLeftOS = scDragMM.data.scrollLeft + left;

        SAxis = scDragMM.data.axis;
        $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: SAxis});

        if(SAxis === 'x'){

          wrap.scrollLeft = offsetLeftOS + (left * 4);
          currentX =  $$(wrap).scrollLeft();
        }else{

          wrap.scrollTop = offsetTopOS + (top * 4);
          currentY =  $$(wrap).scrollTop();
        }
      }
      function scClick(evt){

        SAxis = $$(this).attr('data-EssentialJS_SBX') ? 'x' : 'y';

        let clientY = evt.clientY,
            clientX = evt.clientX,
            scroll_bar_top = scroll_bar_y.length ? scroll_bar_y.position().top : 0,
            scroll_bar_left = scroll_bar_x.length ? scroll_bar_x.position().left : 0,
            scroll_bar_bottom = scroll_bar_y.length ? scroll_bar_y.position().bottom : 0,
            scroll_bar_right = scroll_bar_x.length ? scroll_bar_x.position().right : 0,
            is_top = clientY < scroll_bar_top,
            is_left = clientX < scroll_bar_left,
            offset,
            rolle
        ;

          $$(wrap).off('scroll',scScroll).on('scroll',scScroll,true,{axis: SAxis});

        if(SAxis === 'x'){

          if(is_left){

            offset = scroll_bar_left - clientX;
            rolle = offset / container_scrollBW * 100;
            offset = currentSX - (element_scroll_width / 100 * rolle);
          }else{

            offset = clientX - scroll_bar_right;
            rolle = offset / container_scrollBW * 100;
            offset = currentSX + (element_scroll_width / 100 * rolle);
          }

          wrap.scrollLeft = offset;
        }else{


          if(is_top){

            offset = scroll_bar_top - clientY;
            rolle = offset / container_scrollBH * 100;
            offset = currentSY - (element_scroll_height / 100 * rolle);
          }else{

            offset = clientY - scroll_bar_bottom;
            rolle = offset / container_scrollBH * 100;
            offset = currentSY + (element_scroll_height / 100 * rolle);
          }

          $$(wrap).animate({
            scrollTop: offset
          },{duration: offset / 500 < .5 ? offset / 500 * 1000 : 400});
        }

      }

      function off(){

        $$(this).off('mousemove',scDragMM);
        currentSY = $$(wrap).scrollTop();
        currentSX = $$(wrap).scrollLeft();
      }

      function stopPropagationClick(evt){

        evt.stopPropagation();
      }

      /// add scroll monitor
      function add_event(){

        if(!event){return;}

        let when_values = ['top','bottom','left','right'];

        if(isNaN(parseInt(event.when)) && when_values.indexOf(event.when.toLowerCase()) !== - 1 && typeof event.callback === 'function'){

          if(event.when.toLowerCase() === 'top'){

            if(element.scrollTop() === 0){

              event.callback();
            }
          }else if(event.when.toLowerCase() === 'bottom'){

            if(element.scrollTop() === (element_scroll_height - element_height)){

              event.callback();
            }
          }else if(event.when.toLowerCase() === 'left'){

            if(element.scrollLeft() === 0){

              event.callback();
            }
          }else if(event.when.toLowerCase() === 'right'){

            if(element.scrollLeft() === (element[0].scrollWidth - element_width + 3)){

              event.callback();
            }
          }
        }

      }

      function add_all_events(){

        $$(document).off('mouseup',off).on('mouseup',off);
        $$(scroll_bar).off("mousedown",scDrag).on('mousedown',scDrag,true).off('click',stopPropagationClick).on('click',stopPropagationClick);
        $$(container_scroll_bar).off('click',scClick).on('click',scClick);
        $$(wrap).off('wheel',scWheel).on('wheel',scWheel);
      }

      this.scrollHandler = scScroll;

      add_all_events();

      if(is_append) {
        /// Set Custom Style
        scroll_bar.css('background', background_scroll);
        container_scroll_bar.css('background', background_container);
        scroll_bar.css('border', border_scroll);
        container_scroll_bar.css('border', border_container);

        if (!scroll_bar[0]) {

          return false;
        }

        let background_color = $$(scroll_bar[0]).css('background-color');
        scroll_bar.hover(function (evt, self) {

          evt.stopPropagation();
          $$(self).css('background-color', hover_color_scroll);
        }, function (evt, self) {

          evt.stopPropagation();
          $$(self).css('background-color', background_color);
        });

        container_scroll_bar_y.css('width', width_container);
        $$(element).css('paddingRight', $$(element).css('paddingRight') + width_container);
        container_scroll_bar_x.css('height', height_container);
        $$(wrap).css('paddingBottom', has_sbx ? $$(wrap).css('paddingBottom') + height_container + 5 : 0);
      }

    }

    main(self.config(settings));


    let target = $$(settings.element).find(".EssentialJS_wrap")[0],
        observer = new MutationObserver(function(mutations) {
          mutations.forEach(function() {

            main(self.config(settings));
          });
        });

    observer.disconnect();
    observer.observe(target, {childList: true, characterData: true});

    $$(window).off('resize',resizeHandler).on('resize',resizeHandler);

    function resizeHandler(){

      main(self.config(settings));
    }


  },
  scrollTo: function(element,to,duration){

    let interval = setInterval(fInterval,10);

    element = element.hasClass("EssentialJS_wrap") ? element.parent() : element;
    duration = this.scrollToFlag && duration ? duration * 2 :(!this.scrollToFlag && duration) ? duration : 1000;

    this.config({element: element,pos: 'y',scrollTo : false});

    function fInterval(){

      if($$(element).find('.EssentialJS_wrap').length){

        if(!this.scrollHandler){return false;}

        setTimeout(function(){

          $$(element).find('.EssentialJS_wrap').off('scroll',this.scrollHandler).on('scroll',this.scrollHandler,false,{axis: "y"});
          $$(element).find('.EssentialJS_wrap').animate({
            scrollTop: to
          },{duration : duration});
        },200);

        interval = clearInterval(interval);
      }
    }


  }


};



