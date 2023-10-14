/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appHome', ['routeHome']);
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

        let storageRef = customerFirebase.storage().ref();
        let about = customerFirebase.firestore().collection("Home");
        let homeData, slide;

        about.get().then(function(data){

          data = data.docs[0].data();
          $scope.data = data;
          homeData = data;
          $scope.$apply();
          overlayVisibility(false);

          setTimeout(function(){

            let mainSlide = $$("#slideMain");

            slide = Utilities.slideBlockUnique({
              contSlide: mainSlide.find(".contSlide"),
              contItemsSlide: mainSlide.find(".contElemSlide"),
              itemsSlide: mainSlide.find(".contElemSlide li"),
              prevBtn: mainSlide.find(".prev"),
              nextBtn: mainSlide.find(".next"),
              playBtn: mainSlide.find(".play"),
              stopBtn: mainSlide.find(".stop"),
              contDiscs: mainSlide.find(".circles"),
              animateSlide: "disable",
              resizeOpacity: true
            });

            mainSlide.animate({opacity: 1});

          },100);

        });

        $$("#homeForm").submit(function() {

          let d = $$("#homeForm").serialize();

          customerFirebase.firestore().collection("Home").get().then(function (data) {
            data.docs[0].ref.set({
              whatDoing: {
                firstBlock:{
                  image: homeData.whatDoing.firstBlock.image,
                  title: d.firstBlockTitle,
                  text: d.firstBlockDescription,
                },
                secondBlock: {
                  image: homeData.whatDoing.secondBlock.image,
                  title: d.secondBlockTitle,
                  text: d.secondBlockDescription,
                }
              }
            },{merge: true}).then(function(){

              setAlert("success");
            }).catch(function(){

              setAlert("error");
            });
          });
        });

        $scope.choseSlideImage = function(evt,index){

          let li = $$(evt.target).parents("li");
          let input = li.find(".ipfile");
          let img = li.find(".mainImage");

          input.trigger("click");

          uploadImage(execAfterChangeSlide,$scope,input,img,homeData,index);

        };

        $scope.addSlideImage = function(evt){

          let self = $$(evt.target).parents("button");
          let input = self.find(".ipfile");

          input.trigger("click");

          uploadImage(execAfterChangeSlide,$scope,input,null,homeData,null,true);
        };

        $scope.removeSlideImage = function(index){

          let url = homeData.slideImages[index];

          $$("#slideMain").css("opacity",0.5);

          let url_r = url;

          if(url_r){

            storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
          }

          customerFirebase.firestore().collection("Home").get().then(function(data){
            if(data.docs.length > 0){

              homeData.slideImages.splice(index,1);

              data.docs[0].ref.set({slideImages: homeData.slideImages},{merge: true});

              $$("#slideMain").css("opacity",1);

              $scope.$apply();
              execAfterChangeSlide();
            }
          });
        };

        function execAfterChangeSlide(){

            let mainSlide = $$("#slideMain");

            slide = Utilities.refreshSlideBlockUnique({
              contSlide: mainSlide.find(".contSlide"),
              contItemsSlide: mainSlide.find(".contElemSlide"),
              itemsSlide: mainSlide.find(".contElemSlide li"),
              prevBtn: mainSlide.find(".prev"),
              nextBtn: mainSlide.find(".next"),
              playBtn: mainSlide.find(".play"),
              stopBtn: mainSlide.find(".stop"),
              contDiscs: mainSlide.find(".circles"),
              animateSlide: "disable",
              resizeOpacity: true
            });
        }

        $$(window).resize(function(){

            if(slide){

              setTimeout(function(){

                slide.defineWidthCont(false);
              },350);
            }
        });

        $scope.choiceBlocksImage = function(evt,index){

          let div = $$(evt.target).parent();
          let input = div.find(".ipfile");
          let img = div.find("img");
          index = parseInt(index);

          if(isNaN(index)){return;}

          if(homeData){
            input.trigger("click");
            uploadImage(null,$scope,input,img,homeData,index,null,true);
          }
        }

        clearInterval(it);
      }
    });

    function setAlert(type){

      let form = $$("#homeForm");

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

  });



  /*********************************** Utilities ***********************************/

  function uploadImage(callback = function(){},$scope,input,img = null,homeData,index = null,push = false,blocks = false) {
    let storageRef = customerFirebase.storage().ref();

    callback = typeof callback === "function" ? callback : function(){};

    input.change(function(){

      let reader = new FileReader();
      let self = this;

      reader.onload = function(){

        let r = reader.result;

        if(img != null){ img[0].src = r; }

        if(blocks){

          $$(img).parent().css("opacity",0.5);
        }else{

          $$("#slideMain").css("opacity",0.5);
        }

        let extension = self.files[0].name.split(".");
        extension = extension[extension.length - 1].trim();

        let filePath = blocks ? "home" : "slideMain";
        let fileName = new Date().getTime() + "." + extension;
        let ref = storageRef.child(filePath+"/"+fileName);
        let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"/"+fileName)+"?alt=media";

        if(homeData){
          if(blocks){

            let url_r = index === 1 ? homeData.whatDoing.firstBlock.image : homeData.whatDoing.secondBlock.image;
            if(url_r){
  
              storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
            }
          }else if(index != null){
            
            let url_r = homeData.slideImages[index];
            if(url_r){

              storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
            }
          }
        }

        ref.putString(r,"data_url").then(function(){
          customerFirebase.firestore().collection("Home").get().then(function(data){
            if(data.docs.length > 0){
              if(blocks){

                homeData.whatDoing[ index === 1 ? "firstBlock" : "secondBlock" ]["image"] = url;
                data.docs[0].ref.set({whatDoing: homeData.whatDoing},{merge: true});
                $$(img).parent().css("opacity",1);
              }else{

                if(push){

                  homeData.slideImages.push(url);
                }else{
  
                  homeData.slideImages[index] = url;
                }
  
                data.docs[0].ref.set({slideImages: homeData.slideImages},{merge: true});
                $$("#slideMain").css("opacity",1);
              }

              $scope.$apply();
              callback();
            }
          });
        });

      };

      reader.readAsDataURL(this.files[0]);
    });
  }

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }

