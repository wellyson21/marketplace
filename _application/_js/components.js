$$(function () {

  (function setMenu(){

    ///Toggle MenuState
    let menuButton = $$("#header .menu-button");
    let menuMobile = $$("#header .menu-mobile");
    let menuOverlay = $$("#header .menu-overlay");
    let closeMenu = $$("#header .close-menu");
    let header = $$("#header");

    menuButton.click(function(evt){

      menuOverlay.toggleClass("hide");
      menuMobile.toggleClass("hide");
    });

    menuOverlay.click(function(evt){

      menuMobile.addClass("hide");
      menuOverlay.addClass("hide");
    });

    closeMenu.click(function(evt){

      menuMobile.addClass("hide");
      menuOverlay.addClass("hide");
    });


    ///Check ActivePage
    let menuMobileUL = $$(".menu-mobile-ul");
    let menuDefaultUL = $$(".menu-default-ul");

    Utilities.activePage(menuDefaultUL,window.location.host === "localhost" ? "Madefrio" : null,function(item){
      item.find("a").css({color: "rgb(120,196,237)"});
    });

    Utilities.activePage(menuMobileUL,window.location.host === "localhost" ? "Madefrio" : null,function(item){
      item.find("a").css({color: "rgb(120,196,237)"});
    });

    //Log-out
   $$("#header .log-out").click(function(){
      $$.ajax({
        url: urls.baseUrl + "authentication/",
        type: "post",
        data: {action: "logout"},
        success: function(){

          window.location.href = urls.baseUrl;
        }
      });
    });

  }());

  (function setupMainContent(){

    let mainContent = $$(".main-wrapper #main-content");

    // if(mainContent.length > 0){

    //   mainContent.css("min-height", window.innerHeight - 340);
    //   $$(window).resize(function(){

    //     mainContent.css("min-height", window.innerHeight - 340);
    //   });
    // }

  }());

  (function subscribeNewsLetter() {

    $$("#footer .newsletter form").submit(function(e){
      e.preventDefault();
      let data = $$(this).serialize();

      $$.ajax({
        url: urls.baseUrl + "subscribeNewsLetter/",
        type: "post",
        data: data,
        success: function(r){

          $$("#footer .newsletter form")[0].reset();
          $$("#footer .newsletter form input[type=email]").val("");
        }
      });
    });

  }());

  (function setLanguage(){

    let startTo = sessionStorage.getItem("current_lang");
    let nativeLang = "pt";

    let isFirstTranslate = true;

    $$(".cont-select-languages select").on("change",function(){

      let to = $$(this).val();
      let from = isFirstTranslate ? nativeLang : sessionStorage.getItem("current_lang");
      from = from ? from : nativeLang;

      ETranslate({
        from: from,
        to: to,
        native: nativeLang
      });

      sessionStorage.setItem("current_lang",to);
      isFirstTranslate = false;
    });

    if(startTo && startTo !== nativeLang) {
      $$(".cont-select-languages select option").optionIsEqual(startTo, function (index, value) {

        value.selected = true;
        $$(".cont-select-languages select").trigger("change");
      },true);
    }
  }());

});