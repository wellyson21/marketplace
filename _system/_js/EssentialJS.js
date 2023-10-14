/**
 * Created by Developer on 20/04/2017.
 */

/***construtor *********************************************************************************************************
 * @param selector
 * @param props
 * @returns Objeto com o[s] elemento[s] selecionados
 * @constructor
 */


function EsCode(selector,props,t){

  let element =  typeof selector === 'string' ?/\<[a-z0-9]+\>/i.exec(selector) : false;

  /*verifica o tipo de seletor para aplicar a devida solução*/
  if(element){

    let tag = element.toString().slice(1,this.size() - 1),self = this;
    this.selector = document.createElement(tag);

    if(props){
      $$(props).map(function(k,v){
        if(k === 'class'){
          $$(self.selector).addClass(v)
        }
        else{
          self.selector[k] = v;
        }
      });
    }
    return this.selector;

  } else if(typeof selector === 'string'){

    let query, obj = Object.create({});
    query = document.querySelectorAll(selector);
    for(let a in query){if(query.hasOwnProperty(a)){obj[a] = query[a];}}
    this.selector = obj;

    obj.__proto__ = EsCode.prototype;

    Object.defineProperty(obj,'currentSelector',{value: selector,configurable: true});

    return this.selector;

  }else if(typeof selector === 'object') {

    this.selector = selector ? selector : '';
    let obj = Object.create({});
    obj.__proto__ = EsCode.prototype;

    let length = obj.size(this.selector);

    if(t){}

    if(length && this.selector instanceof  HTMLElement === false && this.selector instanceof Window === false && this.selector instanceof Document === false) {
      for (let i in this.selector) {if (this.selector.hasOwnProperty(i)) {obj[i] = this.selector[i];}}
    } else{

      if(length === undefined){

        obj[0] = this.selector;
      }
    }

    if(selector){
      let selectorName = this.selector instanceof HTMLElement ? selector.tagName :(this.selector instanceof Window || this.selector instanceof Document) ? selector.constructor.name : selector.currentSelector;
      if(selectorName){

        Object.defineProperty(obj,'currentSelector',{value:  selectorName,configurable: true});
      }
    }
    return obj;

  }


  if(typeof selector === 'function'){

    document.addEventListener('DOMContentLoaded',function(){selector();});
    this.selector = selector;
    let obj = Object.create({});
    obj.__proto__ = EsCode.prototype;
    obj[0] = this.selector;
    return obj;

  }

}

/*** Prototipo *********************************************************************************************************
 * @description Objeto contendo todos os metodos e propiedades da classe
 */
