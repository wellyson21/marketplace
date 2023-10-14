/**
 * Created by Lucas on 16/09/2017.
 */


  var isLogged;
  let customerFirebase;
  let firebaseInialized;

  (function firebaseSettings(){

    isLogged = sessionStorage.getItem("isLogged") ? sessionStorage.getItem("isLogged") : false;

    $$.ajax({
      url: urls.baseUrl + "/manager/firebaseSettings/",
      type: "POST",
      data: {},
      success: function(response){
        if(response !== "false"){

          try{

            firebase.initializeApp(JSON.parse(response));
            customerFirebase = firebase.app();
            firebaseInialized = true;
          }catch(e){

            checkLogin();
            return;
          }
        }
      }
    })

  checkLogin();


    setInterval(function(){

      checkLogin();
    },600000);


    function checkLogin(){
      $$.ajax({
        url: urls.baseUrl + "manager/ajaxAuthentication/",
        type: "POST",
        data: {action: "status"},
        success: function(response){
    
          response = parseInt(response);
    
          if(response === 1 && !isLogged){
    
            $$.ajax({
              url: urls.baseUrl + "manager/ajaxAuthentication/",
              type: "POST",
              data: {action: "logout"},
              success: function() {
    
                window.location.href = urls.baseUrl + "manager/";
              }
            });
          }
        }
      });
    }
  }());


  $$(function(){

    (function settingsMenu(){

      (function activeBtnMenu(){

        setTimeout(function(){
          Utilities.activePage($$('.sidebar-wrapper ul'),"manager",function(e){

            $$(e).addClass("active");

            $$(e).parents().map(function(k,v){

              if($$(v).hasClass("nav-item")){
                $$(v).addClass("active");
                $(v).trigger("click");
              }
              if($$(v).hasClass("sidebar-wrapper")){
                return false;
              }
            });
          });
        },500);

      }());
    })();

    (function logout(){

      $$(".btnLogout").click(function(evt){
        evt.preventDefault();
        evt.stopPropagation();


        console.log(true);


        $$.ajax({
          url: urls.baseUrl + "manager/ajaxAuthentication",
          type: 'post',
          data: {action: 'logout'},
          success: function(response){
            let data = JSON.parse(response);

            console.log(response);

            if(!data.isLogged){
              window.localStorage.removeItem("companyInfo");
              sessionStorage.removeItem("isLogged");
              window.location.reload(true);
            }
          }
        });
      });
    }());

  });
