/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appDashboard', ['routeDashboard']);
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

    let it = setInterval(function(){
      if(sessionStorage.getItem("isLogged") === "true" && customerFirebase){

        let firestore = customerFirebase.firestore();
        let proposalsCount = 0;
        let productsCount = 0;
        let advertisersCount = 0;
        let usersCount = 0;

        firestore.collection("Proposals").onSnapshot(function(data){
          let hasChanges = false;
          data.docChanges().forEach(function (obj) {
            if(obj.type === "added"){

              hasChanges = true;
              proposalsCount+= 1;
            }else if(obj.type === "removed"){

              hasChanges = true;
              proposalsCount-= 1;
            }
          });

          if(hasChanges){

            $scope.proposalsCount = proposalsCount;
            $scope.$apply();
          }
        });

        firestore.collection("Products").onSnapshot(function(data){
          let hasChanges = false;
          data.docChanges().forEach(function (obj) {
            if(obj.type === "added"){

              hasChanges = true;
              productsCount+= 1;
            }else if(obj.type === "removed"){

              hasChanges = true;
              productsCount-= 1;
            }
          });
          if(hasChanges){

            $scope.productsCount = productsCount;
            $scope.$apply();
          }
        });

        firestore.collection("Profiles").onSnapshot(function(data){
          let hasChanges = false;
          data.docChanges().forEach(function (obj) {
            if(obj.type === "added"){

              hasChanges = true;
              usersCount+= 1;
            }else if(obj.type === "removed"){

              hasChanges = true;
              usersCount-= 1;
            }
          });
          if(hasChanges){

            $scope.usersCount = usersCount;
            $scope.$apply();
          }
        });

        firestore.collection("Profiles").where("advertsEnabled","==",true).onSnapshot(function(data){
          let hasChanges = false;
          data.docChanges().forEach(function (obj) {
            if(obj.type === "added"){

              hasChanges = true;
              advertisersCount+= 1;
            }else if(obj.type === "removed"){

              hasChanges = true;
              advertisersCount-= 1;
            }
          });
          if(hasChanges){

            $scope.advertisersCount = advertisersCount;
            $scope.$apply();
          }
        });


        clearInterval(it);
      }
    },0);


    overlayVisibility(false);
  });


  /*********************************** Utilities ***********************************/

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }
