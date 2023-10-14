/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appContacts', ['routeContacts']);
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

        let about = customerFirebase.firestore().collection("Contact");
        let contactsData;
        about.get().then(function(data){

          data = data.docs[0].data();
          $scope.data = data;
          contactsData = data;
          $scope.$apply();
          overlayVisibility(false);
        });


        $$("#contactsForm").submit(function() {

          let d = $$(this).serialize();

          customerFirebase.firestore().collection("Contact").get().then(function (data) {
            data.docs[0].ref.set({
              address: {
                addressLine: d.addressLine,
                state: d.state,
                city: d.city,
                postalCode: d.postalCode,
              },
              contacts:{
                email: {value: d.email, label: d.emailLabel},
                phone: {value: d.phone, label: d.phoneLabel},
                whatsapp: {value: d.whatsapp, label: contactsData.contacts.whatsapp.label}
              },
              position: {
                latitude: d.latitude,
                longitude: d.longitude
              }
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

      let form = $$("#contactsForm");

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

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }

