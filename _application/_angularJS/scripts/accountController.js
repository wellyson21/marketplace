  var app = angular.module("accountApp",["accountRoute",'ngSanitize']);


  var firebaseConfig = {
    apiKey: "AIzaSyBJ2h-uquqCx9SxVYNexgaIqwqIDQPM-vc",
    // authDomain: "madefrio.firebaseapp.com",
    // databaseURL: "https://madefrio.firebaseio.com",
    projectId: "madefrio",
    storageBucket: "madefrio-977a2.appspot.com",
    // messagingSenderId: "800608987163",
    // appId: "1:800608987163:web:dca695ad8682e6fd"
  };

  firebase.initializeApp(firebaseConfig);

  let customerFirebase = firebase.app();

  app.run(function($rootScope){

    $rootScope.appUrl = urls.appUrl;
    $rootScope.systemUrl = urls.systemUrl;

  });


  app.controller("proposalController",function($scope){

    // let proposals = [{
    //   id: "dedefefefef",
    //   name: "PromotionName",
    //   productDescription:{
    //     short: "Short Description",
    //     long: "Long Description",
    //   },
    //   date: new Date(),
    //   price: "57.35",
    //   thumbnail: "http://localhost/Madefrio/_application/_medias/_images/assets/profile.png",
    //   country: "Brazil",
    //   state: "GO",
    //   city: "Santo Antõnio do descoberto",
    //   secondariesImages: ["http://localhost/Madefrio/_application/_medias/_images/assets/profile.png","http://localhost/Madefrio/_application/_medias/_images/assets/profile.png"],
    //   info: {
    //     thumbnail: "http://localhost/Madefrio/_application/_medias/_images/assets/profile.png",
    //     name: "Name",
    //     email: "email@gmail.com",
    //     phone: "+55 61 123456789"
    //   }
    // }];
    // $scope.proposals = proposals;

    $$(".loader").removeClass("hide");


    $$.ajax({
      url: urls.baseUrl + "account/profile/",
      type: "post",
      data: {action: "get"},
      success: function(r){

        let data;
        try {
          data = JSON.parse(r);
        }catch(e){return;}

        $scope.profile = data;
        $scope.$apply();
      }
    });

    $scope.showInfo = function($event){

      let box = $$($event.target).parents("li").find(".bottom-info");
      if(box.css("display") === "none"){

        box.fadeIn();
      }else{

        box.fadeOut();
      }
    };

    $scope.cancelProposal = function($event,index, id){

      $$.ajax({
        url: urls.baseUrl + "account/proposals/",
        type: "post",
        data: {action: "remove",id: id},
        success: function(r){

          if(parseInt(r) === 1){

            $scope.proposals.splice(index,1);
            $scope.$apply();
          }
        }
      });
    };

    $scope.removeReceivedProposal = function($event){

      $scope.cancelProposal($event);
    };

    setTimeout(function(){

      let page = $$("#proposalPage");

      $scope.hasPaginationLinks = false;

      Utilities.activeButton({
        elements: page.find(".header li"),
        style: {
          backgroundColor: "rgba(85, 138, 167, 0.76)",
          color: "white"
        },
        callback: function(li){

          $$(".loader").removeClass("hide");
          $$(".proposals-container").css("opacity",0);
          $$(".no-proposal").css("opacity",0);

          let type = parseInt($$(li).attr("data-index")) === 0 ? "from" : "to";
          sessionStorage.setItem("proposalTabIndex",parseInt($$(li).attr("data-index")) + "");
          $scope.generatePaginationLinks = true;
          getProposals(type);
        }
      });
    },100);

    function setPagination(){

      let paginationContainer = $$(".pagination-box .pagination-container");

      Utilities.pagination({
        prev: paginationContainer.find(".prev"),
        next: paginationContainer.find(".next"),
        contLi: paginationContainer.find("li"),
        source: "firebase",
        show: 5,
        active: "activePage",
        desActive: "disabledPage",
        complete: function(li,isFirstLoad){

          if(!isFirstLoad){

            let type = parseInt(sessionStorage.getItem("proposalTabIndex")) ? parseInt(sessionStorage.getItem("proposalTabIndex")) : 0;
            type = type === 0 ? "from" : "to";

            getProposals(type,$scope.paginationLinks[$$(li).attr("data-documentId").trim() * 1]);
          }
        }
      });
    }

    function getProposals(type ,startAt = null){

      startAt = startAt ? startAt : "";
      $$(".no-data").css("opacity",0);
      $$(".loader").removeClass("hide");
      $$(".no-proposal").css("opacity",0);
      $$(".proposals-container").css("opacity",0);

      if($scope.generatePaginationLinks){

        $scope.hasPaginationLinks = false;
        $scope.paginationLinks = [];
        $scope.$apply();
      }

      $$.ajax({
        url: urls.baseUrl + "account/proposals/",
        type: "post",
        data: {action: "get",type: type, offset: startAt},
        success: function(r){

          let data;
          try{

            data = JSON.parse(r);
          }catch(e){ return; }

          $$(data["data"]).map(function(k,v){
            data["data"][k]["price"] = Utilities.priceFormat(v.price);
            data["data"][k]["customerPrice"] = Utilities.priceFormat(v.customerPrice);
          });

          $scope.proposals = data["data"];

          if($scope.generatePaginationLinks){

            $scope.hasPaginationLinks = data["paginationInfo"].length > 1 ? true : false;
            $scope.paginationLinks = data["paginationInfo"];
            $scope.generatePaginationLinks = false;
            $scope.$apply();

            setTimeout(function(){
              if(data["paginationInfo"]){

                setPagination();
              }
            },300);
          }else{

            $scope.$apply();
          }

          $$(".loader").addClass("hide");
          $$(".no-proposal").css("opacity",1);
          $$(".proposals-container").css("opacity",1);
        }
      });
    }

  });


  app.controller("advertsController",function($scope, $dataBridge){

    // let adverts = [{
    //   id: "dedefefefef",
    //   name: "AdvertName",
    //   productDescription:{
    //     short: "Short Description",
    //     long: "Long Description",
    //   },
    //   date: new Date(),
    //   price: "57.35",
    //   thumbnail: "http://localhost/Madefrio/_application/_medias/_images/assets/profile.png",
    //   country: "Brazil",
    //   state: "GO",
    //   city: "Santo Antõnio do descoberto",
    //   secondariesImages: ["http://localhost/Madefrio/_application/_medias/_images/assets/profile.png","http://localhost/Madefrio/_application/_medias/_images/assets/profile.png"]

    // }];

    loaderVisibility(true);
    $scope.loading = true;

    $$.ajax({
      url: urls.baseUrl + "/account/profile-general/",
      type: "post",
      data: {},
      success: function(r){

        let data;
        try {
          data = JSON.parse(r);
        }catch(e){return;}

        $scope.general = data["general"];
        $scope.profile = data["profile"];
        $scope.loading = false;

        if($scope.general.hasPayed){

          ///Adverts
          $scope.generatePaginationLinks = true;
          getAdverts();
        }else {

          loaderVisibility(false);
        }

        $scope.$apply();

      }
    });

    function setPagination(){

      let paginationContainer = $$(".pagination-box .pagination-container");

      Utilities.pagination({
        prev: paginationContainer.find(".prev"),
        next: paginationContainer.find(".next"),
        contLi: paginationContainer.find("li"),
        source: "firebase",
        show: 5,
        active: "activePage",
        desActive: "disabledPage",
        complete: function(li,isFirstLoad){

          if(!isFirstLoad){

            getAdverts($scope.paginationLinks[$$(li).attr("data-documentId").trim() * 1]);
          }
        }
      });
    }

    function getAdverts(startAt = null){

      startAt = startAt ? startAt : "";
      $$(".no-data").css("opacity",0);
      $$(".loader").removeClass("hide");
      $$(".no-proposal").css("opacity",0);
      $$(".proposals-container").css("opacity",0);

      if($scope.generatePaginationLinks){

        $scope.hasPaginationLinks = false;
        $scope.paginationLinks = [];
        $scope.$apply();
      }

      $scope.loading = true;
      $scope.$apply();

      $$.ajax({
        url: urls.baseUrl + "account/adverts",
        type: "post",
        data: {action: "get", offset: startAt},
        success: function(r){

          let data;
          try{

            data = JSON.parse(r);
          }catch(e){ return; }

          $scope.adverts = data["data"];
          $scope.loading = false;

          if($scope.generatePaginationLinks){

            $scope.hasPaginationLinks = data["paginationInfo"].length > 1 ? true : false;
            $scope.paginationLinks = data["paginationInfo"];
            $scope.generatePaginationLinks = false;
            $scope.$apply();

            setTimeout(function(){
              if(data["paginationInfo"]){

                setPagination();
              }
              settingsFormattedPrices();
            },300);
          }else{

            $scope.$apply();
            setTimeout(function(){
              settingsFormattedPrices();
            },300);
          }

          $$(".loader").addClass("hide");
          $$(".no-proposal").css("opacity",1);
          $$(".proposals-container").css("opacity",1);
        }
      });
    }

    // $scope.adverts = adverts;

    $scope.showInfo = function($event){

      let box = $$($event.target).parents("li").find(".bottom-info");
      if(box.css("display") === "none"){

        box.fadeIn();
      }else{

        box.fadeOut();
      }
    };

    $scope.removeAdvert = function($event, index,id){
      $event.stopPropagation();

      let advert = $scope.adverts[index];

      setTimeout(function(index){

        $scope.adverts.splice(index,1);
        $scope.$apply();
      },1000,index);

      $$.ajax({
        url: urls.baseUrl + "account/adverts",
        type: "post",
        data: {action: "remove", id: id},
        success: function(r){

          let images = advert.secondariesImages;
          if(advert.thumbnail){

            images.push(advert.thumbnail);
          }
          removeFiles(images);
        }
      });

    };


    function removeFiles(urls){

      if(!urls){ return; }

      let storageRef = customerFirebase.storage().ref();

      $$(urls).map(function(k,url){
        if(url){

          storageRef.child(decodeURIComponent(url.substr(url.lastIndexOf("/") + 1).split("?")[0])).delete();
        }
      });

    }

    $scope.viewAdvert = function(data){

      $dataBridge.set({action: "view",advert: data});
      redirect("adverts/view");
    };

    $scope.backPage = function () {

      $dataBridge.set({action: "edit"});
      redirect("adverts/create-update");
    };

    $scope.addAdvert = function($event){

      $dataBridge.set({action: "create"});
      redirect("adverts/create-update");
    };

    $scope.editAdvert = function($event,data){

      $event.stopPropagation();
      $dataBridge.set({action: "edit", advert: data});
      redirect("adverts/create-update");
    };

    $$("#advertsPage .payTax form").submit(function(){

      $$.ajax({
        url: urls.baseUrl + "paypal",
        type: "post",
        data: {action: "buy"},
        success: function(r){

          window.location.href = r;
        }
      });
    });

  });

  app.controller("viewAdvertController",function($scope, $dataBridge){

    if($dataBridge.get().reload === false){

      redirect("adverts");
      return;
    }

    let advert;

    if($$($dataBridge.get()).length){

      $scope.advert = $dataBridge.get().advert;
      advert = $scope.advert;
      $dataBridge.set({reload: false});
    } else{

      redirect("adverts");
      return;
    }

    settingsFormattedPrices();

    $scope.editAdvert = function(e){

      e.stopPropagation();
      $dataBridge.set({action: "edit", advert: advert});
      redirect("adverts/create-update");
    };

    $scope.backPage = function () {

      $dataBridge.set({action: "view"});
      redirect("adverts");
    };

  });

  app.controller("advertsCreateUpdateController",function($scope,$dataBridge){

    let action = $dataBridge.get().action;
    let currentAdvert = $dataBridge.get().advert;
    let form = $$("#formPromotion");

    if($dataBridge.get().action === "create"){

      $scope.title = "Create";
    } else if($dataBridge.get().action === "edit"){

      $scope.action = $scope.title = "Edit";
      $scope.advert = $dataBridge.get().advert;
      form.find("#textEditor").html($dataBridge.get().advert.productDescription.long);
    } else {

      redirect("adverts");
      return;
    }

    let categories,categoriesName = [];

    (function (){

      $$.ajax({
        url: urls.baseUrl + "getProducts/",
        data: {categories: true},
        type: "post",
        success: function(r){

          let data;
          try{
            data = JSON.parse(r);
          }catch (e){return false;}

          categories = data.data;
          $scope.categories = categories;

          $scope.$apply();

          if(currentAdvert){

            setTimeout(function (){
              form.find(".categories option").optionIsEqual(currentAdvert.category,function(index,option){

                option.selected = true;
                $$(".categories").trigger("change");
              },true);

              form.find(".countries option").optionIsEqual(currentAdvert.country,function(index,option){

                option.selected = true;
                $$(".countries").trigger("change");

                setTimeout(function(){
                  form.find(".states option").optionIsEqual(currentAdvert.state,function(index,option){

                    option.selected = true;
                  },true);
                },350)
              },true);

              setTimeout(function () {

                form.find(".submit").removeAttr("disabled");
              },350);
            },350);
          }else{

            setTimeout(function () {

              form.find(".countries").trigger("change");
              form.find(".submit").removeAttr("disabled");
            },200);
          }

        }
      });
    }());


    $scope.backPage = function () { redirect("adverts"); };

    let removedImages = [];
    let running = false;

    /*** countries and states ***/
    let countries_data = {
      brazil: ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
    };

    $scope.removeImage = function(e){
      e.stopPropagation();

      let index = parseInt($$(e.target).attr("data-index").trim());
      let url = $scope.advert.secondariesImages[index];
      $scope.advert.secondariesImages.splice(index,1);
      removedImages.push(decodeURIComponent(url.substr(url.lastIndexOf("/") + 1).split("?")[0]));
    };

    form.find(".countries").change(function(evt){

      evt.stopPropagation();
      let country = $$(this).val().toLowerCase().trim();

      if(country === "others"){

        form.find(".other-location").removeClass("hide");
        form.find(".states").childs().map(function(k,v){ if(k > 0){ $$(v).remove(); } });
      }else{

        form.find(".other-location").addClass("hide");
        form.find(".states").childs().map(function(k,v){ if(k > 0){ $$(v).remove(); } });

        if(countries_data[country]){
          $$(countries_data[country]).map(function(k,v){
            let input = $$("<option>",{ innerHTML: v });
            $$(input).append(form.find(".states"));
          });
        }
      }
    });

    form.submit(function(e){
      e.preventDefault();

      if(running){ return; }

      running = true;

      let formData = $$(this).serialize();

      let storageRef = customerFirebase.storage().ref();
      let mainImage = $$(form)[0].querySelectorAll('.contMainImage input[type=file]');
      let slideImages = $$(form)[0].querySelectorAll('.contOthersImages input[type=file]');
      let uploaded = 0;
      let fromUploaded = 0;
      let filesProcessed = 0;
      let hasChangesInFiles = false;
      let hasChangesInText = false;
      let advert;

      if(action === "create"){

        hasChangesInText = true;
        advert = {
          accesss_count: 0,
          thumbnail: "",
          name: $$(form).find("input[name='name']").val().trim(),
          name_lowercase: $$(form).find("input[name='name']").val().trim().toLowerCase(),
          price: parseFloat($$(form).find("input[name='price']").val().trim()).toFixed(2),
          country: $$(form).find("select[name='country']").val().trim().toLowerCase() === "others" ? $$(form).find("input[name='otherCountry']").val().trim() : $$(form).find("select[name='country']").val().trim().toLowerCase(),
          state: $$(form).find("select[name='state']").val().trim().toLowerCase() === "others" ? $$(form).find("input[name='otherState']").val().trim() : $$(form).find("select[name='state']").val().trim().toLowerCase(),
          city: $$(form).find("input[name='city']").val().trim(),
          category: $$(form).find("select[name='category']").val().trim(),
          productDescription: {
            // short: $$(form).find("textarea[name='shortDescription']").val().trim(),
            long: "<div style='font-size:17px;'>" + form.find("#textEditor").html().trim() + "</div>"
          },
          date: new Date(),
          secondariesImages: []
        };
      }else{

        advert = {
          thumbnail: $scope.advert.thumbnail,
          name: $$(form).find("input[name='name']").val().trim(),
          name_lowercase: $$(form).find("input[name='name']").val().trim().toLowerCase(),
          price: parseFloat($$(form).find("input[name='price']").val().trim()).toFixed(2),
          country: $$(form).find("select[name='country']").val().trim().toLowerCase() === "others" ? $$(form).find("input[name='otherCountry']").val().trim() : $$(form).find("select[name='country']").val().trim().toLowerCase(),
          state: $$(form).find("select[name='state']").val().trim().toLowerCase() === "others" ? $$(form).find("input[name='otherState']").val().trim() : $$(form).find("select[name='state']").val().trim().toLowerCase(),
          city: $$(form).find("input[name='city']").val().trim(),
          category: $$(form).find("select[name='category']").val().trim(),
          productDescription: {
            // short: $$(form).find("textarea[name='shortDescription']").val().trim(),
            long: form.find("#textEditor").html().trim()
          },
          date: $scope.advert.date,
          secondariesImages: $scope.advert.secondariesImages
        };

        if(advert.category !== currentAdvert.category ||advert.price !== currentAdvert.price || advert.country !== currentAdvert.country || advert.state !== currentAdvert.state || advert.city !== currentAdvert.city || advert.name !== currentAdvert.name || advert.productDescription.long !== currentAdvert.productDescription.long){

          hasChangesInText = true;
        }else{

          hasChangesInText = false;
        }
      }


      //Make Upload Main files
      $$(mainImage).map(function(k,ifile){

        if(ifile.files.length > 0){

          fromUploaded++;
          let file = ifile.files[0];
          let fileReader = new FileReader();
          fileReader.onloadend = onLoaded;
          onLoaded.file = file;
          onLoaded.index = k;

          function onLoaded(){

            let extension = this.onloadend.file.name.split(".");
            extension = extension[extension.length - 1].trim();

            let fileName = new Date().getTime() + "." + extension;
            let filePath = "adverts";
            let ref = storageRef.child(filePath + "/" + fileName);
            let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"\%2F"+fileName)+"?alt=media";

            if(advert["thumbnail"].trim() !== url.trim()){


              if($scope.advert){

                let url_r = $scope.advert.thumbnail;
                if(url_r){

                  storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
                  // removedImages.push(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0]));
                }
              }

              advert["thumbnail"] = url;
              hasChangesInFiles = true;
              ref.putString(fileReader.result,"data_url").then(function(r){uploaded++;}).catch(function(e){ console.log(e); });
            }
            filesProcessed++;
          }
          fileReader.readAsDataURL(file);
        }
      });

      //Make Upload slideImage files
      $$(slideImages).map(function(k,ifile){

        if(ifile.files.length > 0){

          fromUploaded++;
          let file = ifile.files[0];
          let fileReader = new FileReader();

          onLoaded.file = file;
          onLoaded.index = k;

          fileReader.onloadend = onLoaded;

          function onLoaded(){

            let extension = this.onloadend.file.name.split(".");
            extension = extension[extension.length - 1].trim();

            let fileName = new Date().getTime() + "." + extension;
            let filePath = "adverts";
            let ref = storageRef.child(filePath + "/" + fileName);
            let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"\%2F"+fileName)+"?alt=media";

            if(advert["secondariesImages"][this.onloadend.index] === undefined || advert["secondariesImages"][this.onloadend.index].trim() !== url.trim()){

              let index = this.onloadend.index;

              if($scope.advert) {

                let url_r = $scope.advert.secondariesImages[index];
                if (url_r) {

                  storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
                  // removedImages.push(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0]));
                }
              }

              advert["secondariesImages"][this.onloadend.index] = url;
              hasChangesInFiles = true;
              ref.putString(fileReader.result,"data_url").then(function(){uploaded++;});
            }

            filesProcessed++;
          }
          fileReader.readAsDataURL(file);
        }

      });

      //Make Update
      let intervalPF = setInterval(function(){
        if(filesProcessed === fromUploaded){

          if(removedImages.length > 0){
            removedImages.forEach(function(path){

              storageRef.child(path).delete();
            });
          }

          if(hasChangesInFiles){

            let interval = setInterval(function(){
              if(uploaded === fromUploaded){

                if(action === "create"){

                  $$.ajax({
                    url: urls.baseUrl + "account/adverts",
                    type: "post",
                    data: {action: "add", advert: $$(advert).encode()},
                    success: function(r){

                      if (r === "true") {

                        settingAlert("Promotion sent successfully.", 2);
                      }else{

                        settingAlert("Failed to send promotion. Please try again.", 3);
                      }

                      running = false;
                    }
                  });

                  // customerFirebase.firestore().collection("Promotions").add(advert).then(function() {
                  //
                  //   settingAlert("Promotion sent successfully.", 2);
                  // }).catch(function () {
                  //
                  //   settingAlert("Failed to send promotion. Please try again.", 3);
                  // });
                }else{

                  let ad = advert;
                  ad.id = currentAdvert.id.trim();

                  $$.ajax({
                    url: urls.baseUrl + "account/adverts",
                    type: "post",
                    data: {action: "update", advert: $$(ad).encode()},
                    success: function(r){

                      if (r === "true") {

                        settingAlert("Promotion updated successfully.", 2);
                      }else{

                        settingAlert("Failed to update promotion. Please try again.", 3);
                      }

                      // currentAdvert = ad;
                      running = false;

                    }
                  });

                //   customerFirebase.firestore().collection("Promotions").doc(currentAdvert.id.trim()).get().then(function(result) {
                //     if (result.exists) {
                //       result.ref.set(advert, {merge: true}).then(function () {
                //
                //         settingAlert("Promotion updated successfully.", 2);
                //       }).catch(function () {
                //
                //         settingAlert("Failed to Updated promotion. Please try again.", 3);
                //       });
                //     }
                //   });
                }

                $dataBridge.set({reload: true});
                clearInterval(interval);
              }
            },200);
          }else if(hasChangesInText){

            if(action === "create"){

              $$.ajax({
                url: urls.baseUrl + "account/adverts",
                type: "post",
                data: {action: "add", advert: $$(advert).encode()},
                success: function(r){

                  if (r === "true") {

                    settingAlert("Promotion sent successfully.", 2);
                  }else{

                    settingAlert("Failed to send promotion. Please try again.", 3);
                  }

                  running = false;
                }
              });

              // customerFirebase.firestore().collection("Promotions").add(advert).then(function() {
              //
              //   settingAlert("Promotion sent successfully.", 2);
              // }).catch(function () {
              //   settingAlert("Failed to send promotion. Please try again.", 3);
              // });

            }else {

              let ad = advert;
              ad.id = currentAdvert.id.trim();

              $$.ajax({
                url: urls.baseUrl + "account/adverts",
                type: "post",
                data: {action: "update", advert: $$(ad).encode()},
                success: function(r){

                  if (r === "true") {

                    settingAlert("Promotion updated successfully.", 2);
                  }else{

                   settingAlert("Failed to update promotion. Please try again.", 3);
                  }

                  // currentAdvert = ad;
                  running = false;
                }
              });

              // customerFirebase.firestore().collection("Promotions").doc(currentAdvert.id.trim()).get().then(function (result) {
              //   if (result.exists) {
              //     result.ref.set(advert, {merge: true}).then(function () {
              //       settingAlert("Promotion updated successfully.", 2);
              //     }).catch(function (e) {
              //
              //       settingAlert("Failed to update promotion. Please try again.", 3);
              //     });
              //   }
              // });
            }

            $dataBridge.set({reload: true});
          }
          clearInterval(intervalPF);
        }
      },0);
    });

    settingImagesBlock($scope);
    $dataBridge.set({reload: false});
    customTextEditor();
  });


  app.controller("profileController",function($scope, $dataBridge){

    let page = $$("#profilePage");

    $scope.hasData = true;

    $$.ajax({
      url: urls.baseUrl + "account/profile/",
      type: "post",
      data: {action: "get"},
      success: function(r){

        let data;
        try {
          data = JSON.parse(r);
        }catch(e){return;}

        $scope.data = data;
        $scope.hasData = !(!data.address.country && !data.address.state && !data.address.city && !data.address.postalCode && !data.address.addressLine);

        $scope.$apply();

        $$(".photo-container img").css("opacity",1);
      }
    });

    page.find(".edit-button").click(function(evt){

      $dataBridge.set({action: "edit",profile: $scope.data});
      redirect("profile/edit");
    });

    $scope.choseImage = function(evt){

      page.find(".photo-container .image").trigger("click");
      page.find(".photo-container .image").on("change",function(){

        let storageRef = firebase.storage().ref();

        let reader = new FileReader();

        let self = this;

        reader.onloadend = function(r){

          r = reader.result;

          page.find(".photo-container img").attr("src",r);

          let extension = self.files[0].name.split(".");
          extension = extension[extension.length - 1].trim();

          let filePath = "profiles";
          let fileName = new Date().getTime() + "." + extension;
          let ref = storageRef.child(filePath+"/"+fileName);
          let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"%2F"+fileName)+"?alt=media";

          if($scope.data){

            let url_r = $scope.data.photo;
            if(url_r){

              storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
            }
          }

          ref.putString(r,"data_url").then(function(){

            $$.ajax({
              url: urls.baseUrl + "account/profile/",
              type: "post",
              data: {action: "update", profile: {photo: url}},
              success: function(r){}
            });
          });

        };

        reader.readAsDataURL(this.files[0]);
      });

    };

  });

  app.controller("profileEditController",function($scope, $dataBridge){

    $scope.backPage = function () { redirect("profile"); };

    let data = $dataBridge.get("data");

    if(data.action !== "edit" || !data.profile){

      redirect("profile");
      return;
    }

    $scope.data = data.profile;

    let form = $$("#profilePage .profileForm");
    form.submit(function(evt){

      let data = form.serialize();

      if(data.currentPassword){
        if($scope.data.password.trim() !== data.currentPassword.trim()){

          form.find(".success").fadeOut(0);
          form.find(".error").html("Senha atual esta incorreta.").fadeIn().delay(3000).fadeOut();
          return;
        }

        if(data.newPassword && data.confirmNewPassword && data.newPassword.trim() !== data.confirmNewPassword.trim()){
          
          form.find(".success").fadeOut(0);
          form.find(".error").html("Sua nova senha não é igual a confirmação").fadeIn().delay(3000).fadeOut();
          return;
        }

        if(!data.newPassword || !data.confirmNewPassword || !data.newPassword && !data.confirmNewPassword){

          form.find(".success").fadeOut(0);
          form.find(".error").html("Sua nova senha deve ter o tamanho minimo de 4 digitos.").fadeIn().delay(3000).fadeOut();
          return;
        }

        if(data.newPassword && data.newPassword.trim().length < 4){
          form.find(".success").fadeOut(0);
          form.find(".error").html("Sua nova senha deve ter o tamanho minimo de 4 digitos.").fadeIn().delay(3000).fadeOut();
          return;
        }

        data = {
          name: data.name,
          address: {
            country: data.country,
            state: data.state,
            city: data.city,
            addressLine: data.addressLine,
            postalCode: data.postalCode,
          },
          contacts: {
            phone: data.phone
          },
          password: data.newPassword.trim()
        };

      }else{

        data = {
          name: data.name,
          address: {
            country: data.country,
            state: data.state,
            city: data.city,
            addressLine: data.addressLine,
            postalCode: data.postalCode,
          },
          contacts: {
            phone: data.phone
          }
        };
      }
      
      $$.ajax({
        url: urls.baseUrl + "account/profile/",
        type: "post",
        data: {action: "update", profile: $$(data).encode()},
        success: function(r){

          if(r === "true"){

            $scope.data.password = data.password;
            $scope.$apply();
            form.find(".error").fadeOut(0);
            form.find(".success").html("Alterações salvas com sucesso.").fadeIn().delay(3000).fadeOut();
          }else{

            form.find(".success").fadeOut(0);
            form.find(".error").html("Falha ao Salvar Alterações.").fadeIn().delay(3000).fadeOut();
          }
        }
      });

    });

  });


  app.factory('$dataBridge', function() {
    let valor = {};

    function set(data) { valor = data; }
    function get() { return valor; }

    return { set: set, get: get }
  });


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

  function loaderVisibility(isVisible){

    if(isVisible){

      $$(".loader").removeClass("hide");
    } else {

      $$(".loader").addClass("hide");
    }
  }

  function settingAlert(message, type){

    if (type === 1) {

      $$("#alert").text(message).addClass("alert-primary").fadeIn(500);
    } else if (type === 2) {

      // $$("#alert").removeClass("alert-primary");

      $$("#alert").text(message).addClass("success").fadeIn(500).delay(5000).fadeOut(500, function () {
      // $$("#alert").text(message).addClass("alert-success").fadeIn(500).delay(5000).fadeOut(500, function () {

        $$("#alert").removeClass("success");
        // $$("#alert").removeClass("alert-success");
      });
    } else if (type === 3) {

      // $$("#alert").removeClass("alert-primary");

      $$("#alert").text(message).addClass("error").fadeIn(500).delay(8000).fadeOut(500, function () {
      // $$("#alert").text(message).addClass("alert-danger").fadeIn(500).delay(8000).fadeOut(500, function () {

        $$("#alert").removeClass("error");
        // $$("#alert").removeClass("alert-danger");
      });
    }

  }

  function noDataVisibility(string){

    $$(".infoState .loader").addClass("hide");
    $$(".infoState .noData p").text(string);
    $$(".infoState .noData").removeClass("hide");
  }

  function redirect(destiny){

    location.href = urls.baseUrl + "account/#!/" + destiny;
  }

  function settingsFormattedPrices() {

    let products = $$('.product_price, .price');

    products.map(function(k,v) {

      let value = $$(v).text().replace('R$','');
      let integer = value.split('.')[0];
      let decimal = value.split('.')[1];

      if(value > 999.99) {
        let slice1 = integer.substring(integer.length - 3, 0);
        let slice2 = integer.substring(integer.length, integer.length - 3);

        integer = slice1+'.'+slice2;
      }

      value = 'R$' + integer + ( decimal ? ',<span style="font-size: .75em">'+decimal+'</span>' : ',<span style="font-size: .75em">00</span>' );

      $$(v).html(value);
    });

  }

  function toFloat(value){

    if(!value){

      return "0";
    }

    let price = parseFloat(value) + "";
    let priceSplited = price.split(".");

    let finalPrice = "";
    let lastIndex = priceSplited.length - 1;

    $$(priceSplited).map(function(k,v){
      if(lastIndex == k){
        finalPrice += v.length > 2 ? v+".00" : "."+v;
      }else{
        finalPrice += v;
      }
    });


    return finalPrice;
  }