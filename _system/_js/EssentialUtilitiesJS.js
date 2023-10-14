/**
 * Created by KENPACHI on 13/03/2017.
 */

'use strict';

window.class = {};

function Utilitie(){

  this.settingSelect();
  this.center();
}

Utilitie.prototype = {

  activePage: function(items,path = "",callback){

    path = path ? path.toLowerCase() : "";
    let ele = $$(items).find('li').size() > 0 ? 'li' : 'div',count = 0,matched = false,isIndex = false;

    if($$(items.find(ele)).length > 0){

      $$(items.find(ele)).map(function(k,v){
        let urlArr = window.location.pathname.split('?');

        if(urlArr){

          urlArr = urlArr[0].split('#')[0].split('/').filter(function(v){return v !== ""});
          if(urlArr.length > 0){

            urlArr = urlArr[urlArr.length - 1].trim().toLowerCase();
          }
        }

        if($$("body").attr('data-link')){

          let url = $$("body").attr('data-link').toLowerCase();

          if($$(v).attr('data-link')){

            if(url === ($$(v).attr('data-link').toLowerCase())){
              if(callback){callback($$(v));}
              matched = true;
              return true;
            }
          }

        }else{

          if($$(v).attr('data-link')){
            if(urlArr === ($$(v).attr('data-link').toLowerCase())){
              if(callback){callback($$(v));}
              matched = true;
              return true;
            }else if(urlArr.length === 0 && $$(v).attr('data-link') && $$(v).attr('data-link').toLowerCase() === "index"){

              matched = false;
              isIndex = true;
              return true;
            }else if(typeof urlArr === "string" && urlArr.toLowerCase() === path && $$(v).attr('data-link') && $$(v).attr('data-link').toLowerCase() === "index"){

              matched = false;
              isIndex = true;
              return true;
            }else{

              matched = false;
              isIndex = false;
            }
          }
        }


      });

      if(!matched && isIndex) {
        if ($$(items.find(ele)).length > 0) {
          $$(items.find(ele)).map(function (k, v) {
            if ($$(v).attr('data-link').toLowerCase() === 'index') {
              callback($$(v));
              return true;
            }
          });
        }
      }

    }
  },

  activeButton: function(data){

    if(data.elements.length < 1 || typeof data.style !== 'object' && !data.active && !data.desActive){return '';}

    let callback = typeof data.callback === "function" ? data.callback : function(){};
    let urlArr = window.location.href.split('?')[0].split('/').filter(function(v){return v !== ""});
    urlArr = urlArr[urlArr.length - 1].trim().toLowerCase();

    data.triggerC = data.triggerC !== undefined ? data.triggerC : 0;
    data.modeUrl = data.modeUrl !== undefined ? data.modeUrl : false;

    let defaultStyle = data.defaultStyle ? data.defaultStyle :($$(data.elements[0]).css('backgroundColor') === 'transparent') ? {'background': $$(data.elements[0]).css('backgroundImage')} : {backgroundColor: $$(data.elements[0]).css('backgroundColor')};

    if(data.active){
      $$(data.elements[0]).addClass(data.active);
    }

    data.elements.map(function(k,v){

      $$(data.style).map(function(k2,v2){ defaultStyle[k2] = $$(v).css(k2); });

      if($$(v).attr("data-link") && $$(v).attr("data-link").trim() === urlArr && data.modeUrl){

        data.triggerC = k;
      }

     if($$(v).attr('data-selected')){

      if(data.style){
        $$(v).css(data.style);
        callback(v);
        return;
      }
       else if(data.active){

          $$(v).addClass(data.active);
          callback(v);
          return;
        }
      }

      $$(v).attr("data-index",k);
    });


    $$(data.elements[data.triggerC]).attr('data-selected',true);

    $$(data.elements).click(function(evt){

      evt.stopPropagation();
      $$(this).attr('data-selected',true);

      if(data.active){$$(this).removeClass(data.inactive).addClass(data.active);}
      else if(data.style){$$(this).css(data.style)}


      let prevAll = $$(this).prevAll(),
        nextAll = $$(this).nextAll();

      prevAll.map(function(k,v){
        $$(v).removeAttr('data-selected');
        if(defaultStyle){
          $$(v).css(defaultStyle);
        }
        if(data.active){
          $$(v).removeClass(data.active);

          if(data.inactive){

            $$(v).addClass(data.inactive);
          }
        }
      });

      nextAll.map(function(k,v){
        $$(v).removeAttr('data-selected');
        if(defaultStyle){$$(v).css(defaultStyle);}
        if(data.active){
          $$(v).removeClass(data.active);
          if(data.inactive){

            $$(v).addClass(data.inactive);
          }
        }
      });

      callback(this);

    });


    if(!isNaN(data.triggerC)){
      $$($$(data.elements)[data.triggerC]).trigger('click')
    }

  },

  setWidth: function(data){

    data.maxLength = data.maxLength ? data.maxLength : data.length;

    let cont = data.cont,
      eleX = $$(data.elements[0]).width(),
      length = data.length < data.maxLength ? data.length : data.maxLength,
      incre = data.incre ? data.incre : 0,
      decre = data.decre ? data.decre : 0,
      margin = data.margin ? length * data.margin : 0,
      contW = length * eleX + margin;

    contW = contW + incre - decre;

    cont.css({width: contW + 'px'});

  },

  pagination: function(data){

    let contLi = data.contLi,
      prev = data.prev,
      next = data.next,
      prev_class = data.prev_class ? data.prev_class : '.prev',
      next_class = data.next_class ? data.next_class : '.next',
      show = data.show ? data.show : 5,
      type = data.type ? data.type : 'post',
      active = data.active ? data.active : 'activePage',
      desActive = data.desActive ? data.desActive : 'desActivePage',
      url = data.url ? data.url : false,
      content = data.content,
      dataPost = data.data ? data.data : {},
      beforeSend = typeof data.beforeSend === 'function' ? data.beforeSend : function(){},
      complete = typeof data.complete === 'function' ? data.complete : function(){},
      trigger = data.trigger !== undefined ? data.trigger : true,
      source = data.source !== undefined ? data.source : "php",
      controlsDisabled = "hide";

    contLi = contLi.not(prev_class).not(next_class);
    contLi.off("click");
	if(contLi.length === 0){return;}
	
    Utilities.activeButton({
      elements: contLi,
      active: active,
      inactive: desActive
    });

    $$(contLi[0]).parent().find("a").on("click",function(e){e.preventDefault();});


    let nextEle = $$(contLi[0]).nextAll().not(next_class);

    for(let i = 0;i < show - 1;i++){
      if(nextEle[i]){
        $$(nextEle[i]).attr('data-block',true);
      }
    }

    if(nextEle[show-2]){$$(nextEle[show-2]).nextAll().not(next_class).removeClass('show').addClass('hide');}


    let isFirstLoad = true;
    $$(contLi.on("click",function(){

      let link = url ? url : $$(this).find('a'),
        self = this;

      if(!$$(self).next().not(next_class)[0]){next.addClass(controlsDisabled);}
      else{next.removeClass(controlsDisabled);}
      if(!$$(self).prev().not(prev_class)[0]){prev.addClass(controlsDisabled);}
      else{prev.removeClass(controlsDisabled);}

      if($$(self).attr('data-request') === "true" || !$$(self).attr('data-request')){

        if(source === "php"){

          $$.ajax({
            url: link.attr('href'),
            type: type,
            data: dataPost,
            beforeSend: beforeSend,
            success: function(r){

              let html;
              try{

                html = JSON.parse(r);
              }catch(e){console.log("Error DECODE RESULT PAGINATION.");return;}

              if(content){content.html(html[0]);}

              if(data.success){data.success(self,html,isFirstLoad);}

              isFirstLoad = false;
              html = null;
              active = null;
              desActive = null;
            },
            complete: complete
          });
        }else{

          complete(self,isFirstLoad);
          if(data.success){data.success([]);}
          isFirstLoad = false;
        }
      }else{

        $$(self).attr('data-request',"true");
      }


      $$(this).removeClass('hide').addClass('show').attr('data-block',true);
      $$(this).next().not(next_class).removeClass('hide').addClass('show').attr('data-block',true);

      let prevAll = $$(this).prevAll().not(prev_class),
          nextAll = $$(this).nextAll().not(next_class),
          leftLinks = 0,
          rightLinks = 0;


      if($$(this).prev() && $$(this).prev().not(prev_class)[0]){

        $$(this).prev().not(prev_class).removeClass('hide').addClass('show').attr('data-block',true);
      }

      if(!$$(this).prev().not(prev_class)[0]){

        prev.addClass(controlsDisabled);
      }

      for(let i = 0,j = 1;i < show;i++,j++){
        if(prevAll[i] && $$(prevAll[i]).attr('data-block')){

          leftLinks = j;
        }
      }

      for(let i = 0,j = 1;i <= show;i++,j++){
        if(nextAll[i] && $$(nextAll[i]).attr('data-block')){

          rightLinks = j;
        }
      }

      let missingLeftL = show - rightLinks - 1,
          missingRight = show - missingLeftL - 1;

      if(prevAll[missingLeftL - 1]){

        $$(prevAll[missingLeftL - 1]).prevAll().not(prev_class).removeClass('show').removeAttr('data-block').addClass('hide');
      }

      for(let i = 0;i < missingLeftL;i++){
        if(prevAll[i]){

          $$(prevAll[i]).removeClass('hide').addClass('show').attr('data-block',true);
        }
      }

      for(let i = 0,j = 1;i < show;i++,j++){
        if(prevAll[i] && $$(prevAll[i]).attr('data-block')){

          leftLinks = j;
        }
      }

      if(leftLinks + missingRight === show){

        $$(nextAll[show - 2]).removeClass('show').addClass('hide').removeAttr('data-block');
      }
    }));

    if(trigger){$$(contLi[0]).trigger('click');}

    next.click(function(){
      contLi.map(function(k,v){
        if($$(v).attr('data-selected')){
          if($$(v).next() && $$(v).next().not(next_class)[0]){
            $$(v).next().trigger('click');
            return true;
          }
        }
      });
    });

    prev.click(function(){
      contLi.map(function(k,v){
        if($$(v).attr('data-selected')){
          if($$(v).prev() && $$(v).prev().not(prev_class)[0]){
            ($$(v).prev().trigger('click'));
          }
        }
      });
    });

  },


  center: function(opts){

    opts = opts ? opts : {};
    let elements = $$('.center'),
      increment = opts.increment ? opts.increment : 0,
      decrement = opts.decrement ? opts.decrement : 0;


    $$(window).resize(function(){
      set_center();
    });


    function set_center(){
      elements.map(function(i,v){

        let windowY = $$(window).height(),
          eleY = $$(v).height(),
          windowX = $$(window).width(),
          eleX = $$(v).width();

        $$(v).css({
          top: windowY / 2 - eleY / 2 + increment - decrement + 'px',
          left: windowX / 2 - eleX / 2
        });

      });

    }
    set_center();


  },

  centerXY: function(cont,ele,pos,refresh,extra){

    pos = pos.toLowerCase();
    refresh = refresh === undefined ? true : refresh;
    let contY,contX,eleX,eleY;
    extra = extra ? extra : 0;

    let c = function(st){
      cont = $$(cont);
      let decre = st ? 59 : 0;

      contY = cont.height();
      contX = cont.width();

      ele = $$(ele);
      eleX = $$(ele[0]).width();
      eleY = $$(ele[0]).height();

      if(ele.css('position') === 'static'){

        ele.css('position','relative');
      }

      if(pos === 'y'){

        let top = (contY / 2 ) - eleY / 2 + extra;

        if(top >= 0){

          ele.css({top: top});
        }

      }else{

        ele.css({left: (contX  - eleX - decre) / 2 + extra + 'px'});
      }
    };

    if(refresh === true){

      c(true);
      $$(window).resize(function(){
        c();
      });

    }else{

      c();
    }


  },

  settingSelect: function(icons){

    let containers = $$('.per-select');
    icons = typeof icons === 'object' && $$(icons).size() === 2 ? icons : ['per-select-icon fa fa-chevron-down','per-select-icon fa fa-chevron-up'];

    let rv = containers.map(function(k,cont){
      let inputs = $$(cont).find('select option'),
          optionStr = '',
          ulTag = $$($$('<ul>',{class: 'hide'})),
          contOptSelected = $$($$('<div>',{class: 'cont-opt-selected'})),
          optionSelected = $$($$('<span>',{class: 'per-opt-selected'})),
          contIconTag = $$('<div>',{class: 'essential-cont-incon-tag'}),
          iconTag = $$('<i>'),
          select = $$($$(cont).find('select')[0]),
          dataTranslate = select.attr("data-translate") ? select.attr("data-translate") : false;

      $$(optionSelected).setAttr("data-translate",dataTranslate);

      inputs.map(function(k,input){optionStr += '<li data-per_input_pos="'+k+'" data-value="'+$$(input).val()+'"><p><span data-translate="'+ dataTranslate +'">'+$$(input).text().trim()+'</span></p></li>';});

      ulTag.html(optionStr).css({zIndex: 1000});


      if($$(cont).find('.per-opt-selected').length){return false;}

      if(ulTag.find('li').length){


        inputs.optionIsEqual(select.val(),function(k,o){optionSelected.html($$(o).text().trim());});

        select.find('option').optionIsEqual(select.val(),function(k,v){

          v.selected = true;
          $$(ulTag.find('li')[k]).addClass("essential-active-opt-select").setAttr('data-per_opt_selected',true);
        });
        optionSelected.append(contOptSelected);
        contOptSelected.prepend($$(cont));
      }

      ulTag.append(cont);
      iconTag.className = icons[0];

      $$(iconTag).prepend(contIconTag);
      $$(contIconTag).prepend(cont);
    });

    if(rv === false){return'';}

    $$('body').on('click',function(){
      $$('.per-select ul').addClass('hide');

      $$('.per-select').map(function(k,ps){

        $$(ps).find('i').attr('class',icons[0]);
      });

    });

    function markActiveOption(v){

      let prevAll = $$(v).prevAll(),
          nextAll = $$(v).nextAll();

      $$(v).setAttr('data-per_opt_selected',true);
      prevAll.removeAttr('data-per_opt_selected').setAttr("selected",false);
      nextAll.removeAttr('data-per_opt_selected').setAttr("selected",false);

      $$(v).addClass("essential-active-opt-select");
      prevAll.removeClass('essential-active-opt-select');
      nextAll.removeClass('essential-active-opt-select');

      $$(v).parents('.per-select').find('i').attr('class',icons[0]);
    }

    $$('.per-select').click(function(evt){
      evt.stopPropagation();
      let self = this;
      $$('.per-select').map(function(k,cont){
        if(cont !== self){
          $$(cont).find('ul').addClass('hide');
          $$(cont).find('i').attr('class',icons[0]);
        }
      });
    });



    $$('.per-select').map(function(k,cont){

      cont = $$(cont);

      cont.find(".per-opt-selected").css('height',cont.css('height'));
      cont.find(".per-select").css('min-width',cont.find('select').css('width'));

      cont.find('li').click(function(evt){

        evt.stopPropagation();

        if(!$$(this).attr('data-per_opt_selected')){
          let select = $$(this).parents('.per-select').find('select');
          $$(this).parents('.per-select').find('.per-opt-selected').html($$(this).text());

          if(!select.find('option')[$$(this).attr('data-per_input_pos')].selected){

            select.find('option')[$$(this).attr('data-per_input_pos')].selected = true;
            select.trigger('change');
            select.val($$(this).attr('data-value'));
          }

          markActiveOption(this);
        }

        $$(this).parent().addClass('hide');
        $$(this).parents('.per-select').find('i').attr('class',icons[0]);

      });

      cont.toggle({
        event: 'click',
        first: function(evt,self){
          evt.stopPropagation();
          $$(self).find('ul').removeClass('hide');

          $$(self).find('i').attr('class',icons[1]);
        },
        second: function(evt,self){
          evt.stopPropagation();

          if($$(self).find('ul').hasClass('hide')){
            $$(self).find('ul').removeClass('hide');
            $$(self).find('i').attr('class',icons[1]);
          }else{

            $$(self).find('i').attr('class',icons[0]);
            $$(self).find('ul').addClass('hide');
          }

        }
      });

    });

    $$(".per-select select").on("change",function(){
      let value = $$(this).val();
      let self = this;

      $$(this).find("option").optionIsEqual(value,function(index,value){

        $$($$(self).parents(".per-select").find("ul li")[index]).trigger("click");
      },true);
    });

    $$('.per-select').on("selectstart",function(e){e.preventDefault();})


  },

  customComponents: {

    select: function(settings){
      let objMsgsErrors = {
        noObject: 'The method requires an object.',
        noMainElem: 'Main element not informed.',
        noClass: function(methodName){ return 'Error in method: '+ methodName +'. Enter a string with the class name of the element, example: ".class".'; },
        invalidArgs: 'The arguments passed to the object are incorrect.'
      };

      if(typeof settings !== 'object'){ errors( objMsgsErrors.noObject ); }
      if(typeof settings.contSelect !== 'object'){ errors( objMsgsErrors.noObject ); }

      let lenElemMain = settings.contSelect.length,
          classDisplay = settings.classDisplay,
          classGroupOptions = settings.classGroupOptions,
          classOptions = settings.classOptions;

      $$(settings.contSelect).map(function(k,cSelect){

        let cDisplay,cGroupOptions,cOptions,
          cD = classDisplay, cG = classGroupOptions, cO = classOptions;

        if(typeof classDisplay === 'object' && classDisplay.length === lenElemMain){ cD = classDisplay[k]; }
        if(typeof classGroupOptions === 'object' && classGroupOptions.length === lenElemMain){ cG = classDisplay[k]; }
        if(typeof classOptions === 'object' && classOptions.length === lenElemMain){ cO = classDisplay[k]; }

        cDisplay = cD && (typeof cD === 'string' && /\.\w+/.test(cD)) ? cD : errors( objMsgsErrors.noClass('classDisplay') );
        cGroupOptions = cG && (typeof cG === 'string' && /\.\w+/.test(cG)) ? cG : errors( objMsgsErrors.noClass('classGroupOptions') );
        cOptions = cO && (typeof cO === 'string' && /\.\w+/.test(cO)) ? cO : errors( objMsgsErrors.noClass('classOptions') );

        let contSelect = $$(cSelect) ? $$(cSelect) : errors( objMsgsErrors.noMainElem ),
          options = contSelect.find(cOptions),
          callbackToClick = settings.callbackToClick && typeof settings.callbackToClick === 'function' ? settings.callbackToClick :
            ( settings.callbackToClick && typeof settings.callbackToClick === 'object' ? settings.callbackToClick[k] : false ),
          callbackToElements = settings.callbackToElements && typeof settings.callbackToElements === 'function' ? settings.callbackToElements :
            ( settings.callbackToElements && typeof settings.callbackToElements === 'object' ? settings.callbackToElements[k] : false );

        contSelect.on('click',showGroupOptions);
        options.on('click',optionsClick);

        function showGroupOptions(e){
          let contOptions = $$(this).find(cGroupOptions);
          e.stopPropagation();
          contOptions.fadeToggle(500);
        }

        function optionsClick(e){
          let val = $$(this).text(), attrData = $$(this).attr('data-value');
          e.stopPropagation();
          contSelect.find(cDisplay).text(val);
          contSelect.find(cDisplay).attr('selected',attrData);
          contSelect.find(cGroupOptions).fadeOut(500);
          if(callbackToClick){ callbackToClick({contSelect: contSelect, target: $$(this)},attrData) }
        }

        if(callbackToElements){ callbackToElements({contSelect: contSelect}); }

      });

      function errors(exit) { throw(exit); }


      (function settingCloses(){

        $$(window).on('resize',function(){
          searchElemetsVisibled();
        });

        $$('#headerPage,#contMain,#footerPage').on('click',function(){
          searchElemetsVisibled();
        });

        $$('body').on('wheel',function(){
          searchElemetsVisibled();
        });

        function searchElemetsVisibled(){
          $$(settings.contSelect).map(function(k,cSelect){
            if($$(cSelect).find(".groupOptions").css('display') === 'block'){
              $$(cSelect).trigger('click');
            }
          });
        }

      }());

    }

  },

  refreshSlideBlockUnique: function(object){

    let obj = typeof object === 'object' ? object : false;

    let contS = obj.contSlide ? obj.contSlide : '',
        contIS = obj.contItemsSlide ? obj.contItemsSlide : '',
        itemsS = obj.itemsSlide ? obj.itemsSlide : '',
        contDiscs = obj.contDiscs ? obj.contDiscs : '',
        prevBtn = obj.prevBtn ? obj.prevBtn : '',
        nextBtn = obj.nextBtn ? obj.nextBtn : '',
        playBtn = obj.playBtn ? obj.playBtn : '',
        stopBtn = obj.stopBtn ? obj.stopBtn : '';

    $$(playBtn).off("click");
    $$(stopBtn).off("click");
    $$(prevBtn).off("click");
    $$(nextBtn).off("click");

    if(contDiscs){

      // itemsS.removeAttr('data-active');
      $$(contDiscs).find("i").remove();
    }

    return Utilities.slideBlockUnique(object);
  },

  slideBlockUnique: function(object) {

    let obj = typeof object === 'object' ? object : false;

    let contS = obj.contSlide ? obj.contSlide : '',
        contIS = obj.contItemsSlide ? obj.contItemsSlide : '',
        itemsS = obj.itemsSlide ? obj.itemsSlide : '',
        contDiscs = obj.contDiscs ? obj.contDiscs : '',
        animateS = obj.animateSlide ? obj.animateSlide : 'disable',
        prevBtn = obj.prevBtn ? obj.prevBtn : '',
        nextBtn = obj.nextBtn ? obj.nextBtn : '',
        playBtn = obj.playBtn ? obj.playBtn : '',
        stopBtn = obj.stopBtn ? obj.stopBtn : '',
        timeTransition = obj.timeTransition ? obj.timeTransition : 2000,
        timeEffect = obj.timeEffect ? obj.timeEffect : 500,
        currentDiscPos = 0,
        firstActiveDisc = 0,
        currentItem = $$(itemsS[0]),
        interval, intEffect,
        click_boll_next = false,
        callback = typeof obj.callback === "function" ? obj.callback : function(){},
        effect = typeof obj.effect === "function" ? obj.effect : function(){},
        resizeOpacity = obj.resizeOpacity ? obj.resizeOpacity : false;

    if(itemsS.length === 0){return;}

    /** default style **/
    contS.addClass("Essential_slide_container");
    contIS.addClass("clearfix");


    let slide = {

      /** Define o tamanho do container **/
      defineWidthCont: function(addDiscs = true){

        contS.addClass("Essential_slide");

        let wContS = contS[0].clientWidth, calcWidth = wContS * itemsS.length;

        // wContS = ;
        itemsS.css({ width: wContS + 'px',margin: "0", transition: "0s"});

        contIS.css({ width: calcWidth + 'px',height: contS.css("height"), transition: "0s"});
        contIS.find("img").css({height: (contS.css("height") - 2),transition: "0s"});

        if(addDiscs){

          slide.addDiscs();
        }

        /***** Atributos de acesso do objeto ******/
        slide.lengthElems = itemsS.length;
        slide.widthElems = wContS;
        /******************************************/
      },

      /** Ativa o primeiro elemento da fila **/
      activeFirstItemList: function(){

        itemsS.first().setAttr('data-active',true);
        contDiscs.find('i').first().removeClass('fa-circle-o').addClass('fa-circle');
        callback(itemsS.first(),slide);
        slide.currentElement = itemsS.first();
        slide.effect(effect,{time: timeTransition,action:'play'});

        return itemsS.first();

      },

      /** Ativa o próximo elemento da fila **/
      activeNextItemList: function(cEle,prevEle,nextEle){

        $$(prevEle).removeAttr('data-active');
        if(nextEle){$$(nextEle).removeAttr('data-active');}
        currentItem.removeAttr('data-active');
        currentItem = $$(cEle).setAttr('data-active',true);

      },

      addDiscs: function(){

        // if(contDiscs && !contDiscs.find('i').size()){

          contDiscs.find("i").remove();

          itemsS.map(function(k,v){
            let tag = $$('<i>');
            tag.className = 'far fa-circle Essential_slide_circles_item';
            $$(tag).append(contDiscs).setAttr('data-pos',k);
            $$(v).setAttr('data-slide-item',k);
          });
        // }

        contDiscs.find('i').on('mouseenter',function(){

          stopBtn.trigger('click');

        }).on('mouseout',function(){

          playBtn.trigger('click');
        });
      },

      activeFirstDisc: function(){

        slide.alterDiscs(0);

      },

      activeDiscs: function(evt){
        evt.stopPropagation();

        let discPos = $$(this).attr('data-pos') * 1,
            widthElem = slide.widthElems;

        if(discPos > currentDiscPos){

          let current_index = currentItem.attr('data-slide-item') * 1;

          for (let i = current_index, j = 1; i <= discPos; i++,j++) {
            if (i < discPos - 1) {

              current_index = i;
              $$(itemsS[current_index]).append(contIS);
              contIS.css({left: 0, transition: '0s'});
            } else{

              current_index = i;
              let next_index = current_index,
                  nextx_index = current_index + 1 > itemsS.length ? 0 : current_index + 1;

              itemsS.removeAttr('data-active');
              slide.alterDiscs(discPos);
              currentItem = $$(itemsS[next_index]).attr('data-active', true);
              click_boll_next = true;

              contIS.animate({
                left: -widthElem+'px'
              },{
                duration: timeEffect,
                complete: function(){

                  $$(itemsS[current_index]).append(contIS);
                  contIS.css({left: 0,transition: '0s'});
                  callback($$(itemsS[nextx_index]),slide);
                }
              });
              break;
            }

          }

        }
        else if(discPos < currentDiscPos){

          let current_index = currentItem.attr('data-slide-item') * 1;

          for (let i = current_index,j = 1; i >= discPos; i--,j++) {

            if (i > discPos) {

              current_index = i;
              $$(itemsS[current_index]).prepend(contIS);
              contIS.css({left: 0, transition: '0s'});

            } else{

              current_index = i;
              let next_index = current_index;
              currentItem = $$(itemsS[next_index]).attr('data-active',true);
              click_boll_next = false;

              $$(itemsS[next_index]).prepend(contIS);
              contIS.css({
                left: -(widthElem),
                transition: '0s'
              });

              contIS.animate({
                left: 0
              },{
                duration: timeEffect,
                complete: function(){

                  callback($$(itemsS[next_index]),slide);
                  itemsS.removeAttr('data-active');
                  slide.alterDiscs(discPos);
                }
              });
              break;
            }
          }
        }
      },

      alterDiscs: function(pos,f){

        $$($$(contDiscs).find('i')[pos]).prevAll().removeClass('fas').addClass('far').removeAttr('data-acDisc');
        $$($$(contDiscs).find('i')[pos]).nextAll().removeClass('fas').addClass('far').removeAttr('data-acDisc');
        $$($$(contDiscs).find('i')[pos]).removeClass('far').addClass('fas').setAttr('data-acDisc',true);

        if(f){
          firstActiveDisc = pos
        }else{
          currentDiscPos = pos;
        }

      },

      /** Configurações dos efeitos do slide **/
      runSlide: function(){

        $$(nextBtn).trigger('click');

      },

      /** Configurações para reiniciar eventos de transição **/
      play: function(){

        $$($$(contDiscs).find('i')).off('click',slide.activeDiscs);
        playBtn.css({ color: 'lightGreen', opacity: 1 });
        stopBtn.css({ color: '#fff', opacity: '.5' });

        clearInterval(interval);

        if(animateS === 'enable'){

          interval = setInterval(slide.runSlide, timeTransition);
          intEffect = setInterval(function(){ slide.effect(effect,{time: timeTransition,action:'play'}) }, (timeTransition / 2) );
        }

      },

      /** Configurações para acionamento do elemento posterior **/
      stop: function(){

        $$($$(contDiscs).find('i')).click(slide.activeDiscs);
        stopBtn.css({ color: 'indianRed', opacity: 1 });
        playBtn.css({ color: '#fff', opacity: '.5' });

        if(interval){ clearInterval(interval); }
        if(intEffect){
          clearInterval(intEffect);
          slide.effect(effect,{time: timeTransition,action:'stop'})
        }

      },

      effect: function(callback,settings){

        if(settings.action === 'play'){
          itemsS.map(function(k,v){
            if($$(v).attr('data-active')){
              callback({allElements: itemsS, currentElement: $$(v)},settings,slide);
            }
          });
        } else if(settings.action === 'stop'){

          callback({allElements: itemsS},settings,slide);

        }


      }

    };

    /** Retrocede a fila para o elemento anterior **/
    function prev(evt){

      $$(this).off('click',prev);
      let self = this;
      evt.stopPropagation();

      if(itemsS.length > 1) {

        let cIndex = parseInt(currentItem.attr('data-slide-item')),
            prev_index = cIndex <= 0 ? itemsS.length - 1 : cIndex - 1,
            itemWidth = currentItem.css('width'),
            left = itemWidth;

        let current_element = itemsS[prev_index];

        $$(current_element).prepend(contIS);

        contIS.css({left: -left+'px',transition: '0s'});

        contIS.animate({ left: 0 },{ duration: timeEffect, complete: function(){
          $$(self).on('click',prev);
          callback(currentItem,slide);
        }});

        slide.alterDiscs(prev_index);
        itemsS.removeAttr('data-active');
        currentItem = $$(itemsS[prev_index]).attr('data-active',true);

      }

    }

    /** Avança a fila para o elemento posterior **/
    function next(evt){

      $$(this).off('click',next);
      let self = this;
      evt.stopPropagation();

      if(itemsS.length > 1){
        let current_index = parseInt(currentItem.attr('data-slide-item'));

        if(click_boll_next){

          currentItem = current_index + 1 > itemsS.length ? $$(itemsS[0]) : $$(itemsS[current_index + 1]);
          current_index = current_index + 1 > itemsS.length ? 0 : current_index + 1;
          click_boll_next = false;
        }

        let itemWidth = currentItem.css('width'),
            left = itemWidth,
            next_index = current_index + 1 > itemsS.length - 1 ? 0 : current_index + 1;

        let prevEle = itemsS[current_index],
            next_element = itemsS[next_index];

        slide.alterDiscs(next_index);
        itemsS.removeAttr('data-active');
        currentItem = $$(next_element).attr('data-active',true);

        $$(contIS).animate({
          left: '-'+left + 'px'
        },{
          duration: timeEffect,
          complete: function(){

            $$(prevEle).append(contIS);
            $$(contIS).css({left: 0,transition: '0s'});

            $$(self).on('click',next);
            callback(currentItem,slide);
          }
        });
      }

    }

    $$(window).on('resize',function(){

      // let wContS = contS.css('width'), calcWidth = wContS * itemsS.length,
      //     hItemsS = itemsS[0].clientHeight;
      //
      // wContS = contS[0].clientWidth;
      // itemsS.css({ width: wContS + 'px'});
      // contIS.css({ width: calcWidth + 'px',height: contS.css("height")});
      // contIS.find("img").css({height: (contS.css("height") - 2),width: '100%'});

      if(resizeOpacity){

        contS.css("opacity",0);
      }

      // contIS.css({ transition: "0s" });
      // slide.defineWidthCont(false);
      if(resizeOpacity){

        contS.css("opacity",1);
      }

    });



    slide.defineWidthCont();
    slide.activeFirstItemList();
    slide.activeFirstDisc();

    nextBtn.on('click',next).on('mouseenter',slide.stop).on('mouseleave',slide.play);
    prevBtn.on('click',prev).on('mouseenter',slide.stop).on('mouseleave',slide.play);

    $$(contDiscs).find('i').on('click',slide.activeDiscs);

    if(animateS === 'enable' && playBtn && stopBtn){

      playBtn.on('click',slide.play);
      stopBtn.on('click',slide.stop);

      playBtn.css({ display: 'inline' });
      stopBtn.css({ display: 'inline' });
      playBtn.trigger('click');
    }
    else if(animateS === 'disable' && playBtn && stopBtn){

      playBtn.addClass('hidden');
      stopBtn.addClass('hidden');
      stopBtn.trigger('click');
    }

    return slide;
  },

  slideBlockMultiples: function(object){
    let obj = typeof object === 'object' ? object : false;

    /**
     ****************************************** Documentation API SlideBlocks ******************************************
     *
     * @type {.object EssentialJs.} contSlide: Container externo do slide => [section]
     * @type {.object EssentialJs.} prevBtn: Recebe o botão para acionar o elemento anterior => [button]
     * @type {.object EssentialJs.} nextBtn: Recebe o botão para acionar o elemento posterior => [button]
     * @type {string} animateSlide: Usado para acionar o modo automático ou pará-lo => ['enable' || 'disable']
     * @type {number} timeTransition: Recebe o tempo de intervalo para a chamada dos elementos => [2000]
     * @type {number} timeEffect: Recebe o tempo de transição dos elementos => [500]
     *
     * *****************************************************************************************************************
     */



    let contS = obj.contSlide ? obj.contSlide : '',
        contIS = contS ? contS.find('ul') : '',
        itemsS = contIS ? contIS.find('li') : '',
        prevBtn = obj.prevBtn ? obj.prevBtn : '',
        nextBtn = obj.nextBtn ? obj.nextBtn : '',
        animateS = obj.animateSlide ? obj.animateSlide : '',
        timeTransition = obj.timeTransition ? obj.timeTransition : 2000,
        timeEffect = obj.timeEffect ? obj.timeEffect : 500;


    if(contS && $$(contS).find('li').length === 0){ return; }

    let slide = {
      /** Define o tamanho do container **/
      defineWidthCont: function(){
        let wContS = contS.css('width'),
            calcWidth = wContS * itemsS.length,
            numElem = wContS <= 300 ? 1 : (wContS > 300 && wContS <= 700 ? 2 : (wContS > 700 && wContS <= 1000 ? 3 : 4)),
            wElem = wContS <= 300 ? wContS / 1.3 : (wContS > 300 && wContS <= 700 ? wContS / 2.3 : (wContS > 700 && wContS <= 1000 ? wContS / 3.3 : wContS / 4.3)),
            wMargin = (wContS - (wElem * numElem)) / numElem,
            valMargins = (wMargin / 2);

        itemsS.css({ width: wElem, marginRight: valMargins, marginLeft: valMargins });

        itemsS.map(function(k,v){
          // $$(v).find('img').css({ height: (wElem - 40) });
        });

        // itemsS.first().css({ marginLeft: 0 });
        itemsS.last().css({ marginRight: 0 });
        contIS.css({ width: (calcWidth + (wContS - (wElem * numElem))) + 'px'});

        if(itemsS.length > numElem){

          prevBtn.css({display: 'inline-block'});
          nextBtn.css({display: 'inline-block'});
        } else{

          prevBtn.css({display: 'none'});
          nextBtn.css({display: 'none'});
        }

        /***** Atributos de acesso do objeto ******/
        slide.lengthElems = itemsS.length;
        slide.widthElems = wContS;
        slide.widthLeft = wElem + wMargin;
        slide.numElem = numElem;
        /******************************************/
      },

      /** Ativa o primeiro elemento da fila **/
      activeFirstItemList: function(){

        itemsS.first().setAttr('data-active',true);
        return itemsS.first();
      },

      /** Ativa o próximo elemento da fila **/
      activeNextItemList: function(){

        let elem;
        for(let k = 0; k < itemsS.size(); k++){

          if($$(itemsS[k]).attr('data-active')){
            $$(itemsS[k]).removeAttr('data-active');

            if($$(itemsS[k]).next()[0] !== undefined) {
              $$(itemsS[k]).next().setAttr('data-active', true);
              elem = {elem: $$(itemsS[k]).next(), pos: k};
              break;
            }
          }
        }
        return elem;
      },

      /** Ativa o elemento da seguinte posição **/
      activeItemList: function(pos){

        $$(itemsS[pos]).prevAll().removeAttr('data-active');
        $$(itemsS[pos]).nextAll().removeAttr('data-active');
        $$(itemsS[pos]).setAttr('data-active',true);
        return slide.checkItemCurrent();
      },

      /** Veririca o atual elemento ativo **/
      checkItemCurrent: function(){

        let elem;
        for(let k = 0; k < itemsS.size(); k++){
          if($$(itemsS[k]).attr('data-active')){
            elem = {elem: $$(itemsS[k]), pos: k};
          }
        }
        return elem;
      },

      /** Executa animação automática do slide **/
      runSlide: function(){

        let currentElem = slide.checkItemCurrent().elem,
          posElem = slide.checkItemCurrent().pos,
          lenElem = slide.lengthElems,
          numElem = slide.numElem,
          wLeft = slide.widthLeft,
          posNext = posElem < (lenElem - numElem) ? posElem + 1 : 0,
          calcLeft = $$(currentElem).next()[0] ? (-(posNext * wLeft)) : 0;

        contIS.animate({ left: calcLeft + 'px' },{duration: timeEffect, complete: function(){
          slide.activeItemList(posNext);
        }});
      },

      /** Configurações para acionamento do elemento anterior **/
      prev: function(){

        if(interval){ clearInterval(interval) }

        let currentElem = slide.checkItemCurrent().elem,
          lenElem = slide.lengthElems,
          numElem = slide.numElem,
          wLeft = slide.widthLeft,
          posElem = slide.checkItemCurrent().pos,
          posPrev = posElem > 0 ? (posElem - 1) : (numElem === 4 ? numElem - 2 : lenElem - numElem),
          calcLeft = $$(currentElem).prev()[0] ? (-(wLeft * posPrev)) : (-((lenElem - numElem) * wLeft));

        contIS.animate({ left: calcLeft + 'px' },{duration: timeEffect, complete: function(){
          slide.activeItemList(posPrev);
        }});
        if(interval){ interval = setInterval(slide.runSlide,timeTransition); }
      },

      /** Configurações para acionamento do elemento posterior **/
      next: function(){

        if(interval){ clearInterval(interval) }

        let currentElem = slide.checkItemCurrent().elem,
          posElem = slide.checkItemCurrent().pos,
          lenElem = slide.lengthElems,
          numElem = slide.numElem,
          wLeft = slide.widthLeft,
          posNext = posElem < (lenElem - numElem) ? posElem + 1 : 0,
          calcLeft = $$(currentElem).next()[0] ? (-(posNext * wLeft)) : 0;

        contIS.animate({ left: calcLeft + 'px' },{duration: timeEffect, complete: function(){
          slide.activeItemList(posNext);
        }});

        if(interval){ interval = setInterval(slide.runSlide,timeTransition); }
      },

      /** Para o intervalo de transição do slide ao passar o mouse sobre o elemento **/
      mouseenterStopSlide: function(){

        if(interval){ clearInterval(interval) }
      },

      /** Recomeça o intervalo de transição do slide ao tirar o mouse do elemento **/
      mouseleaveRunSlide: function(){

        if(interval){ interval = setInterval(slide.runSlide,timeTransition); }
      }
    };

    slide.defineWidthCont();
    slide.activeFirstItemList();

    prevBtn.click(slide.prev);
    nextBtn.click(slide.next);

    itemsS.on('mouseenter',slide.mouseenterStopSlide);
    itemsS.on('mouseleave',slide.mouseleaveRunSlide);

    /** chama novamente o método de redimencionamento **/
    $$(window).resize(slide.defineWidthCont);

    let interval;
    if(animateS === 'enable'){
      interval = setInterval(slide.runSlide,timeTransition);
    } else if(animateS === 'disable'){
      if(interval){
        clearInterval(interval);
      }
    }
  },

  rating: function(contRating){

  contRating.map(function(k,v){

    let per = $$(v).attr('data-rating'),
      numStars = per <= 20 ? 1 : ( per <= 40 ? 2 : ( per <= 60 ? 3 : ( per <= 80 ? 4 : ( per <= 100 ? 5 : ''))));

    // NUMBER OF STARS = 5;
    for(let c = 0; c <= 4; c++){

      if(c < numStars){

        let tag = $$('<span>');
        tag.className = 'fa fa-star';
        $$(tag).append(contRating[k]);

      } else{

        let tag = $$('<span>');
        tag.className = 'fa fa-star-o';
        $$(tag).append(contRating[k]);

      }

    }

  });

},


  validateNumberField: function(field){

    if(!field){

      console.log("Field can't be null");
      return false;
    }

    $$(field).on("keypress",function(evt){
      if(evt.keyCode >= 48 && evt.keyCode <= 57 || evt.keyCode === 46){

        if( evt.keyCode === 46 && $$(this).val().trim().length === 0){

          evt.preventDefault();
        }
      }else{

        evt.preventDefault();
      }
    });
  },

  priceFormat: function(v){


    if(!v || !v.trim()){

      return 0;
    }

    let value = v+"";
    let integer = value.split('.')[0];
    let decimal = value.split('.')[1];


    if(value > 999.99) {
      let slice1 = integer.substring(integer.length - 3, 0);
      let slice2 = integer.substring(integer.length, integer.length - 3);

      integer = slice1+'.'+slice2;
    }

    value = integer + "," + ( decimal ? decimal : '00');
    return value;
  }

};

window.class.Utilities = new Utilitie();
window.Utilities = window.class.Utilities;

