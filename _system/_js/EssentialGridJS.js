$$(function(){

  window.EssentialGridBot = EssentialGrid;

  function EssentialGrid(callback,contFindElements,createStylesheet){

    let columnCount= 30,
      findNumber=/[0-9]{1,3}/,
      parentArr=[],
      arrRes=['xs','sm','md','lg','vl','vb'],

      genericMatch={
        matchCol:/col[0-9]+(?=-[a-z]+)/i,
        matchColTo:/col[0-9]+\-to[0-9]+/i,
        matchColRes:/col[0-9]+\-[a-z]+/i,
        matchColToRES:/col[0-9]+\-to[0-9]+\-[a-z]+/i
      },

      matchColToRESOBJ={
        xs:[/col[0-9]+\-to[0-9]+\-xs/i,1],
        sm:[/col[0-9]+\-to[0-9]+\-sm/i,2],
        md:[/col[0-9]+\-to[0-9]+\-md/i,3],
        lg:[/col[0-9]+\-to[0-9]+\-lg/i,4],
        vl:[/col[0-9]+\-to[0-9]+\-vl/i,5],
        vb:[/col[0-9]+\-to[0-9]+\-vb/i,6]
      },

      columns_rules = {"xs": [],"sm": [],"md": [],"lg": [],"vl": [],"vb": []},
      offsets = {"xs": [],"sm": [],"md": [],"lg": [],"vl": [],"vb": []},
      colWidth = 100 / 30,

      allElements = [],
      evt = typeof Event === 'function' ? new CustomEvent("gridload") : document.createEvent('Event');

    callback = typeof callback === "function" ? callback : function(){};
    contFindElements = contFindElements !== null && typeof contFindElements === 'object'? $$(contFindElements) : $$(document);
    contFindElements.find(".essential-grid-element-block").remove();


    /*** Obtêm as aolunas noemadas com colN-toN && colN-toN-RES ****/
    (function(loadPN){
      let oneLoop = false;
      for(let start= createStylesheet ? 0 : 1,end=createStylesheet ? 0 : 1,count=createStylesheet ? 0 : 1;start<=columnCount&&end<=columnCount;end++){

        if(start > 0 && end > start){

          let colToXS = contFindElements.find('.col'+start+'-to'+end+'-xs'),
            colToSM = contFindElements.find('.col'+start+'-to'+end+'-sm'),
            colToMD = contFindElements.find('.col'+start+'-to'+end+'-md'),
            colToLG = contFindElements.find('.col'+start+'-to'+end+'-lg'),
            colToVL = contFindElements.find('.col'+start+'-to'+end+'-vl'),
            colToVB = contFindElements.find('.col'+start+'-to'+end+'-vb');

          if(colToXS[0]){

            colToXS.map(function(k,v){
              if(allElements.indexOf(v) === -1){

                allElements.push(v);
              }
            });
          }
          if(colToSM[0]){

            colToSM.map(function(k,v){
              if(allElements.indexOf(v) === -1){

                allElements.push(v);
              }
            });
          }
          if(colToMD[0]){

            colToMD.map(function(k,v){
              if(allElements.indexOf(v) === -1){

                allElements.push(v);
              }
            });
          }
          if(colToLG[0]){

            colToLG.map(function(k,v){
              if(allElements.indexOf(v) === -1){

                allElements.push(v);
              }
            });
          }
          if(colToVL[0]){

            colToVL.map(function(k,v){
              if(allElements.indexOf(v) === -1){

                allElements.push(v);
              }
            });

          }
          if(colToVB[0]){

            colToVB.map(function(k,v){
              if(allElements.indexOf(v) === -1){

                allElements.push(v);
              }
            });

          }

          /// set columns width
        }

        if(start > 0 && end > start){

          if(createStylesheet){

            let
              width = (end - (start - 1)) * colWidth,
              rule = "{width:"+width+"%!important;}";

            columns_rules["xs"].push(".col"+start+"-to"+end+"-xs"+rule);
            columns_rules["sm"].push(".col"+start+"-to"+end+"-sm"+rule);
            columns_rules["md"].push(".col"+start+"-to"+end+"-md"+rule);
            columns_rules["lg"].push(".col"+start+"-to"+end+"-lg"+rule);
            columns_rules["vl"].push(".col"+start+"-to"+end+"-vl"+rule);
            columns_rules["vb"].push(".col"+start+"-to"+end+"-vb"+rule);
          }
        }

        ///set columns offsets
        if(createStylesheet && !oneLoop && end < columnCount){

          let offset = end * colWidth,
            offset_rule = "{margin-left:"+offset+"%!important;}";

          offsets["xs"].push(".eg-column-offset-"+end+"-xs"+offset_rule);
          offsets["sm"].push(".eg-column-offset-"+end+"-sm"+offset_rule);
          offsets["md"].push(".eg-column-offset-"+end+"-md"+offset_rule);
          offsets["lg"].push(".eg-column-offset-"+end+"-lg"+offset_rule);
          offsets["vl"].push(".eg-column-offset-"+end+"-vl"+offset_rule);
          offsets["vb"].push(".eg-column-offset-"+end+"-vb"+offset_rule);
        }

        if(end===columnCount){end=0;start++;count++;if(count===columnCount){break;}oneLoop = true;}
      }

      if(!loadPN){let loadPN='loopLoad';window[loadPN]=!0;}

      let count = 0,stylesheet = $$($$("<style>"));
      stylesheet.append("body");
      stylesheet = document.styleSheets[document.styleSheets.length - 1];

      ///add offsets classes
      $$(offsets).map(function(key,off) {

        let media = setMedia(key);
        $$(off).map(function(k, style) {

          media += style;
        });

        media += "}";
        stylesheet.insertRule(media,count);
        count++;
      });

      ///add columns width classes
      stylesheet.insertRule(".essential-column-grid{float: left;}",0);
      stylesheet.insertRule(".hidden-column{display: none;}",1);
      stylesheet.insertRule(".clearfix,.clearfix:before, .clearfix:after{content: '';  display: block; clear: both;}",2);
      stylesheet.insertRule(".essential-grid-element-block{display: none;clear: both;float: none;content: ' ';width: 100%;opacity: 0 !important;z-index: -100;}",3);
      stylesheet.insertRule("@media (min-width: 0) and (max-width: 320px){.hidden-xs{display: none!important;.show-xs{display: block!important;}.show-sm{display: none!important;}.show-md{display: none!important;}.show-lg{display: none!important;}.show-vl{display: none!important;}.show-vb{display: none!important;}.show-h-xs{display: block!important;}.hide-h-xs{display: none !important;}}",4);
      stylesheet.insertRule("@media (min-width: 320px) and (max-width: 480px){.hidden-sm{display: none !important;}.show-sm{display: block!important;}.show-xs{display: none!important;}.show-md{display: none!important;}.show-vl{display: none!important;}.show-lg{display: none!important;}.show-vb{display: none!important;}.show-h-sm{display: block!important;}.hide-h-sm{display: none !important;}}",5);
      stylesheet.insertRule("@media (min-width: 480px) and (max-width: 768px){.hidden-md{display: none !important;}.show-md{display: block!important;}.show-xs{display: none!important;}.show-sm{display: none!important;}.show-vl{display: none!important;}.show-lg{display: none!important;}.show-vb{display: none!important;}.show-h-md{display: block!important;}.hide-h-md{display: none !important;}}", 6);
      stylesheet.insertRule("@media (min-width: 768px) and (max-width: 930px){.hidden-lg{display: none !important;}.show-lg{display: block!important;}.show-xs{display: none!important;}.show-sm{display: none!important;}.show-md{display: none!important;}.show-vl{display: none!important;}.show-vb{display: none!important;}.show-h-lg{display: block!important;}.hide-h-lg{display: none !important;}}", 7);
      stylesheet.insertRule("@media (min-width: 930px) and (max-width: 1200px){.hidden-vl{display: none !important;}.show-vl{display: block!important;}.show-xs{display: none!important;}.show-sm{display: none!important;}.show-md{display: none!important;}.show-lg{display: none!important;}.show-vb{display: none!important;}.show-h-vl{display: block!important;}.hide-h-vl{display: none !important;}}",8);
      stylesheet.insertRule("@media (min-width: 1200px){.hidden-vb{display: none !important;}.show-vb{display: block!important;}.show-xs{display: none!important!important;}.show-sm{display: none!important;}.show-md{display: none!important;}.show-lg{display: none!important;}.show-vl{display: none!important;}.show-h-vb{display: block!important;}.hide-h-vb{display: none !important;}}",9);
      count = 10;

      $$(columns_rules).map(function(key,rule){

        let media = setMedia(key);
        $$(rule).map(function( kaey2,style) {

          media += style;
        });

        media += "}";
        stylesheet.insertRule(media,count);
        count++;
      });
    }());

    function getPrevElement(ele){


      if(!ele){return;}
      if(!$$(ele).prev().length){return false;}

      let prevE;

      if($$(ele).prev().hasClass('essential-grid-elements-block')){
        for(let i = $$(ele).prev(); i.size() > 0 && i.hasClass('essential-grid-elements-block');i = i.prev()){
          prevE = i;
        }
      }else{

        prevE = $$(ele).prev();

      }

      return prevE;
    }

    function setMedia(key){

      let media = "";

      switch (key) {
        case "xs": {

          media = "@media(min-width: 100px){";
          break;
        }
        case "sm": {

          media = "@media(min-width: 360px){";
          break;
        }
        case "md": {

          media = "@media(min-width: 480px){";
          break;
        }
        case "lg": {

          media = "@media(min-width: 768px){";
          break;
        }
        case "vl": {

          media = "@media(min-width: 930px){";
          break;
        }
        case "vb": {

          media = "@media(min-width: 1200px){";
          break;
        }
      }

      return media;
    }

    function getPrevRes(res){

      res = res.toLowerCase();
      return res === "vb" ? 'vl' :(res === 'vl') ? "lg" :(res === 'lg') ? "md" :(res === 'md') ? "sm" :(res === 'sm') ? "xs" : false;
    }

    ///set columns offsets
    function getColInfo(ele,i){

      /** Inicilalização das variáveis nescessária para operação **/
      let classes_element = $$(ele).attr('class'),
        iniPos = {xs: 0,sm: 0,md: 0,lg: 0,vl: 0,vb: 0},
        endPos = {xs: 0,sm: 0,md: 0,lg: 0,vl: 0,vb: 0},
        prevIniPos = {xs: 0,sm: 0,md: 0,lg: 0,vl: 0,vb: 0},
        prevEndPos = {xs: 0,sm: 0,md: 0,lg: 0,vl: 0,vb: 0},
        prevEle= $$(ele).prev()[0] && genericMatch.matchColToRES.exec(getPrevElement(ele).attr('class')) ? getPrevElement(ele) : false,
        res_matches = {
          xs: matchColToRESOBJ.xs[0].exec(classes_element),
          sm: matchColToRESOBJ.sm[0].exec(classes_element),
          md: matchColToRESOBJ.md[0].exec(classes_element),
          lg: matchColToRESOBJ.lg[0].exec(classes_element),
          vl: matchColToRESOBJ.vl[0].exec(classes_element),
          vb: matchColToRESOBJ.vb[0].exec(classes_element)
        }
      ;

      if(prevEle){

        let classes_prev_element = $$(prevEle).attr('class'),
          prev_ele_res_matches = {
            xs: matchColToRESOBJ.xs[0].exec(classes_prev_element),
            sm: matchColToRESOBJ.sm[0].exec(classes_prev_element),
            md: matchColToRESOBJ.md[0].exec(classes_prev_element),
            lg: matchColToRESOBJ.lg[0].exec(classes_prev_element),
            vl: matchColToRESOBJ.vl[0].exec(classes_prev_element),
            vb: matchColToRESOBJ.vb[0].exec(classes_prev_element)
          }
        ;

        $$(prev_ele_res_matches).map(function(k,v){
          if(v){

            v = v[0];
            let res = v.split('-')[2];
            prevIniPos[res] = findNumber.exec(v.split("-")[0])[0] * 1;
            prevEndPos[res] = findNumber.exec(v.split("-")[1])[0] * 1;
          }else{

            prevIniPos[k] = prevIniPos[getPrevRes(k)];
            prevEndPos[k] = prevEndPos[getPrevRes(k)];
          }
        });
      }


      if(!genericMatch.matchColToRES.test($$(ele).parent().attr('class'))){$$(ele).addClass('essential-column-grid').parent().addClass("clearfix");}

      $$(ele).addClass('essential-column-grid');



      $$(res_matches).map(function(k,v){
        if(v){

          v = v[0];
          let res = v.split('-')[2];
          iniPos[res] = findNumber.exec(v.split("-")[0])[0] * 1;
          iniPos[res] = iniPos[res] > 1 ? iniPos[res] : 0;
          endPos[res] = findNumber.exec(v.split("-")[1])[0] * 1;
        }else{

          iniPos[k] = iniPos[getPrevRes(k)];
          endPos[k] = endPos[getPrevRes(k)];
        }
      });


      $$(iniPos).map(function(res,v){

        let pep = prevEndPos[res];

        let offset = (v - 1) - pep;
        offset = offset > 0 ? offset : 0;

        if(v > pep){

          if(offset >= 0){

            $$(ele).addClass("eg-column-offset-"+(offset)+'-'+res);
            let separator = $$(ele).prev();

            if(separator.length && separator.hasClass('essential-grid-element-block')){

              separator.addClass('hide-h-'+res);
            }
          }
        }else{

          let off = prevEndPos[res] > 0 && iniPos[res] > 0? iniPos[res] - 1 : offset,
            separator = $$(ele).prev();

          if(separator.length && separator.hasClass('essential-grid-element-block')){

            separator.addClass('show-h-'+res);
          }else{

            separator = $$($$("<essentialGridRow>",{class: 'essential-grid-element-block'}));
            separator.addClass('show-h-'+res).before($$(ele));
          }

          $$(ele).addClass("eg-column-offset-"+off+'-'+res);
        }
      });
    }

    /** @param elements representando um elemento html para aplicação de estilos
     ***/
    function setDefaultStyle(elements){

      $$(elements).map(function(k,v){

        getColInfo(v,k);
      });
    }

    setDefaultStyle(allElements);

    contFindElements[0].gridLoad = true;

    if(typeof Event !== 'function'){

      evt.initEvent('gridload',false,false);
    }

    contFindElements[0].dispatchEvent(evt);

    callback();

    matchColToRESOBJ = null;
    genericMatch = null;
  }

  EssentialGridBot(function(){

    $$('body').css('visibility','visible');
  },null,true);

});

$$(document).on('gridload',function(e){

  let target = $$("body")[0],
    observer = new MutationObserver(function(mutations){

      mutations.forEach(function(mutation) {

        if(mutation.type === "attributes"){

          let className = mutation.target.classList[mutation.target.classList.length - 1];
          if(/col[0-9]+\-to[0-9]+\-(?:xs|sm|md|lg|vl|vb)/.exec(className)){

            EssentialGridBot(null,$$(mutation.target).parent());
          }
        }else{

          let hasChange = false;
          $$(mutation.addedNodes).map(function(k,v){
            if(v.nodeType === 1 || v.nodeType === 2 ) {
              if (/col[0-9]+\-to[0-9]+\-(?:xs|sm|md|lg|vl|vb)/.exec($$(v).attr('class')) || $$(v).hasClass('ng-scope')) {

                hasChange = true;
                return true;
              }
            }
          });

          if(hasChange){

            EssentialGridBot(null,$$(mutation.target));
          }
        }
      });
    });

  observer.observe(target, {childList: true,subtree: true,attributes: true,attributeFilter: ["class"]});

});