EsCode.prototype = {
  constructor: EsCode,

  addClass: function(Class){
    let newClassName = typeof Class === 'string' ? Class : '';

    for(let a in this){
      if(this.hasOwnProperty(a)){
        let elem = $$(this[a]);
        if(!elem.hasClass(newClassName)){
          this[a].classList.add(newClassName);
        }
      }
    }

    return this;
  },
  append: function(element,t){

    try {$$(element)[0].appendChild(this[0]);}catch (e){}
    return this;

  },
  ajax: function(settings){

    if(typeof settings !== 'object'){throw TypeError('O argumento deve ser um objeto.')}

    let xhr = new XMLHttpRequest(),
      url = settings.url,
      type = settings.type ? settings.type.toUpperCase() : 'GET',
      data = settings.data ? settings.data : null,
      adp = settings.addProps ? settings.addProps : false,
      success = settings.success ? settings.success : function(){},
      errorr = settings.error ? settings.error : function(){},
      complete = settings.complete ? settings.complete : function(){},
      beforeSend = settings.beforeSend ? settings.beforeSend : function(){},
      progess = settings.progress ? settings.progress : function(){},
      formD = settings.formData && typeof settings.formData !== 'function' && settings.formData !== undefined ? settings.formData : false,
      headers = settings.headers ? settings.headers.split(',') : false,
      cache = settings.cache === true ? 'public' :(settings.cache === false) ? 'no-cache' : null;


    if(type === "GET" && typeof data === "object"){


      if(url.indexOf("?") !== -1){

        url+= "&"+typeof data === 'object' ? $$(data).urlEncode() : data;
      }else{

        if(url[url.length - 1] === "/"){

          url = url.substring(0,url.length-1);
          url+= typeof data === 'object' ? "?"+$$(data).urlEncode() : data;
        }else{

          url+= typeof data === 'object' ? "?"+$$(data).urlEncode() : data;
        }
      }

      data = null;
    }

    xhr.open(type,url);

    if(headers){$$(headers).map(function(k,v){xhr.setRequestHeader(k,v);});}
    if(cache === 'public'){xhr.setRequestHeader('Cache-control','public');}else{xhr.setRequestHeader('Cache-Control','no-cache');}

    if(formD){

      if((data instanceof HTMLElement)){

        data = new FormData(data);

      }else if(!(data instanceof FormData) && typeof data === 'object'){

        let d = data;
        data = new FormData();
        $$(d).map(function(k,v){data.append(k,v);});

      }

      if(!(data instanceof FormData)){return'';}

      if(adp){$$(adp).map(function(k,v){data.append(k,v);});}
      xhr.setRequestHeader('Content-Disposition','form-data');

    }else{

      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      data = typeof data === 'object' ? $$(data).urlEncode() : data;

    }

    xhr.send(data);

    xhr.onprogress = function(event){progess(event);};
    xhr.error = function(event){errorr(event);};

    beforeSend();
    xhr.onreadystatechange = function(){

      if(xhr.readyState <= 2){}
      if(xhr.readyState === 4 && xhr.status === 200){success(xhr.responseText);}
      if(xhr.readyState === 4){complete(xhr);

        data = null;
        xhr = null;
      }

    };


  },
  after: function(element){

    $$(element).parent()[0].insertBefore(this[0],$$(element).next()[0]);
    return this;

  },
  attr(attr,val){

    if(attr && val !== undefined){

      this.map(function(k,v){
        v.setAttribute(attr,val);

        let trdm = typeof Event === 'function' ? new CustomEvent("datasetchange",{detail: {property: {name: attr,value: val},target:v}})
          : document.createEvent('CustomEvent');

        if(typeof Event !== 'function'){trdm.initCustomEvent('datasetchange',false,false,{property: {name: attr,value: val},target:v});}

        document.dispatchEvent(trdm);
      });
      return this;
    }else if(attr && val === undefined){
      try{
        return this[0].getAttribute(attr);
      } catch(e){}
    }

  },
  add: function(selection){

    let obj = $$(this.currentSelector+' '+selection);
    Object.defineProperty(obj,'currentSelector',{value: this.currentSelector+' '+selection,configurable: true});
    return obj;

  },
  animate: function(objStyleProp,objSetting){

    objSetting = objSetting ? objSetting : {};
    objSetting.duration = objSetting.duration ? objSetting.duration / 1000 : .5;
    objSetting.complete = objSetting.complete ? objSetting.complete : function(){};

    let delay = this.essentialAnimateObj ? (this.essentialAnimateObj.animateDelay) : false,
      self = this,
      count = 0;

    window.essentialAnimateObj = window.essentialAnimateObj ? window.essentialAnimateObj : {};

    for (let a in this) {
      if (this.hasOwnProperty(a)){

        let elem = $$(this[a]);
        if(delay){

          setTimeout(function(){
            executeAnimation();
          },delay + (objSetting.duration * 1000));

        }else{

          executeAnimation();
        }
        function executeAnimation(){

          if(!elem.__proto__.essentialAnimateObj){
            elem.__proto__.essentialAnimateObj = {};
          }

          if(!elem.__proto__.essentialAnimateObj.animateHideStyleObj){elem.__proto__.essentialAnimateObj.animateHideStyleObj = {overflow: {x: elem.css('overflowX'),y: elem.css('overflowY')}};}

          $$(objStyleProp).map(function(k,v){
            if(!/hide|show/i.test(k)){

              let isAuto;
              if(/top|right|bottom|left/i.test(k)){
                isAuto = elem.css(k);
                elem.css(k,isAuto);
                elem.css(k)
              }

              let styleObj = {
                transition: objSetting.duration+'s',
              };
              styleObj[k] = v;
              elem.css(styleObj);

              if(/scrolltop/i.test(k)){

                count++;
                animateScroll(objSetting.duration,v);
              }else{

                if(isNaN(parseInt(v))){

                  return false;
                }
              }
            }
          });

          function animateScroll(time,value) {


            if(count > 1){return;}

            let elem_a = elem[0];

            time = time * 1000;
            let is_window = elem_a.tagName.toLowerCase() === "body" || elem_a.tagName.toLowerCase() === "html",
              to = value.toString().toLowerCase() === "top" ? 0 : (value.toString().toLowerCase() === "bottom" && is_window) ? elem_a.scrollHeight - $$(document).height() : (value.toString().toLowerCase() === "bottom" && !is_window) ? elem_a.scrollHeight - $$(elem_a)[0].clientHeight : value,
              current_top = is_window ? $$(window).scrollTop() : $$(elem_a).scrollTop(),
              dir = current_top - to < 0 ? 'bottom' : 'top',
              rest = dir === 'top' ? current_top - to : to - current_top,
              delta;

            let start_scroll = window.essentialAnimateObj.suave_scroll,
              in_execution = window.essentialAnimateObj.suave_scroll_started;


            if (in_execution) {
              return false;
            }

            window.essentialAnimateObj.suave_scroll_started = true;

            if($$.browser() === "edge"){

              delta = dir === 'top' ? -(rest * Math.PI / (time / (3 * Math.PI))) : (rest * Math.PI / (time / (3 * Math.PI)));
            }else{

              delta = dir === 'top' ? -(rest * Math.PI / (time / (Math.PI))) : (rest * Math.PI / (time / (Math.PI)));
              // delta = dir === 'top' ? -(rest / time * (Math.log(rest))) : (rest / time / Math.log(time));
            }



            let d = dir === 'top' ? -Math.log(rest) : Math.log(rest);


            let interval = setInterval(f_interval, 0);

            // console.log(is_window,delta);

            // return;

            function f_interval() {

              let c_scroll = is_window ? $$(window).scrollTop() : $$(elem_a).scrollTop();

              if(is_window){

                window.scrollTo(0,c_scroll + delta);
              }else{

                elem_a.scrollTop = c_scroll + delta;
              }

              let rc_scroll = is_window ? $$(window).scrollTop() : $$(elem_a).scrollTop();

              if(rc_scroll === c_scroll * 1){

                if(is_window){

                  window.scrollTo(0,c_scroll + 1);
                }else {
                  elem_a.scrollTop = c_scroll + 1;
                }
              }

              if (dir === 'top' && rc_scroll <= to) {

                current_top = null;
                dir = null;
                rest = null;
                delta = null;
                to = null;
                time = null;
                value = null;
                interval = clearInterval(interval);
                objStyleProp = null;
                window.essentialAnimateObj.suave_scroll = true;
                window.essentialAnimateObj.suave_scroll_started = false;

              } else if (dir === 'bottom' && rc_scroll >= to) {

                current_top = null;
                dir = null;
                rest = null;
                delta = null;
                to = null;
                time = null;
                value = null;
                interval = clearInterval(interval);
                objStyleProp = null;
                window.essentialAnimateObj.suave_scroll = true;
                window.essentialAnimateObj.suave_scroll_started = false;

              }
            }
          }

          if(objStyleProp.width === 'hide'){

            elem.__proto__.essentialAnimateObj.animateHideStyleObj.width =  elem.css('width');
            elem.css({width: 0,transition: objSetting.duration,overflow: 'hidden'});
          }

          if(objStyleProp.height === 'hide'){

            elem.__proto__.essentialAnimateObj.animateHideStyleObj.height = elem.css('height');
            elem.css({height: 0,transition: objSetting.duration,overflow: 'hidden'});
          }

          if(objStyleProp.width === 'show'){

            elem.css({width: elem.essentialAnimateObj.animateHideStyleObj.width +'px',transition: objSetting.duration,overflowX: elem.essentialAnimateObj.animateHideStyleObj.overflow.x,overflowY: elem.essentialAnimateObj.animateHideStyleObj.overflow.y});
          }

          if(objStyleProp.height === 'show'){

            elem.css({height: elem.essentialAnimateObj.animateHideStyleObj.height + 'px',transition: objSetting.duration,overflowX: elem.essentialAnimateObj.animateHideStyleObj.overflow.x,overflowY: elem.essentialAnimateObj.animateHideStyleObj.overflow.y});
          }

          setTimeout(function(){
            objSetting.complete();
          },objSetting.duration * 1000);
        }
      }
    }

    return this;
  },

  before: function(element){

    $$(element).parent()[0].insertBefore(this[0],$$(element)[0]);
    return this;

  },
  browser: function(){

    let user = navigator.userAgent.toLowerCase(),
      msie_mozzila = /(mozilla)(?:.*? rv:([\w.]+))?/.exec(user),
      opera_google = /(webkit)[ \/]([\w.]+)/.exec(user),
      edge = /edge/i.exec(user);

    if (msie_mozzila[msie_mozzila.length - 1] * 1 < 14)return ('msie');
    else if (msie_mozzila[msie_mozzila.length - 1] * 1 > 12)return ('mozilla');
    else if(opera_google[1] === 'webkit' && edge === null)return ('webkit');
    else if(edge === 'edge')return 'edge';
    return '';

  },

  css(style,value,t){

    let propUM = ['top','right','bottom','left','height','width','margin-top','margintop','margin-right','marginright','margin-left','marginleft','margin-bottom','marginbottom','padding-top','paddingtop','padding-right','paddingright','padding-bottom','paddingbottom','padding-left','paddingleft',"minheight","minwidth","maxheight","maxwidth","min-height","min-width","max-height","max-width"];


    if(style && value !== undefined && typeof style === 'string' && typeof value === 'string' || style && value !== undefined && typeof style === 'string' && typeof value === 'number'){

      this.map(function(k,ele){
        let p = style.split('-');

        if($$(propUM).inArray(style.toLowerCase()) && typeof parseInt(value) === 'number'){value = parseInt(value);value+="px"}

        if(p.length === 2){

          ele.style[p[0]+p[1][0].toUpperCase()+p[1].slice(1)] = value;
        }else{

          ele.style[p[0]] = value;
        }
      });

    }else if(style && typeof style === 'object'){

      let self = this;
      style = $$(style);

      self.map(function(k,ele) {
        style.map(function (prop, value) {
          let p = (prop.split('-'));

          if($$(propUM).inArray(prop.toLowerCase()) && typeof value === 'number'){value = value+='px';}

          if(p.length === 2){
            ele.style[p[0]+p[1][0].toUpperCase()+p[1].slice(1)] = value;
          }else{

            ele.style[p[0]] = value;
          }
        });
      });

    }else if(style && typeof style === 'string'){

      let SC = window.getComputedStyle(this.pos(0),'')[style],
        xy = ['backgroundPosition','background-position','backgroundSize','background-size'];

      if(SC === undefined){return '';}

      if(xy.indexOf(style) !== -1){
        let posArr = (SC.split(' '));
        return {x: posArr[0],y: posArr[1]}
      }

      if(/box-shadow|text-shadow|boxShadow|textShadow/.exec(style)){
        let s = SC.slice(SC.indexOf(')')+1);
        s = s.split(' ');
        if(s.length > 1){
          $$(s).map(function(k,v){if(!v) {s = $$(s).unset(k);}});
          return s;
        }else{
          return {'0': '0px','1': '0px','2': '0px','3':'0px'}
        }
      }

      if(SC === 'auto' && style.toLowerCase() === 'cursor'){return SC;}

      SC = SC === 'auto' ? 0 :(isNaN(parseInt(SC))) ? SC :(value === true) ? SC : parseInt(SC);

      return SC;

    }

    return this;
  },
  change: function(callback){

    this.map(function(k,v){v.onchange = callback;});
    return this;

  },
  childs: function(){

    let childs = $$({});
    for(let i = 0,j = 0,fchild = this[0].childNodes;i < fchild.length;i++) {if(fchild[i].nodeType === 1 && fchild[i]){childs[j] = fchild[i];j++;}}
    return childs;

  },
  click: function(callback){

    this.map(function(k,v){v.onclick = callback;});
    return this;

  },

  encode: function(){

    return JSON.stringify(this);

  },

  decode: function(json){

    return JSON.parse(json);

  },
  delay: function(time){

    time = typeof time === 'number' ? time : 500;

    if(!this.__proto__.essentialAnimateObj){
      this.__proto__.essentialAnimateObj = {};
    }
    this.__proto__.essentialAnimateObj.animateDelay = time;
    return this;

  },

  find: function(element,t){

    return $$(this[0].querySelectorAll(element),null,t);

  },
  first: function(){

    let obj = $$({});
    obj[0] = this[0];
    return obj;

  },
  firstChild: function(){

    let obj = $$({});
    obj[0] = this[0].firstChild;
    return obj;

  },
  firstELementChild: function(){

    let obj = $$({});
    obj[0] = this[0].firstElementChild;
    return obj;

  },
  fadeIn: function(time,handler,style){

    time = typeof time === 'number' ? time : 500;
    let timeEffect = time / 1000,
      delay = this.essentialAnimateObj ? (this.essentialAnimateObj.animateDelay) : false;

    style = typeof style === 'object' ? style : {display: 'block',opacity: 0};

    for(let a in this){
      if(this.hasOwnProperty(a)){
        let elem = $$(this[a]);

        if(delay){

          setTimeout(function(){executeAnimation();},delay + time);
        }else{

          executeAnimation();
        }

        function executeAnimation(){
          if(elem.css('display') === 'none' || elem.css('opacity') < 1){
            elem.css(style);

            setTimeout(function(){elem.css({opacity: 1, transition: 'opacity '+timeEffect + 's'});},100);
            if(typeof handler === 'function'){ setTimeout(handler,time); }
          }
        }

      }
    }
    this.delay(0);
    return this;

  },
  fadeOut: function(time,handler){

    time = typeof time === 'number' ? time : 500;
    let self = this,
      delay = self.essentialAnimateObj ? (self.essentialAnimateObj.animateDelay) : false,
      timeEffect = time / 1000;

    for(let a in self){
      if(self.hasOwnProperty(a)){
        let elem = $$(self[a]);
        if(delay){

          setTimeout(function(){
            executeAnimation();
          },delay + time);
        }else{

          executeAnimation();
        }

        function executeAnimation(){
          elem.css({opacity: 0, transition: 'opacity '+timeEffect + 's'});
          setTimeout(function(){elem.css({display: 'none'})},time);
          if(typeof handler === 'function'){ setTimeout(handler,timeEffect * 1000); }
        }

      }
    }
    this.delay(0);
    return this;

  },
  fadeToggle: function(time,handler){

    let timeEffect = typeof time === 'number' ? time / 1000 : 500 / 1000,
      delay = this.essentialAnimateObj ? (this.essentialAnimateObj.animateDelay) : false;


    for(let a in this){
      if(this.hasOwnProperty(a)){
        let elem = $$(this[a]);

        if(delay){

          setTimeout(function(){
            executeAnimation();
          },delay + (timeEffect * 1000));

        }else{

          executeAnimation();
        }

        function executeAnimation(){
          if(elem.css('opacity') === 0 || elem.css('display') === 'none'){
            elem.css({display: 'block'});
            setTimeout(function(){elem.css({opacity: 1, transition: 'opacity '+timeEffect + 's'});},100);
          } else{
            elem.css({opacity: 0, transition: 'opacity '+timeEffect + 's'});
            setTimeout(function(){elem.css({display: 'none'})},time);
          }
          if(typeof handler === 'function'){ setTimeout(handler,timeEffect * 1000); }
        }

      }
    }
    return this;

  },
  formData: function(obj){

    let FD = new FormData;
    if(obj){$$(obj).map(function(k,v){FD.append(k,v);});}
    return FD;

  },

  width: function(t){

    if(t){

      console.log(this);
    }

    return this[0] instanceof Window ? window.innerWidth :(this[0] instanceof Document) ? document.documentElement.clientWidth : this[0].getBoundingClientRect().width;

  },
  height: function(){

    return this[0] instanceof Window ? window.innerHeight :(this[0] instanceof Document) ? document.documentElement.clientHeight : this[0].clientHeight;

  },
  outerHeight: function(){

    return this[0] instanceof Window ? window.innerHeight :(this[0] instanceof Document) ? document.documentElement.clientHeight : this[0].scrollHeight;

  },
  position: function(){

    let cr = this[0].getBoundingClientRect();
    return {top: cr.top,bottom: cr.bottom,left: cr.left,right: cr.right};

  },

  hasClass: function(Class){

    let hasClassName = typeof Class === 'string' ? Class : '', val = undefined;

    if(this[0]){

      val = this[0].classList.contains(hasClassName);
      return val;
    }


  },
  hover: function(a,b){

    function f1(evt){

      a(evt,this);
      $$(this).off('mouseenter',f1).on('mouseout',f2);
    }

    function f2(evt){

      b(evt,this);
      $$(this).off('mouseout',f2).on('mouseenter',f1);
    }

    this.on('mouseenter',f1);

  },


  inArray: function(value,index,arra){

    let array = arra ? arra : this;

    if(array.size() > 0){
      let x = $$(array).map(function(k,v){
        if(value === v && !index){return true;}
        if(value === v && index){
          return k;
        }
      });

      if(typeof x === "boolean" || typeof x === 'number'){
        return x;
      }else{
        return false;
      }
    }
    return false;
  },
  isMobile: function(){

    let userAgent = navigator.userAgent.toLowerCase();
    return (userAgent.search(/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i) !== -1) ? !0 : !1;

  },
  isFilled: function(any){

    let returnValue = this.size() > 0 ? this.map(function(k,v){
      if(any){

        if(v){return true;}
      }else{

        if(!v){return false;}
      }
    }) : false;


    if(typeof returnValue === 'boolean'){

      return returnValue;
    }else{

      return true;
    }

  },

  last: function(){

    let obj = $$({});
    obj[0] = this[this.size() - 1];
    return obj;

  },
  lastChild: function(){

    let obj = $$({});
    obj[0] = this[0].lastChild;
    return obj;

  },
  lastElementChild: function(){

    let obj = $$({});
    obj[0] = this[0].lastElementChild;
    return obj;

  },
  get length(){

    let length = 0,  self = this;
    for (let i in self){
      if(self.hasOwnProperty(i) && !(self instanceof HTMLElement) && !(self instanceof HTMLDocument) && !(self instanceof Window) && !(self instanceof Document)){
        length++;
      }
    }

    return length;

  },

  map(callback,context) {

    if(typeof callback !== 'function'){return;}
    let cb, rbc, self = context ? context : this;
    for (let i in self) {
      if (self.hasOwnProperty(i)) {

        let k = isNaN(i * 1) ? i : parseInt(i);
        cb = callback(k, self[i]);
        rbc = cb ? cb :(cb === undefined) ? undefined : false;
        if(rbc !== undefined){break;}
      }
    }
    if(rbc === undefined){return this;}
    else{return typeof rbc === 'string' && typeof (rbc * 1) === 'number' ? rbc * 1 : rbc;}

  },
  merge: function(obj){

    let self = this;
    $$(obj).map(function(k,v){
      if(isNaN(k * 1)){

        self[k] = v;
      }else{

        self.push(v);
      }
    });
    return self;

  },

  nextAll: function(){

    let obj = $$({});
    if(this[0]) {
      for (let siblings = this[0].nextElementSibling, i = 0; siblings != null; siblings = siblings.nextElementSibling, i++) {
        obj[i] = siblings;
      }
    }
    return obj;

  },
  next: function(){

    let obj = $$({});
    if(this[0].nextElementSibling) {
      obj[0] = this[0].nextElementSibling;
    }
    return obj;

  },
  not: function(ele){

    ele = ele.trim();
    let obj = $$({}),
      delIndex = [],
      i = 0;

    ele = ele[0] === '.' ? ['class',ele.slice(1)] :(ele[0] === '#') ? ['id',ele.slice(1)] : ['tag',ele];


    this.map(function(k,v){
      if(ele[0] === 'class'){
        if($$(v).hasClass(ele[1])){
          delIndex.push(k);
        }
      }else if(ele[0] === 'id'){
        if($$(v).attr('id') === ele[1]){
          delIndex.push(k);
        }
      }else if(ele[0] === 'tag'){
        if(v.nodeName.toLowerCase() === ele[1].toLowerCase()){
          delIndex.push(k);
        }
      }
    });

    this.map(function(k,v){if(!$$(delIndex).inArray(k)){obj[i] = v;i++;}});

    return obj;

  },

  on(event, callback,cap,data,t) {

    callback.data = data;
    event = event.trim().toLowerCase();

    cap = cap ? !0 : !1;
    if (!event && !callback) {throw 'Erro: Número de argumentos inválidos.';}

    try {
      this.map(function (k, v) {
        v.addEventListener(event, callback,cap);
      });
    }
    catch (e){throw 'Erro: não foi possível vincular o evento: '+event+ ' ao[s] elemento[s]:'+this;}
    return this;

  },
  off(event, callback) {

    if (!event && !callback) {throw 'Erro: Número de argumentos inválidos.';}
    this.map(function(k,v){
      v.removeEventListener(event, callback,true);
      v.removeEventListener(event, callback,false);
    });
    return this;

  },
  optionIsEqual: function(value,callback,lw,rs,t){

    this.map(function(k,v){
      if(lw){
        value = rs && value[0] === "'" || value[0] === '"' ? value.slice(1,value.length-1) : value;
        if($$(v).val().toLowerCase() === value.toLowerCase()){callback(parseInt(k),v);}
      }else{
        value = rs && value[0] === "'" || value[0] === '"' ? value.slice(1,value.length-1) : value;
        if($$(v).val() === value){callback(parseInt(k),v);}
      }
    });
    return this;

  },

  prev: function(){

    let obj = $$({});

    if(this[0].previousElementSibling){
      obj[0] = this[0].previousElementSibling;
    }
    return obj;

  },
  prevAll: function(){

    let obj = $$({});

    if(this[0]) {
      for (let siblings = this[0].previousElementSibling, i = 0; siblings != null; siblings = siblings.previousElementSibling, i++) {
        obj[i] = siblings;
      }
    }
    return obj;

  },
  parent: function(){

    let obj = $$({}),it;
    if(this[0].parentElement && this[0].parentElement.nodeType === 1){obj[0] = this[0].parentElement;}
    return obj;

  },
  parents: function(tag,ini,t){

    let obj = $$({}),it,parent = this[0].parentElement,i = 0, condName;
    tag = tag ? tag : '';

    if(tag[0] === '.' || tag[0] === '#'){
      try {

        let hasParent = $$(parent).length;

        while(hasParent){
          condName = tag[0] === '.' && $$(parent).attr('class')? [$$(parent).attr('class').indexOf(tag.slice(1)),'class'] : (tag[0] === '#' && $$(parent).attr('id')) ? [$$(parent).attr('id').indexOf(tag.slice(1)),'id'] : [parent.nodeName.toLowerCase(),'tag'];

          if(condName[1] === 'class' && condName[0] !== -1){

            obj[i] = parent;it = true;i++;
            // break;
          }else if(condName[1] === 'id' && condName[0] !== -1){

            obj[i] = parent;it = true;i++;
            // break;
          }else if(condName[0] !== -1 && !/^.|^#/i.test(tag[0])){

            obj[i] = parent;it = true;i++;
          }

          parent = parent.parentElement;
          hasParent = $$(parent).size();
        }


      }catch (e){}

    }else if(tag){

      if(parent.nodeName.toLowerCase() === tag){

        obj[0] = parent;
      }

      for(parent,i = 0;parent.nodeName && parent.nodeName.toLowerCase() !== tag || !tag && parent && parent.nodeType === 1;parent = parent.parentElement,i++){

        if(parent.nodeName.toLowerCase() === '#document'){continue;}

        if(tag && parent.parentElement.nodeName.toLowerCase() === tag.toLowerCase()){obj[0] = parent.parentElement;}
        else if(!tag){obj[i] = parent;}
        it = true;
      }

    }else if(ini){
      if(ini){
        try {
          while(parent){
            condName = ini[0] === '.' ? [$$(parent).attr('class') ? $$(parent).attr('class') : '','class'] : (ini[0] === '#') ? [$$(parent).attr('id'),'id'] : parent.nodeName.toLowerCase();
            if(condName[1] === 'class'){
              let cd = condName[0].toLowerCase();
              if(condName[0] && cd.indexOf(ini.toLowerCase().slice(1)) !== -1){break;}
              obj[i] = parent;it = true;i++;
              parent = parent.parentElement;
            }
          }
        }catch (e){}
      }
      return obj;
    }else{


      if(!it && this[0].parentElement && this[0].parentElement.nodeType === 1){
        let count = 0;
        while(parent && parent.tagName.toLowerCase() !== 'html'){
          obj[count] = parent;
          parent = parent.parentElement;
          count++;
        }
      }
    }

    return obj;

  },
  prepend: function(element){

    $$(element)[0].insertBefore(this[0],$$(element)[0].firstElementChild);
    return this;

  },
  parse: function(data){

    return JSON.parse(data);

  },
  pos(k){

    return this[k];

  },
  push: function(v){

    this[this.size()] = v;
    return this;

  },

  removeClass: function(Class){

    let delClassName = typeof Class === 'string' ? Class : '';
    for(let a in this){
      if(this.hasOwnProperty(a)){
        let elem = $$(this[a]);
        if(elem.hasClass(delClassName)){
          this[a].classList.remove(delClassName);
        }
      }
    }
    return this;

  },
  removeAttr: function(attr){

    this.map(function(k,v){v.removeAttribute(attr);});
    return this;

  },
  resMonitor: function(data){

    if(!data.if){return;}

    data.assertOK = 0;
    data.assertOK2 = 0;

    let ml = data.operator.length === 2 && data.operator[0] === '<' && data.operator[1] === '>' ? true : false, operator = data.operator ? data.operator : '==', xy = data.x1 ? 'width' :(data.y1) ? 'height' : false;

    if(xy === 'width'){
      setInterval(function(){
        let windowX = $$(document).width();
        let x1 = data.x1,x2 = data.x2;
        if(operator === '==' || operator === '==='){if(windowX == data.x1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0;}else{data.assertOK = 0}}}
        if(operator === '>'){if(windowX > data.x1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(operator === '<'){if(windowX < data.x1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(operator === '<='){if(windowX <= data.x1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(operator === '>='){if(windowX >= data.x1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(ml){ if(windowX > data.x1 && windowX < data.x2){ data.assertOK++;data.if();data.assertOK2 = 0; }else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}} }
      },0)
    }else if(xy === 'height'){


      setInterval(function(){
        let windowY = $$(document).height();
        let y1 = data.y1,y2 = data.y2;
        if(operator === '==' || operator === '==='){if(windowY === data.y1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0;}else{data.assertOK = 0}}}
        if(operator === '>'){if(windowY > data.y1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(operator === '<'){if(windowY < data.y1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(operator === '<='){if(windowY <= data.y1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(operator === '>='){if(windowY >= data.y1){data.assertOK++;data.if();data.assertOK2 = 0;}else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}}}
        if(ml){ if(windowY > data.y1 && windowY < data.y2){ data.assertOK++;data.if();data.assertOK2 = 0; }else{if(data.else){data.assertOK2++;data.else();data.assertOK = 0}else{data.assertOK = 0}} }
      },0)

    }

  },
  remove: function(t){

    this.map(function(k,v){

      $$(v).parent()[0].removeChild(v);
    });
    return this;

  },
  resize: function(callback){

    this.map(function(k,v){v.onresize = callback;});
    return this;
  },

  scroll: function(callback){

    this.map(function(k,v){v.onscroll = callback;});
    return this;
  },

  scrollMonitor: function(callback){

    let currentScroll = $$(window).scrollTop();
    setInterval(function(){
      let newScrollTop = $$(window).scrollTop();
      if(newScrollTop !== currentScroll){
        currentScroll = newScrollTop;
        callback({scrollTop: currentScroll});
      }
    },0);
    return this;

  },
  scrollTop: function(){

    let scrollTop;
    if(this[0] instanceof Window){

      scrollTop = $$('html').scrollTop() ? $$('html').scrollTop() : $$('body').scrollTop();

    }else{

      scrollTop = this[0].scrollTop;
    }
    return scrollTop;

  },
  scrollLeft: function(){

    return this[0].scrollLeft;

  },
  setAttr: function(name,value){

    this.map(function(k,v){v.setAttribute(name,value);});
    return this;

  },
  settingInput: function(cont,img,width,height){

    cont = cont ? cont : $$('.per-input');
    width = width ? width :(typeof img === 'object') ? 'auto' : 25;
    height = height ? height :(typeof img === 'object') ? 'auto' : 25;
    img = img ? img : ['far fa-square','far fa-check-square'];
    // img = img ? img : ['fa fa-square-o','fa fa-check-square-o'];


    $$(cont).map(function(k,v){

      let inputs = $$(v).find('input[type=radio],input[type=checkbox]'),
        allowedTypes = ['checkbox','radio'],
        dataIconSize = $$(v).attr('data-size') ? $$(v).attr('data-size') : 'fa-1x';

      if(inputs.length > 0){
        $$(inputs).map(function(k,v){

          if($$(v).parents('.per-input').find('.Essential-input-per').size() > inputs.size() - 1){
            return;
          }

          let  tagType = $$(v).attr('type').toLowerCase();
          perCheck(v,tagType,allowedTypes,dataIconSize);
        });
      }

    });

    function perCheck(v,type,allowedTypes,iconSize) {
      let tag;

      $$(v).css('display','none');

      if(typeof img === 'object'){

        tag = $$('<span>');
        tag.className = img[0]+ ' '+iconSize+' Essential-input-per';
        $$(tag).before($$(v));
        $$(v).append($$(tag));
      } else{

        tag = $$('<span>');
        tag.className = 'Essential-input-per';

        $$(tag).css({
          display: 'inline-block',
          width: width+'px',
          height: height+'px',
          padding: 0,
          backgroundSize: '100% 100%',
          background: 'transparent',
          border: '2px ridge black'
        }).before($$(v));

        $$(v).append($$(tag));
      }

      if(type === 'radio'){

        let inputS = $$(tag).find('input[type=radio]');

        $$(tag).click(function(evt){
          evt.stopPropagation();
          c(this);
        });

        if(inputS.length > 0){
          if(inputS[0].checked){

            $$(tag).trigger("click");
          }
        }

        function c(tag){
          let prevAll = $$(tag).prevAll(),
            nextAll = $$(tag).nextAll();

          prevAll.map(function(k,v2){
            let inp = $$(v2).find('input[type=radio]'),
              vtype = inp.length > 0 ? inp.attr('type') : false;

            if(vtype){
              if($$(allowedTypes).inArray(vtype)){
                $$(v2)[0].className = img[0] + ' '+ iconSize + ' Essential-input-per';
              }
            }
          });

          nextAll.map(function(k,v2){
            let inp = $$(v2).find('input[type=radio]'),
              vtype = inp.length > 0 ? inp.attr('type') : false;

            if(vtype){
              if($$(allowedTypes).inArray(vtype)){
                $$(v2)[0].className = img[0] + ' '+ iconSize + ' Essential-input-per';
              }
            }
          });

          if(typeof img === 'object'){

            tag.className = (img[1]+ ' '+iconSize+ ' Essential-input-per');
          } else {
            $$(self).css({
              background: 'transparent url("'+img+'")',
              backgroundSize: '100% 100%'
            });
          }

          if(!v.checked){

            v.checked = 'on';
            $$(v).trigger("change");
          }
        }

      }
      else{
        $$(tag).toggle({
          event: 'click',
          first: function(event,self){

            if(!v.checked){

              v.checked = 'on';
              $$(v).trigger("change");
            }

            if(typeof img === 'object'){

              tag.className = (img[1]) + ' '+iconSize;
            } else {
              $$(self).css({
                background: 'transparent url("'+img+'")',
                backgroundSize: '100% 100%'
              });
            }
          },
          second: function(event,self){

            if(!v.checked){

              v.checked = 'on';
              $$(v).trigger("change");
            }

            if(typeof img === 'object'){

              tag.className = (img[0]);

            } else {
              $$(self).css({
                background: 'transparent',
                backgroundSize: '100% 100%'
              });
            }
          }
        });
      }


    }

  },
  slideUp: function(time,handler,h){

    time = time ? time : 500;
    let timeEffect = time / 1000,
      self = this,
      delay = this.essentialAnimateObj ? (this.essentialAnimateObj.animateDelay) : 0;

    for(let a in this){
      if(this.hasOwnProperty(a)) {
        let elem = $$(this[a]);

        if(delay){

          setTimeout(function(){
            executeAnimation();
          },delay + time);

        }else{
          executeAnimation();
        }

        function executeAnimation(){

          elem.setAttr('data-essentialAnimateObjSlideToggleAlter','slideUp');
          if(elem.css('display') === 'none'){return;}

          if (!elem.attr('data-essentialAnimateObjSlideUpPreviousValues')) {

            elem.setAttr('data-essentialAnimateObjSlideUpPreviousValues',[elem.css('height'), [elem.css('overflowX'), elem.css('overflowX')],elem.css('display'),
              [elem.css('paddingTop'),elem.css('paddingBottom')],
              [elem.css('marginTop'),elem.css('marginBottom')]
            ]);
          } else {

            let obj = elem.attr('data-essentialAnimateObjSlideUpPreviousValues').split(',');
            elem.setAttr('data-essentialAnimateObjSlideUpPreviousValues',[obj[0],[obj[1], obj[2]],obj[3],[obj[4],obj[5],obj[6],obj[7]]]);
          }

          elem.css({height: elem.css('height')});

          elem.animate({
            height: h ? h : 0,
            opacity: h ? h : 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: h ? elem.css('marginTop') : 0,
            marginBottom: h ? elem.css('marginBottom') : 0
          },{
            duration: timeEffect * 1000,
            complete: function(){

              if(!h){
                elem.css('display', 'none')
              }

              if(typeof handler === 'function'){handler();}
            }
          });


        }


      }
    }

    return self;
  },
  slideDown: function(time,handler,h,auto){

    time = time ? time : 500;
    let timeEffect = time / 1000,
      self  = this,
      delay = this.essentialAnimateObj ? (this.essentialAnimateObj.animateDelay) : 0;

    for (let a in this) {
      if (this.hasOwnProperty(a)){

        let elem = $$(this[a]);
        if(delay){

          setTimeout(function(){
            executeAnimation();
          },delay + time);

        }else{
          executeAnimation();
        }

        function executeAnimation(){

          if(elem.css('display') !== 'none'){return;}

          elem.setAttr('data-essentialAnimateObjSlideToggleAlter','slideDown');

          if (!elem.attr('data-essentialAnimateObjSlideUpPreviousValues')){

            let display = elem.css('display') !== 'none' ? elem.display : 'block',timeout;
            elem.css({opacity: 0,transition: '0s',display: display});

            // timeout = clearTimeout(timeout);
            setTimeout(function(){

              let height = h ? h : elem.css('height');
              elem.css({display: 'none',opacity: 0});
              elem.setAttr('data-essentialAnimateObjSlideUpPreviousValues',[ h ? h : height, [elem.css('overflowX'), elem.css('overflowX')],display,
                [elem.css('paddingTop'),elem.css('paddingBottom')],
                [elem.css('marginTop'),elem.css('marginBottom')]
              ]);

            },200);

          } else {

            let obj = elem.attr('data-essentialAnimateObjSlideUpPreviousValues').split(',');
            elem.setAttr('data-essentialAnimateObjSlideUpPreviousValues',[obj[0],[obj[1], obj[2]],obj[3],[obj[4],obj[5],obj[6],obj[7]]]);
          }

          let interval = setInterval(function(){

            if(elem.attr('data-essentialAnimateObjSlideUpPreviousValues')){


              let obj =  elem.attr('data-essentialAnimateObjSlideUpPreviousValues').split(','),
                height = obj[0],
                overflowX = obj[1],
                overflowY = obj[2],
                display = obj[3];


              elem.css({height: 0, display: display, overflow: 'hidden', transition: 0,opacity: 0,paddingTop: 0,paddingBottom: 0,marginTop: 0,marginBottom: 0});

              elem.css({
                overFlowX: overflowX,
                overFlowY: overflowY
              }).animate({
                height: height + 'px',
                opacity: 1,
                transition: timeEffect + 's',
                paddingTop: obj[4]+'px',
                paddingBottom: obj[5]+'px',
                marginTop: obj[6]+'px',
                marginBottom: obj[7]+'px'
              },{
                duration: timeEffect * 1000,
                complete: function(){

                  if(auto){elem.css('height','auto');}

                  if(typeof handler === 'function'){ handler(); }
                }
              });

              clearInterval(interval);
            }

          },10);

        }

      }
    }

    return this;
  },
  slideToggle: function(time,auto){

    time = time ? time : 500;

    let self = this,
      delay = this.essentialAnimateObj ? this.essentialAnimateObj.animateDelay : 0;

    if(delay){

      setTimeout(function(){executeAnimation();},delay)
    }else{

      executeAnimation();
    }

    function executeAnimation(){
      self.map(function(k,v){
        let slideToogleAlter = $$(v).attr('data-essentialAnimateObjSlideToggleAlter');

        if(!slideToogleAlter && $$(self[0]).css('display') === 'none'){

          $$(self).slideDown(time,false,false,auto);
        }else if(!slideToogleAlter && $$(self[0]).css('display') !== 'none'){

          $$(self).slideUp(time);
        }else if(slideToogleAlter === 'slideUp'){

          $$(self).slideDown(time,false,false,auto);
        }else if(slideToogleAlter === 'slideDown'){

          $$(self).slideUp(time);
        }
      });
    }

    return this;
  },

  submit(callback){

    this.map(function(k,v){v.onsubmit = callback;});
    return this;
  },
  serialize: function(str){

    let props = str ? '' : {};
    this.find('input').map(function(k,v){

      if($$(v).attr('type') && /radio|checkbox/i.exec($$(v).attr('type').toLowerCase()) || !$$(v).attr('type')) {
        if(v.checked){
          if (str) {
            props += k !== this.size() - 1 ? v.name + '=' + v.value + '&' : v.name + '=' + v.value + '&';
          } else {
            props[v.name] = v.value;
          }
        }
      }else if(!/button|submit/i.exec($$(v).attr('type').toLowerCase())) {
        if (str) {
          props += k !== this.size() - 1 ? v.name + '=' + v.value + '&' : v.name + '=' + v.value + '&';
        } else {
          props[v.name] = v.value;
        }
      }
    });
    this.find('option').map(function(k,v) {

      if (v.selected) {
        if(str){
          props += k !== props[props.length -1] !== '&'?  $$(v).parent()[0].name + '=' + v.value :(this.size() -1) ? $$(v).parent()[0].name + '=' + v.value + '&': $$(v).parent()[0].name + '=' + v.value;
        }else {
          props[$$(v).parent()[0].name] = v.value;
        }
      }
    });

    this.find('textarea').map(function(k,v) {

      props[v.name] = v.value;
    });
    return props;

  },
  html: function(content){

    if(content === undefined)return this[0].innerHTML;
    let textContent = typeof content === 'string' ? content : '';
    for(let a in this){
      if(this.hasOwnProperty(a)){
        this[a].innerHTML = textContent;
        return this;
      }
    }


  },
  text: function(content){
    let textContent = typeof content === 'string' ? content : false;

    for(let a in this){
      if(this.hasOwnProperty(a)){
        if(textContent !== false){
          this[a].textContent = textContent;
          return this;
        } else if(!textContent){
          return this[a].textContent;
        }
      }
    }

  },
  size: function(obj){

    let length = undefined,
      self = typeof obj === 'object' ? obj : this;
    for (let i in self){
      if(self.hasOwnProperty(i) && !(self instanceof HTMLElement) && !(self instanceof HTMLDocument) && !(self instanceof Window) && !(self instanceof Document) && !(self.activeElement && self.nodeName) && !(self instanceof Text)){

        if(length === undefined){length = 0;}
        length++;
      }
    }

    if(!length && !(self instanceof HTMLElement) && !(self instanceof HTMLDocument) && !(self instanceof Window) && !(self instanceof Document) && !(self.activeElement && self.nodeName) && !(self instanceof Text)){

      length = 0;
    }

    return length;

  },

  toggle: function(obj){

    let element = this, event = obj.event.toLowerCase(), first = obj.first, second = obj.second;
    if(typeof first !== 'function' || typeof second !== 'function' || element.size() < 1){return;}
    this.map(function(k,v){$$(v).on(event,f);});
    function f(evt){evt.stopPropagation();first(evt,this);$$(this).off(event,f).on(event,s);}
    function s(evt){evt.stopPropagation();second(evt,this);$$(this).off(event,s).on(event,f);}
    return this;

  },
  toggleClass: function(Class){
    let newClassName = typeof Class === 'string' ? Class : '';

    for(let a in this){
      if(this.hasOwnProperty(a)){
        this[a].classList.toggle(newClassName);
      }
    }

    return this;
  },



  trigger(event){

    if(!event){return;}

    event = event.trim().toLowerCase();
    let mouseE = ['mouseover','mousemove','mouseenter','mouseleave','mouseout','click','dblclick','mousedown','mouseup'],
      focusE = ['focus','blur','focusin','focusout','change'],
      wheel = ['wheel'],
      keyboard = ['keypress','keyup','keydown'],
      input = ['input','beforeinput','submit'],
      evt;

    if(typeof Event === 'function'){

      if($$(mouseE).inArray(event)){

        evt = new MouseEvent(event,{view: window});
      }else if($$(focusE).inArray(event)){

        evt = new FocusEvent(event);
      }else if($$(wheel).inArray(event)){

        evt = new WheelEvent(event);
      }else if($$(keyboard).inArray(event)){

        evt = new KeyboardEvent(event,{view: window});
      }else if($$(input).inArray(event)){

        evt = new InputEvent(event);
      }else{

        evt = new Event(event);
      }

    }else{

      evt  = document.createEvent("Event");
      evt.initEvent(event,false,false);
    }

    this[0].dispatchEvent(evt);
    return this;

  },
  trim: function(str){
    return str.trim();
  },
  toArray: function(){

    let arr = [];
    this.map(function(k,v){arr.push(v);});
    return arr;

  },

  toObject: function(){
    let obj = {};
    this.map(function(k,v){ obj[k] = v; });
    return obj;
  },

  unset(index,array,isAssoc = false){

    if(isAssoc){

      let arr = {};
      array = array ? $$(array) : this;
      array.map(function(k,v){
        if(index !== k){

          arr[k] = v;
        }
      });
      return $$(arr);
    }else{

      let arr = array ? $$(array) : this,
        arrJ = arr.toArray();

      arrJ = arrJ.filter(function(v,k1){

        return index !== k1;
      });
      return $$(arrJ);
    }
  },

  removeIndex(index,array){



  },

  urlEncode: function(obj){

    obj = obj ? obj : this;

    if(typeof obj === 'object'){
      let str = '';
      for(let k in obj){ if(obj.hasOwnProperty(k)){
        str += k + '=';
        if(typeof obj[k] === 'object'){
          str += $$(obj[k]).encode()+'&';
        }else{
          str += obj[k] +'&';
        }
      } }


      return str.substr(0,str.length-1);
    } else if(typeof obj === 'string'){
      return obj;
    }

  },

  val: function(value){

    if(value || value !== undefined){
      this.map(function(k,v){
        v.value = value;
      });
      return this;
    }else{
      return this[0].value;
    }

  }

};

window.$$ = function(selector,props,t){
  $$.__proto__ = EsCode.prototype;
  return new EsCode(selector,props,t);
};

EsCode.prototype.settingInput();
