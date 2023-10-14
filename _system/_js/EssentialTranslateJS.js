//data-translate indica se um elemento deve ou não ser traduzido. O valor padrão é "true";

$$(function(){

  let
      notAllowed = ["!","-",",",".",";",":","*","\\","+","&","(",")","@","#",'""',"''","'",'"',"|","?","/","[","]","{","}","="],

      baseUrl = $$("#baseUrl").length > 0 ? $$("#baseUrl").text().trim() :($$(".baseUrl").length > 0) ? $$(".baseUrl").text().trim(): urls.baseUrl,
      firstTranslate = 0,
      elements = $$("body *"),
      textElements = [],
      originTextTranslate = [],
      textTranslate = [],
      textTranslated = [],

      originAjaxElements = $$([]),
      ajaxElements = $$([]),
      originAjaxTextTranslate = $$([]),
      ajaxTextTranslate = [],
      ajaxTextTranslated = [],

      ajaxJson,
      currentViewCode = '',

      dataPageInfo,
      self = ETranslate,

      targetMonitor = $$("body")[0],
      observable = new MutationObserver(function(mutations){

        let pushE = [],pushT = [];

        $$(mutations).map(function(km,mutation){

          if($$(mutation.target).hasClass("map") && typeof google.maps.Map === "function"){return;}

          //realize garbage collector in array originAjaxElements e originAjaxTextElement
          $$(mutation.removedNodes).map(function(k,rvp){

            //angular binds
            if(rvp.nodeType === 1 && $$(rvp).hasClass("ng-scope") || rvp.nodeType === 2 && $$(rvp).hasClass("ng-scope")){

              let filterTags = ["SCRIPT","STYLE","ESSENTIALGRIDROW"];

              let PHPCache = function(){

                let viewCode,viewRoot = $$(rvp).parents(".ng-scope");
                if(filterTags.indexOf(rvp.tagName.toUpperCase()) === -1){

                    if($$(rvp).attr('data-viewCode')){

                      viewCode = $$(rvp).attr('data-viewCode');
                    }else {

                      viewRoot = viewRoot.length >= 2 ? $$(viewRoot.pos(viewRoot.length - 2)) : $$(viewRoot.pos(viewRoot.length - 1));
                      viewRoot = $$(rvp).hasClass("ng-scope") ? rvp : viewRoot;
                      viewCode = $$(viewRoot).firstELementChild().attr('data-viewCode');
                    }

                    if(viewCode){

                      originAjaxElements[viewCode] = [];
                      originAjaxTextTranslate[viewCode] = [];
                    }

                  }
              };

              if(ETranslate.cache){

                PHPCache();
              }
            }else if(rvp.nodeType === 1 &&  $$(rvp).attr('data-viewCode') || rvp.nodeType === 2 &&  $$(rvp).attr('data-viewCode')) {
              let allRemovedNodes = $$(rvp).find('*');

              let PHPCache = function() {

                let viewCode = $$(rvp).attr('data-viewCode');

                if(viewCode){

                  originAjaxElements[viewCode] = [];
                  originAjaxTextTranslate[viewCode] = [];
                }
              };


              if(ETranslate.cache){

                PHPCache();
              }
            }
        });

          //set translate by attributes
          if(mutation.type === "attributes"){

            function PHPCache(){

              if(mutation.attributeName === "data-viewcode"){

                let data = {target: mutation.target},
                  elements = $$(data.target).find("*"),
                  viewCode = $$(data.target).attr('data-viewCode')
                ;

                if(!viewCode.trim()){return;}


                $$(elements).map(function(ke,ele){

                  if(ele.firstChild){


                    ele.normalize();
                    for(let child = ele.firstChild;child != null;child = child.nextSibling){

                      let textE = child,textV = child.textContent.trim();

                      if(textE.nodeName === "#text" && textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV)) {

                        if(!$$(ele).attr("data-translate") || $$(ele).attr("data-translate") === "true"){

                          pushE.push(textE);
                          pushT.push(child.textContent);
                        }
                      }
                    }
                  }else if(ele.tagName === "INPUT" || ele.tagName === "TEXTAREA"){

                    let inputsEPL = ["email","text","url"], textV;

                    if(ele.tagName === "INPUT" && inputsEPL.indexOf(ele.type.toLowerCase()) !== -1 || ele.tagName === "TEXTAREA") {

                      textV = $$(ele).attr("placeholder");
                      textV = textV ? textV.trim() : null;
                    }
                    else if(ele.tagName === "INPUT" && ele.type === "button" || ele.tagName === "INPUT" && ele.type === "submit"){

                      textV = $$(ele).val().trim();
                    }

                    if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV) && !$$(ele).attr('data-translate')|| textV && isNaN(textV * 1) && $$(ele).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

                      pushE.push(ele);
                      pushT.push(textV);
                    }

                  }else if(ele.tagName === "BUTTON"){

                    let textV = $$(ele).val() ? $$(ele).val().trim() : "";

                    if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV) && !$$(ele).attr('data-translate')|| textV && isNaN(textV * 1) && $$(ele).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

                      pushE.push(ele);
                      pushT.push(textV);
                    }
                  }
                });

                if(!originAjaxElements[viewCode]){

                  currentViewCode = viewCode;
                  originAjaxElements[viewCode] = [];
                  originAjaxElements[viewCode].push(pushE);
                }else{

                  let dvc = originAjaxElements[viewCode],tmp = [];

                  tmp.push(pushE);
                  $$(dvc).map(function(k,v){tmp.push(v);});
                  originAjaxElements[viewCode] = tmp;
                }

                if(!originAjaxTextTranslate[viewCode]){

                  currentViewCode = viewCode;
                  originAjaxTextTranslate[viewCode] = [];
                  originAjaxTextTranslate[viewCode].push(pushT);
                }else{

                  let dvc = originAjaxTextTranslate[viewCode],tmp = [];

                  tmp.push(pushT);
                  $$(dvc).map(function(k,v){tmp.push(v);});
                  originAjaxTextTranslate[viewCode] = tmp;
                }

                currentViewCode = viewCode;
              }
            }
          }

          //set translate by insertion
          else if (mutation.type ===  "childList") {

            //realize elements collection
            $$(mutation.addedNodes).map(function (k, ele){

              //angular binds
              if (ele.nodeType === 1 && $$(ele).parents(".ng-scope").length || ele.nodeType === 2 && $$(ele).parents(".ng-scope").length) {

                let filterTags = ["SCRIPT", "STYLE", "ESSENTIALGRIDROW"];

                let PHPNoCache = function(){

                  if (filterTags.indexOf(ele.tagName.toUpperCase()) === -1) {

                    let data = setAjaxElementTranslate($$(ele).find("*").push(ele));
                    ETranslate.translateNoCache(ETranslate.from,ETranslate.to,data.text,data.elements);
                  }
                };

                let PHPCache = function(){

                  let viewCode;
                  if (filterTags.indexOf(ele.tagName.toUpperCase()) === -1) {

                    let viewRoot = $$(ele).parents(".ng-scope");
                    viewRoot = $$(viewRoot.pos(viewRoot.length - 2));

                    if($$(ele).hasClass("ng-scope") && $$(ele).attr('data-ng-view') !== null && $$(ele).firstELementChild().length){

                      viewCode = $$(ele).firstELementChild().attr('data-viewCode');
                    }else if($$(ele).attr('data-viewCode') === null){

                      viewCode = viewRoot.length ? viewRoot.firstELementChild().attr('data-viewCode') : null;
                    }else if($$(ele).attr('data-viewCode') !== null){

                      viewCode = $$(ele).attr('data-viewCode');
                    }

                    if (!viewCode) {return;}

                    let allElements = $$(ele).find("*");

                    let rv = setAjaxDataET(allElements, pushE, pushT, viewCode);
                    pushT = rv.pushT;
                    pushE = rv.pushE;
                    rv = null;
                  }
                };

                if(ETranslate.cache){

                  PHPCache();
                }else{

                  PHPNoCache();
                }
              }

              else if (ele.nodeType === 1 || ele.nodeType === 2) {

                $$(ele).attr('data-essential_ajax_translate', true);

                let filterTags = ["SCRIPT", "STYLE", "ESSENTIALGRIDROW"];

                let PHPNoCache = function(){

                  if (filterTags.indexOf(ele.tagName.toUpperCase()) === -1) {

                    let data = setAjaxElementTranslate($$(ele).find("*").push(ele));
                    ETranslate.translateNoCache(ETranslate.from,ETranslate.to,data.text,data.elements);
                  }
                };

                let PHPCache = function(){

                  let viewCode = $$(ele).attr('data-viewCode');
                  if (filterTags.indexOf(ele.tagName.toUpperCase()) === -1 && $$(ele).attr('data-viewCode')) {

                    let allElements = $$(ele).find("*"), rv = setAjaxDataET(allElements, pushE, pushT, viewCode);
                    pushT = rv.pushT;
                    pushE = rv.pushE;
                    rv = null;
                  }
                };

                if(ETranslate.cache){

                  PHPCache();
                }else{

                  PHPNoCache();
                }
              }

              else if (ele.nodeName === "#text") {

                let textV = $$(ele).text().trim();

                let PHPNoCache = function(){

                  if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV)) {

                    ETranslate.translateNoCache(ETranslate.from,ETranslate.to,[textV],[ele]);
                  }
                };

                let PHPCache = function(){

                  let viewCode;
                  if (textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV)) {

                    let parents = $$(ele).parents();

                    $$(parents).map(function (k, v) {

                      viewCode = $$(v).attr('data-viewCode');
                      if (viewCode !== null) {return true;}
                    });

                    if (!viewCode) {return;}


                    if (!originAjaxElements[viewCode]) {

                      originAjaxElements[viewCode] = [];
                    }
                    if (!originAjaxTextTranslate[viewCode]) {

                      originAjaxTextTranslate[viewCode] = [];
                    }

                    currentViewCode = viewCode;
                    pushE.push(ele);
                    pushT.push(textV);
                    originAjaxElements[viewCode].push(pushE);
                    originAjaxTextTranslate[viewCode].push(pushT);

                    if(sessionStorage.getItem("essential_translate") === "true"){

                      sessionStorage.setItem("translate_ajax_update","true");
                      if(!ajaxJson) {

                        self.read({
                          settingCache: true,
                          callback:function(tr,pageInfo){

                            dataPageInfo = pageInfo;
                            ajaxJson = tr;
                          }
                        });
                      }
                    }
                  }
                };

                if(ETranslate.cache){

                  PHPCache();
                }else{

                  PHPNoCache();
                }
              }
            });
          }

        });

        //dispatch ajaxBoot
        function PHPCacheBoot(){

          if(pushT.length && pushE.length){

            if(sessionStorage.getItem("essential_translate") === "true"){

              sessionStorage.setItem("translate_ajax_update","true");
              if(!ajaxJson) {

                self.read({
                  settingCache: true,
                  param: {
                    viewCode: currentViewCode,
                    ajaxPushTIndex: originAjaxTextTranslate[currentViewCode].length - 1,
                    ajaxPushEIndex: originAjaxElements[currentViewCode].length - 1,
                  },
                  callback:function(tr,pageInfo,param){

                    dataPageInfo = pageInfo;
                    ajaxJson = tr;

                    let details = {
                        ajaxPushTIndex: param.ajaxPushTIndex,
                        ajaxPushEIndex: param.ajaxPushEIndex,
                        ajaxJson: ajaxJson.data.ajax,
                        pageInfo: dataPageInfo,
                        viewCode: param.viewCode
                      },
                      trdm = typeof Event === 'function' ? new CustomEvent("essentialTRDM",{detail:details}) : document.createEvent('CustomEvent');

                    if(typeof Event !== 'function'){trdm.initCustomEvent('essentialTRDM',false,false,details);}
                    document.dispatchEvent(trdm);
                  }
                });
              }else{

                let details = {
                    ajaxPushTIndex: originAjaxTextTranslate[currentViewCode].length - 1,
                    ajaxPushEIndex: originAjaxElements[currentViewCode].length - 1,
                    ajaxJson: ajaxJson.data.ajax,
                    pageInfo: dataPageInfo,
                    viewCode: currentViewCode
                  },
                  trdm = typeof Event === 'function' ? new CustomEvent("essentialTRDM",{detail:details}) : document.createEvent('CustomEvent');

                if(typeof Event !== 'function'){trdm.initCustomEvent('essentialTRDM',false,false,details);}
                document.dispatchEvent(trdm);
              }
            }

          }
        }

        if(ETranslate.cache){

          PHPCacheBoot();
        }
     })
  ;



  //Get Ajax elements e Texts PHPNoCache
  function setAjaxElementTranslate(elements){

    let pushE = [],pushT = [];

    $$(elements).map(function(ke,ele){

      if(ele.firstChild){

        ele.normalize();
        for(let child = ele.firstChild;child != null;child = child.nextSibling){

          let textE = child,textV = child.textContent.trim();

          if(textE.nodeName === "#text" && textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV)) {

            if(!$$(ele).attr("data-translate") || $$(ele).attr("data-translate") === "true"){

              pushE.push(textE);
              pushT.push(child.textContent);
            }
          }
        }
      }else if(ele.tagName === "INPUT" || ele.tagName === "TEXTAREA"){

        let inputsEPL = ["email","text","url"], textV;

        if(ele.tagName === "INPUT" && inputsEPL.indexOf(ele.type.toLowerCase()) !== -1 || ele.tagName === "TEXTAREA") {

          textV = $$(ele).attr("placeholder") ? $$(ele).attr("placeholder").trim() : "";
        }
        else if(ele.tagName === "INPUT" && ele.type === "button" || ele.tagName === "INPUT" && ele.type === "submit"){

          textV = $$(ele).val() ? $$(ele).val().trim() : "";
        }

        if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV) && !$$(ele).attr('data-translate')|| textV && isNaN(textV * 1) && $$(ele).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

          pushE.push(ele);
          pushT.push(textV);
        }
      }else if(ele.tagName === "BUTTON"){

        let textV = $$(ele).val().trim();

        if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV) && !$$(ele).attr('data-translate')|| textV && isNaN(textV * 1) && $$(ele).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

          pushE.push(ele);
          pushT.push(textV);
        }
      }
    });

    return {text: pushT,elements: pushE};
  }

  //Get Ajax elements e Texts PHPCache
  function setAjaxDataET(allElements,pushE,pushT,viewCode){

    $$(allElements).map(function(ke,ele){

      if(ele.firstChild){

        ele.normalize();
        for(let child = ele.firstChild;child != null;child = child.nextSibling){

          let textE = child,textV = child.textContent.trim();

          if(textE.nodeName === "#text" && textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV)) {

            if(!$$(ele).attr("data-translate") || $$(ele).attr("data-translate") === "true"){

              pushE.push(textE);
              pushT.push(child.textContent);
            }
          }
        }
      }else if(ele.tagName === "INPUT" || ele.tagName === "TEXTAREA"){

        let inputsEPL = ["email","text","url"], textV;

        if(ele.tagName === "INPUT" && inputsEPL.indexOf(ele.type.toLowerCase()) !== -1 || ele.tagName === "TEXTAREA") {

          textV = $$(ele).attr("placeholder") ? $$(ele).attr("placeholder").trim() : "";
        }
        else if(ele.tagName === "INPUT" && ele.type === "button" || ele.tagName === "INPUT" && ele.type === "submit"){

          textV = $$(ele).val() ? $$(ele).val().trim() : "";
        }

        if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV) && !$$(ele).attr('data-translate')|| textV && isNaN(textV * 1) && $$(ele).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

          pushE.push(ele);
          pushT.push(textV);
        }
      }else if(ele.tagName === "BUTTON"){

        let textV = $$(ele).val().trim();

        if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV) && !$$(ele).attr('data-translate')|| textV && isNaN(textV * 1) && $$(ele).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

          pushE.push(ele);
          pushT.push(textV);
        }
      }
    });


    if(pushT.length){

      if(!originAjaxElements[viewCode]){originAjaxElements[viewCode] = [];}
      if(!originAjaxTextTranslate[viewCode]){originAjaxTextTranslate[viewCode] = [];}

      originAjaxElements[viewCode].push(pushE);
      originAjaxTextTranslate[viewCode].push(pushT);
      currentViewCode = viewCode;
    }

    return {pushE: pushE,pushT: pushT}
  }

  /// event for start json verification
  document.addEventListener("essentialTRDM",boot);

  ///event for execute translate
  document.addEventListener("essentialTranslate",function(evt){

    if(!evt.detail.ajaxPushT.length){return;}

    let data = evt.detail;

    translateAj({
      data: data.ajaxPushT,
      pushIndex: data.pushIndex,
      elements: data.ajaxPushE,
      req: data.req,
      viewCode: data.viewCode,
      ajaxTextTranslate: data.ajaxTextTranslate,
      saveFrom: data.saveFrom,
      callback: function(ttr,allData){

        if(!ajaxJson.data.ajax[self.to][allData.viewCode]){ajaxJson.data.ajax[self.to][allData.viewCode] = [];}

        ajaxJson.data.ajax[self.to][allData.viewCode][allData.pushIndex] = ttr;

        self.exec({
          type: 'post',
          action: 'update_ajax',
          settingCache: true,
          pageInfo: dataPageInfo,
          index: self.to,
          data: ajaxJson.data.ajax[self.to],
          callback: function(r){}
        });

        if(allData.saveFrom){

          self.exec({
            type: 'post',
            action: 'update_ajax',
            settingCache: true,
            pageInfo: dataPageInfo,
            index: self.from,
            data: ajaxJson.data.ajax[self.from],
            callback: function(r){}
          });
        }
      }
    });
  });


  ///Get all elements
  function setElementsTranslate(){

    elements = $$("body *");
    textElements = [];
    originTextTranslate = [];
    $$(elements).map(function (k, v) {

        v.normalize();
        if(v.firstChild && textElements.indexOf(v.firstChild) === -1) {
          for (let child = v.firstChild; child != null; child = child.nextSibling) {

            let textE = child, textV = child.textContent.trim();

            if(textE.nodeName === "#text") {

              if (textV && isNaN(textV * 1) && $$(v).attr('data-essential_ajax_translate') !== "true" && !$$(v).attr('data-translate') && !/www\.|http:\/\/|https:\/\//.test(textV) && v.tagName.toLowerCase() !== "script" && v.tagName.toLowerCase() !== "style" && notAllowed.indexOf(textV) === -1 || $$(v).attr('data-essential_ajax_translate') !== "true" && textV && $$(v).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV) && v.tagName.toLowerCase() !== "script" && v.tagName.toLowerCase() !== "style" && isNaN(textV * 1 && notAllowed.indexOf(textV) === -1)) {

                if (!$$(v).attr("data-translate") || $$(v).attr("data-translate") === "true") {

                  textElements.push(textE);
                  originTextTranslate.push(child.textContent);
                }
              }
            }
          }
        }else if(v.tagName === "INPUT" || v.tagName === "TEXTAREA"){

          let inputsEPL = ["email","text","url"], textV;

          if(v.tagName === "INPUT" && inputsEPL.indexOf(v.type.toLowerCase()) !== -1 || v.tagName === "TEXTAREA") {

            textV = $$(v).attr("placeholder") ? $$(v).attr("placeholder").trim() : "";
          }
          else if(v.tagName === "INPUT" && v.type === "button" || v.tagName === "INPUT" && v.type === "submit"){

            textV = $$(v).val() ? $$(v).val().trim(): "";
          }

          if(textV && isNaN(textV * 1) && !/www\.|http:\/\/|https:\/\//.test(textV)  && textV && !$$(v).attr('data-translate')|| textV && isNaN(textV * 1) && $$(v).attr('data-translate') === 'true' && !/http:\/\/|https:\/\//.test(textV)){

            originTextTranslate.push(textV);
            textElements.push(v);
          }
        }
      });
  }

  //Class
  function ETranslate(settings) {

    this.from = settings.from; //from language
    this.to = settings.to; //to language
    this.native = settings.native ? settings.native : "en"; //to language
    this.baseUrl = baseUrl ? baseUrl : settings.baseUrl; //start url
    this.route = settings.route ? settings.route : "api/translate/"; //route php
    this.privateRoutes = settings.privateRoutes ? settings.privateRoutes : [];
    this.propertyDiff = settings.propertyDiff ? settings.propertyDiff : "user_id";
    this.cache = settings.cache !== undefined ? settings.cache === true : false;
    let self = this;

    if (!this.to) {new Error("property {to} is missing.");}
    if (!this.baseUrl) {new Error("Property {baseUrl} is missing.");}

    sessionStorage.setItem("essential_translate", "true");
    firstTranslate = firstTranslate === 0 ? 1 : 2;

    //export properties
    ETranslate.start = true;
    ETranslate.baseUrl = self.baseUrl;
    ETranslate.route = self.route;
    ETranslate.from = self.from;
    ETranslate.native = self.native;
    ETranslate.to = self.to;
    ETranslate.cache = self.cache;


    if(isFirstTR()){

      observable.observe(targetMonitor,{childList: true,subtree: true,attributes: true,attributeFilter: ["data-viewcode"]});
    }

    setElementsTranslate();

    //override external variables
    let ajaxTextTranslate = $$([]),ajaxTextTranslated = $$([]),ajaxElements = [],isAjaxTR = true,fixedSaveFrom = false;

    function PHPWithCache(){

      setAjaxJsonPI();

      ETranslate.exec = exec;
      ETranslate.read = read;
      ETranslate.compare = compare;
      ETranslate.generateViewCode = generateViewCode;


      //method main
      function boot() {

        if (!originTextTranslate.length) {return true;}


        //start process
        read({
          settingCache: true,
          callback: function (trStorage, pageInfo) {

            let is_native_lang = self.to === self.native;

            if (is_native_lang) {

              let fromTextDB = trStorage.data.fixed[self.from],
                toTextDB = trStorage.data.fixed[self.to],
                fromTextAjaxDB = $$(trStorage.data.ajax[self.from]),
                toTextAjaxDB = $$(trStorage.data.ajax[self.to]),
                is_change = false,
                checkTR = true;

              //check if FROM was changed
              if(isFirstTR() && toTextDB.length){

                let comp = compare(originTextTranslate,toTextDB);

                if(!comp){

                  textTranslated = textTranslate = originTextTranslate;
                  is_change = true;
                  checkTR = false;
                }else{

                  textTranslated = originTextTranslate;
                }
              }

              if(!toTextDB.length){

                textTranslated = textTranslate = originTextTranslate;
                is_change = true;
                checkTR = false;
                trStorage.data.fixed[self.to] = toTextDB;
              }

              //fixed translate
              etranslate(trStorage, pageInfo, is_change,checkTR);

              updateDE(function (att,ate,viewCode) {

                let isa_change = false;
                ajaxElements = ate;

                //check if TO was changed

                $$(att).map(function(vc,vcd){

                  if(vcd.length){
                    if (toTextAjaxDB.length && toTextAjaxDB[vc]) {

                      let comp = compareAj(toTextAjaxDB[vc], vcd);
                      if (!comp) {

                        ajaxTextTranslate[vc] = vcd;
                        isa_change = true;
                        isAjaxTR = false;
                      }
                    } else {

                      ajaxTextTranslate[vc] = vcd;
                      isAjaxTR = false;
                      isa_change = true;
                    }
                  }
                });

                //check if needed exec translate online and save changes
                if (isa_change) {

                  ajaxTextTranslate = dismountTEAjax();
                  ajaxElements = dismountTEAjax(ajaxElements);

                  translateAj({
                    data: ajaxTextTranslate,
                    req: isAjaxTR,
                    elements: ajaxElements,
                    ajaxTextTranslate: att,
                    viewCode: viewCode,
                    callback: function(ttr,allData){

                      ajaxTextTranslated = mountTextAjax(allData.ajaxTextTranslate,ttr);

                      $$(ajaxTextTranslated).map(function(vc,vcd){

                        if(vcd) {
                          if (!trStorage.data.ajax[self.to][vc]) {

                            trStorage.data.ajax[self.to][vc] = [];
                          }

                          trStorage.data.ajax[self.to][vc] = vcd;
                        }
                      });

                      ajaxJson.data.ajax = trStorage.data.ajax;

                      exec({
                        type: 'post',
                        pageInfo: pageInfo,
                        settingCache: true,
                        data: trStorage.data.ajax[self.to],
                        action: 'update_ajax'
                      });
                    }
                  });
                } else {

                  translateAj({
                    data: toTextAjaxDB,
                    req: false,
                    elements: ajaxElements,
                    multViewCode: true
                  });
                }
              });

            }
            else {

              let fromTextDB = trStorage.data.fixed[self.from],
                toTextDB = trStorage.data.fixed[self.to],
                fromTextAjaxDB = $$(trStorage.data.ajax[self.from]),
                toTextAjaxDB = $$(trStorage.data.ajax[self.to]),
                is_change = false,
                checkTR = true;

              if(isFirstTR()){

                if(fromTextDB.length){

                  let comp = compare(originTextTranslate,fromTextDB);

                  if(!comp){

                    is_change = true;
                    fixedSaveFrom = true;
                    textTranslate = originTextTranslate;
                  }

                  if(!is_change){

                    is_change = originTextTranslate.length !== trStorage.data.fixed[self.to].length;
                    textTranslate = originTextTranslate;
                  }
                }else{

                  is_change = true;
                  fixedSaveFrom = true;
                  textTranslate = originTextTranslate;
                }
              }

              if(!toTextDB.length){is_change = true;}


              //fixed translate
              etranslate(trStorage, pageInfo, is_change,checkTR);

              //ajax translate
              updateDE(function (att,ate,viewCode) {

                let isa_change = false;
                ajaxElements = ate;

                //check if data was changed
                $$(att).map(function(vc,vcd){
                  if(vcd.length){

                    ajaxTextTranslate[vc] = vcd;

                    if (fromTextAjaxDB.length && fromTextAjaxDB[viewCode]) {

                      let comp = compareAj(fromTextAjaxDB[vc], vcd);

                      if (!comp) {isa_change = true;}
                    }else {

                      isa_change = true;
                    }

                    if(toTextAjaxDB.length && toTextAjaxDB[vc]){

                      if(vcd.length !== toTextAjaxDB[vc].length){isa_change = vcd.length !== toTextAjaxDB[vc].length;}
                    }else{

                      isa_change = true;
                    }
                  }
                });

                //check if needed exec translate online and save changes
                if (isa_change) {

                  let dajaxTextTranslate = dismountTEAjax(),
                    dajaxElements = dismountTEAjax(ajaxElements);


                  translateAj({
                    data: dajaxTextTranslate,
                    req: isAjaxTR,
                    elements: dajaxElements,
                    ajaxTextTranslate: ajaxTextTranslate,
                    viewCode: viewCode,
                    callback: function(ttr,allData){

                      ajaxTextTranslated = mountTextAjax(allData.ajaxTextTranslate,ttr);

                      $$(ajaxTextTranslated).map(function(vc,vcd){

                        if(vcd) {
                          if (!trStorage.data.ajax[self.to][vc]) {

                            trStorage.data.ajax[self.to][vc] = [];
                          }

                          trStorage.data.ajax[self.to][vc] = vcd;
                        }
                      });

                      ajaxJson.data.ajax = trStorage.data.ajax;

                      exec({
                        type: 'post',
                        pageInfo: pageInfo,
                        settingCache: true,
                        data: trStorage.data.ajax[self.to],
                        action: 'update_ajax'
                      });
                    }
                  });
                } else {

                  translateAj({
                    data: toTextAjaxDB,
                    req: false,
                    elements: ajaxElements,
                    multViewCode: true
                  });
                }
              });
            }
          }
        });
      }

      //execute a post in server
      function exec(allData, t) {

        let data = allData.data ? allData.data : {},
          type = allData.type,
          pageInfo = typeof allData.pageInfo === 'object' ? $$(allData.pageInfo).encode() : allData.pageInfo,
          action = allData.action,
          urls = type.toLowerCase() === 'get' ? window.location.href.split("#")[0] : self.baseUrl + self.route,
          callBack = typeof allData.callback === "function" ? allData.callback : function () {},
          settingCache = allData.settingCache,
          generateViewCode = allData.generateViewCode,
          viewName = allData.viewName,
          translate = allData.translate,
          index = allData.index ? allData.index : self.to,
          readIndexes = {from: self.from,to: self.to};

        if (t === "true") {}

        if (type === 'post') {}

        $$.ajax({
          url: urls,
          type: type,
          formData: true,
          data: {pageInfo: pageInfo,action: action, data: $$(data).encode(), settingCache: settingCache,readIndexes: $$(readIndexes).encode(),to: self.to,generateViewCode: generateViewCode,translate: translate,privateRoutes: JSON.stringify(self.privateRoutes),viewName: viewName,index: index},
          success: function (r) {

            callBack(r,allData.param);
          }
        });
      }

      //generate ViewCode
      function generateViewCode(callback,viewName){

        viewName = viewName ? viewName : "";
        callback = typeof callback === "function" ? callback : function(){};
        read({
          generateViewCode: true,
          viewName: window.location.href.split("#")[1]+viewName,
          callback: function(v,pi){

            callback(v);
          }
        });
      }

      function getPageInfo(callback){

        callback = typeof callback === "function" ? callback : function(){};

        $$.ajax({
          url: window.location.href.split("#")[0],
          type: 'post',
          data: {privateRoutes: JSON.stringify(self.privateRoutes),PAGE_INFO: true,id: self.propertyDiff},
          success: function(r){

            let data;
            try{

              data = $$.decode(r);
            }catch(e){return;}

            callback(data);
          }
        });
      }

      //exec comparations
      function compare(data1, data2, d) {

        if (typeof data1 === "object" || typeof data2 === "object") {

          if (!d && data1.length === data2.length || d && data1.length < data2.length) {
            let r = $$(data1).map(function (k, v) {

              if (v !== data2[k]) {

                return false;
              }
            });

            return typeof r === 'object';
          }
        }

        if(typeof data1 === "string" && typeof data2 === "string"){

          return data1 === data2;
        }

        return false;
      }

      //exec comparations oj object ajax
      function compareAj(data1, data2) {

        if (typeof data1 === "object" && typeof data2 === "object" && data1.length === data2.length) {

          let r = $$(data1).map(function (k, v) {

            $$(v).map(function(k2,v2){

              if (v2 !== data2[k][k2]) {

                return false;
              }
            });
          });

          return typeof r === 'object';
        }

        return false;
      }

      ///exec fixed translate
      function translate(allData) {

        let req = allData.req !== undefined ? allData.req : true,
          callback = typeof allData.callback === "function" ? allData.callback : function () {},
          data = allData.data ? allData.data : textTranslate;

        if (req) {

          $$.ajax({
            url: self.baseUrl + self.route,
            type: 'post',
            formData: true,
            data: {from: self.from, to: self.to, data: $$(data).encode(), translate: true,settingCache: false,generateViewCode: false},
            success: function (r) {

              try {

                textTranslated = $$.decode(r);
              } catch (e) {return;}

              let source = allData.elements ? allData.elements : textElements,
                inputsEPL = ["email","text","url"];

              $$(source).map(function (k, v) {
                if(textTranslated[k]){

                  if(v.tagName && v.tagName === "INPUT" && inputsEPL.indexOf(v.type) !== -1 || v.tagName && v.tagName === "TEXTAREA"){

                    $$(v).attr("placeholder",textTranslated[k]);
                  }else if(v.tagName === "BUTTON" || v.tagName === "INPUT"){

                    $$(v).val(textTranslated[k]);
                  }else{

                    v.textContent = textTranslated[k];
                  }
                }
              });

              callback(textTranslated,allData);
            }
          });
        } else {

          let source = allData.elements ? allData.elements : textElements,
            inputsEPL = ["email","text","url"];

          $$(source).map(function (k, v) {

            if(textTranslated[k]){

              if(v.tagName && v.tagName === "INPUT" && inputsEPL.indexOf(v.type) !== -1 || v.tagName && v.tagName === "TEXTAREA"){

                $$(v).attr("placeholder",textTranslated[k]);
              }else if(v.tagName === "BUTTON" || v.tagName === "INPUT"){

                $$(v).val(textTranslated[k]);
              }else{

                v.textContent = textTranslated[k];
              }
            }
          });
          callback(textTranslated,allData);
        }
      }

      /// read json of server
      function read(allData) {

        let callback = typeof allData.callback === "function" ? allData.callback : function () {};


        getPageInfo(function(pageInfo){

          exec({
            type: 'post',
            action: 'read',
            pageInfo: pageInfo,
            param: allData.param,
            generateViewCode: allData.generateViewCode,
            settingCache: allData.settingCache,
            translate: allData.translate,
            viewName: allData.viewName,
            callback: function (trStorage,param) {

              console.log(trStorage);

              try {

                trStorage = $$.decode(trStorage);
              } catch (e) {return;}

              setTimeout(function () {

                callback(trStorage, pageInfo,param);
              });
            }
          });
        });
      }

      ///interface of filter for translation
      function etranslate(trStorage, pageInfo, is_change,save) {

        if (is_change) {

          translate({
            data: textTranslate,
            elements: textElements,
            req: save,
            saveFrom: fixedSaveFrom,
            callback: function (ttr,allData) {

              trStorage.data.fixed[self.to] = ttr;

              exec({
                type: 'post',
                settingCache: true,
                action: 'update_fixed',
                pageInfo: pageInfo,
                data: trStorage.data.fixed[self.to]
              });

              if(allData.saveFrom){

                trStorage.data.fixed[self.from] = allData.data;

                exec({
                  type: 'post',
                  settingCache: true,
                  action: 'update_fixed',
                  pageInfo: pageInfo,
                  index: self.from,
                  data: trStorage.data.fixed[self.from]
                });
              }

            }
          });
        } else {

          textTranslated = trStorage.data.fixed[self.to];
          translate({
            req: false,
            elements: textElements
          });
        }
      }

      //update ajaxJson
      function updateDE(callback) {

        callback = typeof callback === "function" ? callback : function () {};

        if(originAjaxTextTranslate[currentViewCode] && sessionStorage.getItem("translate_ajax_update") === "true"){

          ajaxTextTranslate = originAjaxTextTranslate;
          ajaxElements = originAjaxElements;
          setTimeout(callback,200,originAjaxTextTranslate,originAjaxElements,currentViewCode);
        }
      }

      //mount structure of objects ajaxTextElements e ajaxElements
      function mountTextAjax(data1,data2){

        data1 = typeof data1 === "object" ? data1 : ajaxTextTranslate;
        let rv = $$([]),count = 0;

        $$(data1).map(function(k,v){

          rv[k] = [];

          $$(v).map(function(k2,v2){

            rv[k][k2] = [];
            $$(v2).map(function(){

              rv[k][k2].push(data2[count]);
              count++;
            });
          });
        });
        return rv;
      }

      //dismount structure of objects ajaxTextElements e ajaxElements
      function dismountTEAjax(data){

        data = typeof data === "object" ? data : ajaxTextTranslate;
        let rv = [];

        $$(data).map(function(k,v){

          $$(v).map(function(k2,v2){

            if(v2){
              $$(v2).map(function(k2,v3){

                rv.push(v3);
              });
            }
          });
        });

        return rv;
      }

      function setAjaxJsonPI(){

        read({
          settingCache: true,
          callback: function (tr, pageInfo) {

            dataPageInfo = pageInfo;
            ajaxJson = tr;
          }
        });
      }

      //start
      boot();
    }

    function PHPNoCache(){

      ETranslate.translateNoCache = exec;

      // console.log(originTextTranslate);

      exec(self.from,self.to,originTextTranslate,textElements);

      function exec(from,to,text,currentElements) {

        // console.log(text,currentElements);

        // return;
        let allText = [];
        let textArrLastIndex = text.length - 1;
        let currentTextArrIndex = 0;
        let lengthLimit = 1050;
        let hasNoSplitedData = false;
        let elements = [];

        // text.forEach(function(v,k){
        //
        //   console.log(v.length);
        // });

        // console.log(currentElements.length, text.length);
        // return;

        // console.log("--------------");

        text.forEach(function(v,k){

          if(v.length <= lengthLimit){

            lessThan(k,v);
          }else{

            if(hasNoSplitedData){

              hasNoSplitedData = false;
              currentTextArrIndex++;
            }

            processSplitedData(k,v);
          }
        });

        function processSplitedData(k,v){

          process(k,v);

          function process(k,v){
            let vSplited0 = v.split(".").filter(function (v) { return v.trim() !== ""; });
            let separator0 = ".";

            if(vSplited0.length === 0){

              vSplited0 = v.split(",").filter(function (v) { return v.trim() !== ""; });
              separator0 = ",";
            }

            if(vSplited0 > 0){

              vSplited0.forEach(function(v){
                if(v.length <= lengthLimit){

                  lessThan(k,v,true,separator0);
                }else{

                  let separator1 = separator0 === "." ? "," : ".";
                  let vSplited1 = v.split(separator1).filter(function (v) { return v.trim() !== ""; });

                  if(vSplited1.length > 0){

                    vSplited1.forEach(function(v){
                      if(v.length <= lengthLimit){

                        lessThan(k,v,true,separator1);
                      }else{

                        let v2 = v;
                        while(v2.length > lengthLimit){

                          lessThan(k,v2.substr(0,lengthLimit - 1),true);
                          v2 = v2.substr(lengthLimit - 1);
                        }
                        allText[currentTextArrIndex].push(v2);
                      }
                    });
                  }else{

                    let v2 = v;
                    while(v2.length > lengthLimit){

                      lessThan(k,v2.substr(0,lengthLimit - 1),true);
                      v2 = v2.substr(lengthLimit - 1);
                    }
                    allText[currentTextArrIndex].push(v2);
                  }
                }
              });
            }else{

              let v2 = v;
              while(v2.length > lengthLimit){

                lessThan(k,v2.substr(0,lengthLimit - 1),true);
                v2 = v2.substr(lengthLimit - 1);
              }
              allText[currentTextArrIndex].push(v2);
            }

            currentTextArrIndex++;
          }
        }

        // console.log("--------------------");
        // console.log(allText,elements);

        function lessThan(k,v,isPart = false,separator = ""){

          if(isPart){

            let currentDataTextIndex = allText[currentTextArrIndex];

            if(!currentDataTextIndex){

              allText[currentTextArrIndex] = [];
              currentDataTextIndex = [];
            }

            if(!elements[currentTextArrIndex]){

              elements[currentTextArrIndex] = [currentElements[k]];
            }

            let currentDataTextLength = currentDataTextIndex.length;

            if(currentDataTextLength > 0 && ((currentDataTextIndex[currentDataTextLength - 1] + v).length <= lengthLimit)){

              allText[currentTextArrIndex][currentDataTextLength - 1] = allText[currentTextArrIndex][currentDataTextLength - 1] + separator + v;
            }else{

              allText[currentTextArrIndex].push(currentDataTextLength > 0 ? separator + v : v);
            }
          }else{

            let currentText = allText[currentTextArrIndex];

            if(!currentText){
              allText[currentTextArrIndex] = "";
              currentText = "";
            }

            if((currentText + v).length <= lengthLimit){

              if(!elements[currentTextArrIndex]){

                elements[currentTextArrIndex] = [];
              }

              elements[currentTextArrIndex].push(currentElements[k]);

              allText[currentTextArrIndex] += allText[currentTextArrIndex].length > 0 ? " ,[(==|-(=##=##=)-|==)], " + v : v;
              hasNoSplitedData = true;
            }else{

              allText.push(v);
              currentTextArrIndex++;
              elements[currentTextArrIndex] = [currentElements[k]];

              ///Update delayed index
              if(typeof allText[currentTextArrIndex] === "string"){

                currentTextArrIndex++;
              }
              hasNoSplitedData = false;
            }
          }
        }


        // return;

        allText.forEach(function(v,k){
          if(typeof v !== "object"){

            translate(k,v,false,false,elements[k]);
          }else{

            v.forEach(function(v,k1){
              if(k1 === 0){

                translate(k,v,true,true,elements[k]);
              }else{

                translate(k,v,true,false,elements[k]);
              }
            });
          }
        });


        function translate(k,v,isPart = false,isFirstPart = false,elements){

          v = typeof v === "object" ? v : [v];

          // let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+from+"&tl="+to+"&dt=t&q="+encodeURI(v);
          $$.ajax({
            url: urls.baseUrl + "api/translate/",
            type: "post",
            data: {translate: true,from: self.from,to: self.to,data: v},
            success: function(r){

              let textTranslated;
              try{

                textTranslated = $$.parse(r);
              }catch(e){

                return false;
              }

              if(textTranslated.length > 0){

                let source = elements ? elements : [],
                  inputsEPL = ["email","text","url"];

                if(source && source.length > 0){

                  // console.log(source,textTranslated);
                  if(isPart){

                    $$(textTranslated).map(function(k,v){
                      let ele = source[0];
                      if(ele) {
                        if (ele.tagName && ele.tagName === "INPUT" && inputsEPL.indexOf(ele.type) !== -1 || ele.tagName && ele.tagName === "TEXTAREA") {

                          $$(ele).attr("placeholder", v);
                        } else if (ele.tagName === "BUTTON" || v.tagName === "INPUT") {

                          $$(ele).val(v);
                        } else {

                          if(isFirstPart){

                            ele.textContent = v;
                          }else{

                            ele.textContent += v;
                          }
                        }
                      }
                    });
                  }else{

                    $$(source).map(function(k,v){
                      if(textTranslated[k]) {
                        if (v.tagName && v.tagName === "INPUT" && inputsEPL.indexOf(v.type) !== -1 || v.tagName && v.tagName === "TEXTAREA") {

                          $$(v).attr("placeholder", textTranslated[k]);
                        } else if (v.tagName === "BUTTON" || v.tagName === "INPUT") {

                          $$(v).val(textTranslated[k]);
                        } else {

                          v.textContent = textTranslated[k];
                        }
                      }
                    });
                  }
                }
              }

              // console.log("*********************");
              // console.log(k,isPart,isFirstPart,r);
            }
          });
        }
      }

    }

    if(this.cache){

      PHPWithCache();
    }else{

      PHPNoCache();
    }
  }




  //check if is first translation
  function isFirstTR(){

    return firstTranslate === 1;
  }

  //execute translation ajax
  function translateAj(allData) {

    allData = typeof allData === "object" ? allData : {};
    let data = allData.data ? allData.data : null,
        req = allData.req ? !0 : !1,
        callback = typeof allData.callback === "function" ? allData.callback : function () {},
        self = ETranslate,
        index = allData.index ? allData.index : self.to,
        inputsEPL = ["email","text","url"],
        multViewCode = allData.multViewCode ? allData.multViewCode : false;

    if (req) {

      $$.ajax({
        url: self.baseUrl + self.route,
        type: 'post',
        formData: true,
        data: {from: self.from, to: self.to, data: $$(data).encode(),translate: true,index: index},
        success: function (r) {

          try {

            ajaxTextTranslated = $$.decode(r);
          } catch (e) {return;}

          $$(allData.elements).map(function (k, v) {

            if(v.tagName && v.tagName === "INPUT" && inputsEPL.indexOf(v.type) !== -1 || v.tagName && v.tagName === "TEXTAREA"){

              $$(v).attr("placeholder", ajaxTextTranslated[k]);
            }else if(v.tagName === "BUTTON" || v.tagName === "INPUT"){

              $$(v).val( ajaxTextTranslated[k]);
            }else{

              v.textContent =  ajaxTextTranslated[k];
            }
          });
          callback(ajaxTextTranslated,allData);
        }
      });
    } else {

      let sourceText = allData.data ? allData.data : ajaxTextTranslated;

      $$(allData.elements).map(function (k, v) {

        if(multViewCode){

          $$(v).map(function(k2,v2){

            $$(v2).map(function(k3,v3){

              if (v3.tagName && v3.tagName === "INPUT" && inputsEPL.indexOf(v3.type) !== -1 || v3.tagName && v3.tagName === "TEXTAREA") {

                $$(v3).attr("placeholder", sourceText[k][k2][k3]);
              } else if (v3.tagName === "BUTTON" || v3.tagName === "INPUT") {

                $$(v3).val(sourceText[k][k2][k3]);
              } else {

                v3.textContent = sourceText[k][k2][k3];
              }
            });

          });

        }else {

          if (v.tagName && v.tagName === "INPUT" && inputsEPL.indexOf(v.type) !== -1 || v.tagName && v.tagName === "TEXTAREA") {

            $$(v).attr("placeholder", sourceText[k]);
          } else if (v.tagName === "BUTTON" || v.tagName === "INPUT") {

            $$(v).val(sourceText[k]);
          } else {

            v.textContent = sourceText[k];
          }
        }
      });

      setTimeout(callback,300,data,allData);
    }
  }

  //start filter process ajax
  function boot(event) {

    let is_native_lang = self.to === self.native,
        compare = self.compare,

        is_change = false,
        ajaxReq = true,
        ajaxSaveFrom = false,

        index = event.detail.ajaxPushTIndex,
        currentViewCode = event.detail.viewCode,

        ajaxPushE = originAjaxElements[currentViewCode][index],
        ajaxPushT = originAjaxTextTranslate[currentViewCode][index],

        trStorage = event.detail.ajaxJson,
        toTextDB = $$(trStorage[self.to]),
        fromTextDB = $$(trStorage[self.from])
      ;

    if (is_native_lang) {

      if(isFirstTR()){

        let comp;
        if(toTextDB[currentViewCode] && toTextDB[currentViewCode][index]){

          comp = compare(ajaxPushT,toTextDB[currentViewCode][index]);
          is_change = comp ? !1 : !0;
        }
      }else{

        if(toTextDB[currentViewCode] && toTextDB[currentViewCode][index]){

          is_change = ajaxPushT.length !== toTextDB[currentViewCode][index].length;
        }
      }

      if(!fromTextDB.length){ajaxTextTranslate = ajaxPushT;}

      if(!toTextDB.length || !toTextDB[currentViewCode] || !toTextDB[currentViewCode][index]){

        ajaxTextTranslate = ajaxPushT;
        is_change = true;
        ajaxReq = false;
      }


      if (is_change) {

        let details = {pushIndex: index,ajaxPushT: ajaxPushT,ajaxPushR: ajaxPushE,ajaxTextTranslate: ajaxTextTranslate,req: ajaxReq,saveFrom: ajaxSaveFrom,viewCode: currentViewCode},
            eventEssentialTranslate = typeof Event === 'function' ? new CustomEvent("essentialTranslate",{detail: details}) : document.createEvent('CustomEvent');

        if(typeof Event !== 'function'){eventEssentialTranslate.initCustomEvent('essentialTranslate',false,false,details);}
        document.dispatchEvent(eventEssentialTranslate);
      } else {

        ajaxTextTranslated = toTextDB[currentViewCode][index];
        translateAj({
          data: ajaxTextTranslated,
          req: false,
          elements: ajaxPushE
        });
      }

    }
    else{

      if(isFirstTR()){

        let comp;
        if(fromTextDB.length && fromTextDB[currentViewCode] && fromTextDB[currentViewCode][index]){

          comp = compare(ajaxPushT,fromTextDB[currentViewCode][index]);
          if(comp && toTextDB && toTextDB[currentViewCode] && toTextDB[currentViewCode][index]){

            comp = ajaxPushT.length === toTextDB[currentViewCode][index].length;
          }else{

            fromTextDB[currentViewCode][index] = ajaxPushT;
            ajaxJson.data.ajax[self.from] = fromTextDB;
            ajaxTextTranslate = ajaxPushT;
            ajaxSaveFrom = true;
          }

          is_change = comp ? !1 : !0;
        }else{

          if(!fromTextDB.length){fromTextDB = $$({});}

          if(!fromTextDB[currentViewCode]){fromTextDB[currentViewCode] = [];}

          if(!fromTextDB[currentViewCode][index]){fromTextDB[currentViewCode][index] = ajaxPushT;}

          ajaxJson.data.ajax[self.from] = fromTextDB;
          is_change = true;
          ajaxTextTranslate = ajaxPushT;
          ajaxSaveFrom = true;
        }
      }else{

        if(toTextDB.length && toTextDB[currentViewCode] && toTextDB[currentViewCode][index]){

          is_change = ajaxPushT.length !== toTextDB[currentViewCode][index].length;
          ajaxTextTranslate = is_change ? ajaxPushT : [];
        }
      }

      if(!toTextDB.length || !toTextDB[currentViewCode] || !toTextDB[currentViewCode][index]){ajaxTextTranslate = ajaxPushT;is_change = true;}



      if(is_change){

        let details = {pushIndex: index,ajaxPushT: ajaxPushT,ajaxPushE: ajaxPushE,ajaxTextTranslate: ajaxTextTranslate,req: ajaxReq,saveFrom: ajaxSaveFrom,viewCode: currentViewCode},
            eventEssentialTranslate = typeof Event === 'function' ? new CustomEvent("essentialTranslate",{detail: details}) : document.createEvent('CustomEvent');

        if(typeof Event !== 'function'){eventEssentialTranslate.initCustomEvent('essentialTranslate',false,false,details);}
        document.dispatchEvent(eventEssentialTranslate);
      }else{

        ajaxTextTranslated = toTextDB[currentViewCode][index];
        translateAj({
          data: ajaxTextTranslated,
          index: index,
          req: false,
          elements: ajaxPushE
        });
      }
    }
  }

  //export constructor
  window.ETranslate = ETranslate;
});




