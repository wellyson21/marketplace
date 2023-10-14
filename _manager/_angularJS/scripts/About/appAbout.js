/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appAbout', ['routeAbout']);
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

        let about = customerFirebase.firestore().collection("About");

        about.get().then(function(data){

          data = data.docs[0].data();

          $$("#textEditor").html(data.longDescription);
          $scope.data = data;
          $scope.$apply();
        });

        $$(".aboutForm").submit(function() {

          let shortDescription = $$(this).serialize().shortDescription;

          customerFirebase.firestore().collection("About").get().then(function (data) {
            data.docs[0].ref.set({
              shortDescription: shortDescription,
              longDescription: $$("#textEditor").html().trim()
            },{merge: true}).then(function(){

              setAlert("success");
            }).catch(function(){

              setAlert("error");
            });
          });
        });


        clearInterval(it);
      }
    });

    function setAlert(type){

      let form = $$(".aboutForm");

      let alterS = form.find(".alert-success");
      let alterE = form.find(".alert-danger");

      if(type === "success"){

        alterE.fadeOut(0);
        alterS.fadeIn(450);
        setTimeout(function(){alterS.fadeOut(450)},2000);
      } else {

        alterS.fadeOut(0);
        alterE.fadeIn(450);
        setTimeout(function(){alterE.fadeOut(450);},2000);
      }

    }

    settingImagesBlock($scope);
    customTextEditor();
  });


  /*********************************** Utilities ***********************************/

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }


function settingImagesBlock($scope){

    $scope.uploadMainImage = function(){
      let input = $$(".inputMainImage");
      let image = $$(".mainImage");

      input.trigger("click");
      input.change(function(){

        previewImageToUpload(input, image);
      });
    };

    $scope.uploadSecondaryImages = function(ix){
      let input = $$(".inputSecondaryImages"+ix);
      let image = $$(".secondaryImages"+ix);

      input.trigger("click");
      input.change(function(){

        previewImageToUpload(input, image);
      });
    };

    function previewImageToUpload(input, img){

      let reader = new FileReader();

      reader.onload = function(event) {

        $$(img).css({ display: "block" });
        img.attr('src', event.target.result);
      };

      reader.readAsDataURL(input[0].files[0]);
      $$(img).animate({opacity: 1},{duration: 1500});
    }
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