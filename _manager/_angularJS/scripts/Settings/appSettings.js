/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appSettings', ['routeSettings']);

  /*********************************** Initializer **********************************/

  app.run(function($rootScope){

    $rootScope.baseUrl = urls.baseUrl;
    $rootScope.appUrl = urls.appUrl;
    $rootScope.managerUrl = urls.managerUrl;

    $rootScope.backPage = function () {
      window.history.go(-1);
    };
  });

  // isLogged = true;

  /*********************************** Controllers *********************************/

  app.controller('mainController', function($scope) {


    let form = $$("#settingsForm"), page = form;

    overlayVisibility(true);

    let loginIt = setInterval(function(){
      if(window.isLogged && customerFirebase){

        customerFirebase.firestore().collection("General").get().then(function(result){

          overlayVisibility(false);

          if(result.docs.length > 0){

            let settings = result.docs[0];

            $scope.data = {
              logo: settings.data().logo,
              systemName: settings.data().systemName,
              fee: settings.data().monthlyFee,
              clientId: settings.data().paypal.clientId,
              appSecret: settings.data().paypal.appSecret,
              facebook: settings.data().socialMedias.facebook,
              instagram: settings.data().socialMedias.instagram,
              twitter: settings.data().socialMedias.twitter,
              email: settings.data().mail.email,
              password: settings.data().mail.password,
            };

            $scope.$apply();
          }
        });

        form.submit(function(e){
          e.preventDefault();

          let data = ($$(this).serialize());

          overlayVisibility(true);

          // Disable submit button
          $$(this).add("button[type=submit]")[0].disabled = true;

          let that = this;
          customerFirebase.firestore().collection("General").get().then(function(result){

            if(result.docs.length > 0){

              $$(that).add("button[type=submit]")[0].disabled = false;
              overlayVisibility(false);

              result.docs[0].ref.set({
                systemName: data.systemName,
                monthlyFee: data.monthlyFee,
                mail:{
                  email: data.email,
                  password: data.password,
                },
                paypal: {
                  clientId: data.clientId.trim(),
                  appSecret: data.appSecret.trim(),
                },
                socialMedias: {
                  facebook: data.facebook,
                  instagram: data.instagram,
                  twitter: data.twitter
                }
              },{merge: true}).then(function(){

                setAlert("success");
              }).catch(function(){

                setAlert("error");
              });
            }else{

              customerFirebase.firestore().collection("General").add({
                systemName: data.systemName,
                monthlyFee: data.monthlyFee,
                mail:{
                  email: data.email,
                  password: data.password,
                },
                paypal: {
                  clientId: data.clientId.trim(),
                  appSecret: data.appSecret.trim(),
                },
                socialMedias: {
                  facebook: data.facebook,
                  instagram: data.instagram,
                  twitter: data.twitter
                }
              }).then(function(){

                setAlert("success");
              }).catch(function(){

                setAlert("error");
              });
            }
          });

        });

        //Alert messages
        function setAlert(type){

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

        clearInterval(loginIt);
      }
    });

    $scope.choseImage = function(evt){

      page.find(".logo .image").trigger("click");
      page.find(".logo .image").change(function(){

        let storageRef = firebase.storage().ref();

        let reader = new FileReader();

        let self = this;

        reader.onloadend = function(r){

          r = reader.result;

          let extension = self.files[0].name.split(".");
          extension = extension[extension.length - 1].trim();

          let filePath = "logo";
          let fileName = new Date().getTime() + "." + extension;
          let ref = storageRef.child(filePath+"/"+fileName);
          let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"/"+fileName)+"?alt=media";


          if($scope.data){

            let url_r = $scope.data.logo;

            if(url_r){

              storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
            }
          }

          page.find(".logo").css("opacity",0.5);
          page.find(".logo img").attr("src",r);


          ref.putString(r,"data_url").then(function(){

            customerFirebase.firestore().collection("General").get().then(function(result) {

              if (result.docs.length > 0) {

                page.find(".logo img").attr("src",url);
                result.docs[0].ref.set({logo: url},{merge: true});
                page.find(".logo").css("opacity",1);
                page.find(".logo .image").attr("value","");
              }
            });

            // $$.ajax({
            //   url: urls.baseUrl + "manager/ajaxSettings",
            //   type: "post",
            //   data: {action: "update", profile: {photo: url}},
            //   success: function(r){}
            // });
          });

        };

        reader.readAsDataURL(this.files[0]);
      });

    };

  });


  /*********************************** Utilities ***********************************/

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }
