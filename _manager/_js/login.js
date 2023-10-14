
  $$(function(){

    window.localStorage.removeItem("companyInfo");

    overlayVisibility(false);

    $$(".loginForm").submit(function(e){
      e.preventDefault();

      let formData = $$(this).serialize();

      overlayVisibility(true);

      firebase.initializeApp({
        apiKey: "AIzaSyC4GA9E2hVb5ARjZ1jJIpfrlL3p6lVp9tc",
        authDomain: "madefrio-977a2.firebaseapp.com",
      });

      customerFirebase = firebase.app();
      firebaseInialized = true;

      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then(function(response){

        let data = { action: "login" };

        $$.ajax({
          url: urls.baseUrl + "manager/ajaxAuthentication/",
          type: "POST",
          data: data,
          success: function(response){

            let data = JSON.parse(response);

            if(data.isLogged){

              sessionStorage.setItem("isLogged",true);

              Swal.fire({
                title: 'All right',
                text: 'Wait a moment..',
                type: 'success'
              });
      
              setTimeout(function(){
                window.location.reload(true);
              }, 2000);              
            } else {

              Swal.fire({
                text: 'Server is temporarily unavailable.\n Try again later.',
                type: 'error',
                confirmButtonText: 'Close'
              });

              overlayVisibility(false);
            }
          }
        });        
      }, function() {

        Swal.fire({
          title: 'Invalid email or password.',
          text: 'Please try again.',
          type: 'error',
          confirmButtonText: 'Close'
        });

        overlayVisibility(false);
      });

    });
  });

  /*********************************** Utilities ***********************************/

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });
  }
