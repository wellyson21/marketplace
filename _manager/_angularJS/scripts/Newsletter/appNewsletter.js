/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appNewsletter', ['routeNewsletter']);
  /*********************************** Initializer **********************************/

  app.run(function($rootScope){

    $rootScope.baseUrl = urls.baseUrl;
    $rootScope.appUrl = urls.appUrl;
    $rootScope.managerUrl = urls.managerUrl;

    $rootScope.backPage = function () {
      window.history.go(-1);
    };
  });


  /*********************************** Controllers *********************************/

  app.controller('mainController', function($scope) {

    overlayVisibility(false);

    let it = setInterval(function(){
      if(isLogged && customerFirebase){

        $$("#newsletterForm").submit(function() {

          let d = $$(this).serialize();

          if(!$$("#textEditor").html().trim()){return;}

          d.message = "<div style='width: 100%;'></div><div>"+ $$("#textEditor").html() + "</div>";

          $.ajax({
            url: urls.baseUrl + "manager/sendNewsletter/",
            type: "post",
            data: d,
            success: function(r){
              if(parseInt(r) === 1){

                setAlert("success");
              }else{

                setAlert("error");
              }
            }
          });
        });

        customTextEditor();
        clearInterval(it);
      }
    });

    function setAlert(type){

      let form = $$("#newsletterForm");
      let alterS = form.find(".alert-success");
      let alterE = form.find(".alert-danger");

      if(type === "success"){

        alterE.fadeOut(0);
        alterS.fadeIn(450).delay(2000).fadeOut(450);
      } else {

        alterS.fadeOut(0);
        alterE.fadeIn(450).delay(2000).fadeOut(450);
      }

    }

  });


  /*********************************** Utilities ***********************************/

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }

  function customTextEditor(){

  let toolBar = {
    onBold: function() {
      document.execCommand("bold", false, null);
    },
    onItalic: function() {
      document.execCommand("italic", false, null);
    },
    onUnderline: function() {
      document.execCommand("underline", false, null);
    },

    onTextAlignLeft: function() {
      document.execCommand("justifyLeft", false, null);
    },
    onTextAlignCenter: function() {
      document.execCommand("justifyCenter", false, null);
    },

    onInsertUnorderedList: function() {
      document.execCommand("insertUnorderedList", false, null);
    },

    onCreateLink: function() {

      let url = prompt("Enter a url:");

      if(!/(http|https)/.test(url)) { url = "http://" + url; }

      if(url) {
        document.execCommand("createLink", false, url);
      }
    },
    onRemoveLink: function() {
      document.execCommand("unlink", false, null);
    },

    onUndo: function() {
      document.execCommand("undo", false, null);
    },
    onRedo: function() {
      document.execCommand("redo", false, null);
    }
  };

  $$("#etbBold").click(toolBar.onBold);
  $$("#etbItalic").click(toolBar.onItalic);
  $$("#etbUnderline").click(toolBar.onUnderline);
  $$("#etbTextAlignLeft").click(toolBar.onTextAlignLeft);
  $$("#etbTextAlignCenter").click(toolBar.onTextAlignCenter);
  $$("#etbListUl").click(toolBar.onInsertUnorderedList);
  $$("#etbLink").click(toolBar.onCreateLink);
  $$("#etbUnlink").click(toolBar.onRemoveLink);
  $$("#etbUndo").click(toolBar.onUndo);
  $$("#etbRedo").click(toolBar.onRedo);

}

