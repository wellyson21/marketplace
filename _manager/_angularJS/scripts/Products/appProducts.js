/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appProducts', ['routeProducts',"ngSanitize"]);

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

  app.controller('mainController', function($scope,$dataBridge) {

    let adverts = [{
      id: "dedefefefef",
      name: "AdvertName",
      productDescription:{
        short: "Short Description",
        long: "Long Description"
      },
      date: new Date(),
      price: "57.35",
      thumbnail: "http://localhost/Madefrio/_application/_medias/_images/assets/profile.png",
      country: "Brazil",
      state: "GO",
      city: "Santo Antõnio do descoberto",
      secondariesImages: ["http://localhost/Madefrio/_application/_medias/_images/assets/profile.png","http://localhost/Madefrio/_application/_medias/_images/assets/profile.png"]

    }];
    // $scope.adverts = adverts;

    // let limit = null;
    $scope.isGeneratePaginationLinks = true;

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

            getProducts($scope.paginationLinks[$$(li).attr("data-documentId").trim() * 1]);
          }
        }
      });
    }

    function getProducts(startAt, limit = 20,tabIndex = 0){

      limit = limit ? limit : 20;

      overlayVisibility(true);
      $$(".no-data").css("opacity",0);

      if($scope.isGeneratePaginationLinks){

        $scope.hasPaginationLinks = false;
        $scope.isGeneratePaginationLinks = false;
        $scope.paginationLinks = [];
        $scope.$apply();

        if(getProducts.linksOnSnaphot){

          getProducts.linksOnSnaphot();
        }

        let isFirstFetch = true,
            addedCount = 0;

        let collection = tabIndex === 0 ? customerFirebase.firestore().collection("Products").where("advertiser","==","system").orderBy("date", "desc") : customerFirebase.firestore().collection("Products").where("status","==","revision").orderBy("date", "desc");

        getProducts.linksOnSnaphot = collection.onSnapshot(function(data){

          let docs = isFirstFetch ? data.docs : data.docChanges();
          let docsLength = isFirstFetch ? data.docs.length : data.docChanges().length;

          if(isFirstFetch && docsLength > limit){
            isFirstFetch = false;

            for(let i = 0;i < docsLength;i+=limit){

              let doc = docs[i];
              if(!doc){break;}
              $scope.paginationLinks.push(doc);
            }

            setTimeout(function(){

              setPagination();
              $scope.hasPaginationLinks = true;
              $scope.$apply();
            },1000);
            return true;
          }

          let isApply = false;
          docs.forEach(function(obj){

            if(obj.type === "added"){

              if(addedCount === limit){

                $scope.paginationLinks.push(obj.doc);
                isApply = true;
                addedCount = 0;
              }
              addedCount++;
            }else if(obj.type === "removed"){

              for(let l of $scope.paginationLinks){
                if(l.id === obj.doc.id){

                  $scope.paginationLinks.splice(l,1);
                }
              }
            }
          });

          if(isApply){

            setTimeout(function(){

              setPagination();
              $scope.hasPaginationLinks = true;
              $scope.$apply();
            },1000);
          }

        });

      }

      if(getProducts.onSnaphot){

        getProducts.onSnaphot();
      }

      let isLoading;
      let collection;

      if(tabIndex === 0){

        collection = startAt ? customerFirebase.firestore().collection("Products").where("advertiser","==","system").where("status","==","released").orderBy("date", "desc").startAt(startAt).limit(limit) :  customerFirebase.firestore().collection("Products").where("advertiser","==","system").where("status","==","released").orderBy("date", "desc").limit(limit);
      }else{

        collection = startAt ? customerFirebase.firestore().collection("Products").where("status","==","revision").orderBy("date", "desc").startAt(startAt).limit(limit) :  customerFirebase.firestore().collection("Products").where("status","==","revision").orderBy("date", "desc").limit(limit);
      }

      $scope.adverts = [];
      $scope.tabIndex = tabIndex;
      $scope.$apply();

      getProducts.onSnaphot = collection.onSnapshot(function(data){

        let totalData = data.docChanges().length;

        isLoading = isLoading === undefined;

        if(totalData === 0){

          $$(".no-data").css("opacity",1);
          noDataVisibility(true);
          overlayVisibility(false);
          return;
        }

        data.docChanges().forEach(function(change){

          let type = change.type;
          let docData = change.doc.data();
          docData.id = change.doc.id;
          // let docDate = docData.date.toDate();
          // docData.date = docDate.getFullYear() + "-" + ( docDate.getMonth() <= 9 ? "0" + docDate.getMonth() : docDate.getMonth()) + "-" + ( docDate.getDate() <= 9 ? "0" + docDate.getDate() : docDate.getDate());

          if(type === "added") {
            if($scope.tabIndex === 0){

              if(docData.status === "released"){

                $scope.adverts.push(docData);
              }
            }else{

              if(docData.status === "revision"){

                $scope.adverts.push(docData);
              }
            }

            $scope.$apply();
          } else if(type === "modified") {

            $scope.adverts.forEach(function(data, i){
              if(data.id === docData.id) {
                $scope.adverts[i] = docData;
                $scope.$apply();
              }
            });
          } else if(type === "removed") {

            $scope.adverts.forEach(function(data, i){
              if(data.id === docData.id) {
                $scope.adverts.splice(i,1);
                $scope.$apply();
              }
            });
          }
        });

        $$(".no-data").css("opacity",1);
        setTimeout(function() {
          settingsFormattedPrices();
          overlayVisibility(false);
        }, 2500);
      });
    }

    $$.ajax({
      url: urls.baseUrl + "account/general/",
      type: "post",
      data: {action: "all"},
      success: function(r){

        let data;
        try {
          data = JSON.parse(r);
        }catch(e){return;}

        $scope.general = data;
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

    $scope.removeAdvert = function($event, index,id){

      let advert = $scope.adverts[index];

      $event.stopPropagation();
      setTimeout(function(index){

        // $scope.adverts.splice(index,1);
        // $scope.$apply();
      },1000,index);

      $$.ajax({
        url: urls.baseUrl + "manager/ajaxAdverts/",
        type: "post",
        data: {action: "remove", id: id},
        success: function(r){

          console.log(r);

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

      let isEdit = $scope.tabIndex === 0;
      $dataBridge.set({action: "view",advert: data,isEdit: isEdit});
      redirect("view");
    };

    $scope.backPage = function () {

      $dataBridge.set({action: "edit"});
      redirect("");
    };


    

    //Default
    $scope.addAdvert = function($event){

      $dataBridge.set({action: "create"});
      redirect("create-update");
    };

    $scope.editAdvert = function($event,data){

      $event.stopPropagation();
      $dataBridge.set({action: "edit", advert: data});
      redirect("create-update");
    };


    //Revision
    $scope.acceptAdvert = function($event, index, id){
      $event.stopPropagation();

      let li = $$($event.target).parents("li");

      customerFirebase.firestore().collection("Products").doc(id).get().then(function(result) {
        if (result.exists) {
          result.ref.set({status: "released"}, {merge: true}).then(function () {

            // $scope.adverts.splice(index,1);
            // $scope.$apply();
            if(index < 0){

              redirect("");
            }

            li.css("opacity",1);
          }).catch(function () {

            li.css("opacity",1);
          });
        }
      });

    };

    $scope.refuseAdvert = function($event,index, id){
      $event.stopPropagation();

      let li = $$($event.target).parents("li");
      li.css("opacity",0.5);

      let modal = Swal.fire({
        input: 'textarea',
        inputPlaceholder: 'Descreva o motivo da rejeição.',
        inputAttributes: {
          'aria-label': 'Descreva o motivo da rejeição.',
          required: true
        },
        showCancelButton: true
      });

      modal.then(function(r){
        if(r.dismiss){

          li.css("opacity",1);
        }else{

          customerFirebase.firestore().collection("Products").doc(id).get().then(function(result) {
            if (result.exists) {
              result.ref.set({message: r.value, status: "returned"}, {merge: true}).then(function () {

                // $scope.adverts.splice(index,1);
                // $scope.$apply();

                if(index < 0){

                  redirect("");
                }

                li.css("opacity",1);
              }).catch(function () {

                li.css("opacity",1);
              });
            }
          });
        }

      });
    };


    setTimeout(function(){

      let page = $$("#advertsPage");


      let it = setInterval(function(){
        if(isLogged && customerFirebase){

          Utilities.activeButton({
            elements: page.find(".switch li"),
            triggerC: sessionStorage.getItem("productsTabIndex") ? sessionStorage.getItem("productsTabIndex") * 1 : 0,
          style: {
              backgroundColor: "rgba(85, 138, 167, 0.76)",
              color: "white"
            },
            callback: function(li){
    
              // $$(".loader").removeClass("hide");
              $$(".no-proposal").css("opacity",0);
              let tabIndex = $$(li).attr("data-tabIndex") * 1;
              sessionStorage.setItem("productsTabIndex",tabIndex + "");
              $scope.isGeneratePaginationLinks = true;
              getProducts(null,null,tabIndex);
            }
          });
          
          clearInterval(it);
        }
      },0);

   
    },100);


  });


  app.controller('viewController', function($scope,$dataBridge) {

    if($dataBridge.get().reload === false){

      redirect("");
      return;
    }

    let advert;

    if($$($dataBridge.get()).length){

      $scope.advert = $dataBridge.get().advert;
      $scope.isEdit = $dataBridge.get().isEdit;
      advert = $scope.advert;
      $dataBridge.set({reload: false});
    } else{

      redirect("");
      return;
    }


    $scope.editAdvert = function(e){

      e.stopPropagation();
      $dataBridge.set({action: "edit", advert: advert});
      redirect("create-update");
    };

    $scope.backPage = function () {

      $dataBridge.set({action: "view"});
      redirect("");
    };

    //Revision
    $scope.acceptAdvert = function($event, index, id){
      $event.stopPropagation();

      let li = index < 0 ? $$(".customCard-body") : $$($event.target).parents("li");

      customerFirebase.firestore().collection("Products").doc(id).get().then(function(result) {
        if (result.exists) {
          result.ref.set({status: "released"}, {merge: true}).then(function () {

            if(index < 0){

              redirect("");
            }

            li.css("opacity",1);
          }).catch(function () {

            li.css("opacity",1);
          });
        }
      });

    };

    $scope.refuseAdvert = function($event,index, id){
      $event.stopPropagation();

      let li = index < 0 ? $$(".customCard-body") : $$($event.target).parents("li");

      li.css("opacity",0.5);

      let modal = Swal.fire({
        input: 'textarea',
        inputPlaceholder: 'Descreva o motivo da rejeição.',
        inputAttributes: {
          'aria-label': 'Descreva o motivo da rejeição.',
          required: true
        },
        showCancelButton: true
      });

      modal.then(function(r){
        if(r.dismiss){

          li.css("opacity",1);
        }else{

          customerFirebase.firestore().collection("Products").doc(id).get().then(function(result) {
            if (result.exists) {
              result.ref.set({message: r.value, status: "returned"}, {merge: true}).then(function () {

                if(index < 0){

                  redirect("");
                }

                li.css("opacity",1);
              }).catch(function () {

                li.css("opacity",1);
              });
            }
          });
        }

      });
    };

    overlayVisibility(false);
  });


  app.controller('createUpdateController', function($scope,$dataBridge) {

    let action = $dataBridge.get().action;
    let currentAdvert = $dataBridge.get().advert;
    let form = $$("#formPromotion");

    // currentAdvert = {
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
    //   category: "Partes e Peças",
    //   type: "SMC-65 4/6/8",
    //   city: "Santo Antõnio do descoberto",
    //   secondariesImages: ["http://localhost/Madefrio/_application/_medias/_images/assets/profile.png","http://localhost/Madefrio/_application/_medias/_images/assets/profile.png"]
    //
    // };

    if($dataBridge.get().action === "create"){

      $scope.title = "Create";
    } else if($dataBridge.get().action === "edit"){

      $scope.action = $scope.title = "Edit";
      $scope.advert = currentAdvert;
      // $scope.advert = $dataBridge.get().advert;
      form.find("#textEditor").html($dataBridge.get().advert.productDescription.long);
    } else {

      redirect("");
      return;
    }

    let categories, categoriesName = [];

    customerFirebase.firestore().collection("ProductsCategories").get().then(function(data){

      data = data.docs[0].data();
      categories = data.data;
      $scope.categories = categories;

      $scope.$apply();

      if(currentAdvert){

        setTimeout(function (){

          form.find(".categories option").optionIsEqual(currentAdvert.category,function(index,option){

            option.selected = true;
            form.find(".categories").trigger("change");
          },true);

          form.find(".countries option").optionIsEqual(currentAdvert.country,function(index,option){

            option.selected = true;
            $$(".countries").trigger("change");

            setTimeout(function(){
              form.find(".states option").optionIsEqual(currentAdvert.state,function(index,option){

                option.selected = true;
              },true);
            },350);
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

    });

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

    form.find(".countries").change(function(){

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
    }).trigger("change");




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
          advertiser: "system",
          visible: true,
          status: "released",
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
          advertiser: "system",
          visible: true,
          status: "released",
          productDescription: {
            // short: $$(form).find("textarea[name='shortDescription']").val().trim(),
            long: form.find("#textEditor").html().trim()
          },
          date: $scope.advert.date,
          secondariesImages: $scope.advert.secondariesImages
        };

        if(advert.category !== currentAdvert.category || advert.price !== currentAdvert.price || advert.country !== currentAdvert.country || advert.state !== currentAdvert.state || advert.city !== currentAdvert.city || advert.name !== currentAdvert.name  || advert.productDescription.long !== currentAdvert.productDescription.long){

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
            let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"/"+fileName)+"?alt=media";

            if(advert["thumbnail"].trim() !== url.trim()){


              if($scope.advert){

                let url_r = $scope.advert.thumbnail;
                if(url_r){

                  storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
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
            let url = "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/"+encodeURIComponent(filePath+"/"+fileName)+"?alt=media";

            if(advert["secondariesImages"][this.onloadend.index] === undefined || advert["secondariesImages"][this.onloadend.index].trim() !== url.trim()){

              let index = this.onloadend.index;

              if($scope.advert) {

                let url_r = $scope.advert.secondariesImages[index];
                if (url_r) {

                  storageRef.child(decodeURIComponent(url_r.substr(url_r.lastIndexOf("/") + 1).split("?")[0])).delete();
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

                  customerFirebase.firestore().collection("Products").add(advert).then(function() {

                    running = false;
                    settingAlert("Produto enviado com sucesso.", 2);
                  }).catch(function () {

                    running = false;
                    settingAlert("Falha ao enviar produto. Por favor tente novamente.", 3);
                  });
                }else{

                  customerFirebase.firestore().collection("Products").doc(currentAdvert.id.trim()).get().then(function(result) {
                    if (result.exists) {
                      result.ref.set(advert, {merge: true}).then(function () {

                        let ad = advert;
                        ad.id = currentAdvert.id.trim();
                        currentAdvert = ad;

                        running = false;
                        settingAlert("Produto Atualizado com sucesso.", 2);
                      }).catch(function () {

                        running = false;
                        settingAlert("Falha ao atualizar produto. Por favor tente novamente.", 3);
                      });
                    }
                  });
                }

                $dataBridge.set({reload: true});
                clearInterval(interval);
              }
            },200);
          }else if(hasChangesInText){

            if(action === "create"){

              customerFirebase.firestore().collection("Products").add(advert).then(function() {

                running = false;
                settingAlert("Produto enviado com sucesso.", 2);
              }).catch(function () {

                running = false;
                settingAlert("Falha ao enviar produto. Por favor tente novamente.", 3);
              });

            }else {


              customerFirebase.firestore().collection("Products").doc(currentAdvert.id.trim()).get().then(function(result) {
                if (result.exists) {
                  result.ref.set(advert, {merge: true}).then(function () {

                    let ad = advert;
                    ad.id = currentAdvert.id.trim();
                    currentAdvert = ad;

                    running = false;
                    settingAlert("Produto Atualizado com sucesso.", 2);
                  }).catch(function () {

                    running = false;
                    settingAlert("Falha ao atualizar produto. Por favor tente novamente.", 3);
                  });
                }
              });
            }

            $dataBridge.set({reload: true});
          }else{

            running = false;
          }
          clearInterval(intervalPF);
        }
      }, 0);
    });

    settingImagesBlock($scope);
    $dataBridge.set({reload: false});
    customTextEditor();

    overlayVisibility(false);
  });


  /*********************************** Utilities ***********************************/
  app.factory('$dataBridge', function() {
    let valor = {};

    function set(data) { valor = data; }
    function get() { return valor; }

    return { set: set, get: get }
  });

  app.directive('convertToNumber', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
        ngModel.$formatters.push(function(val) {
          return '' + val;
        });
      }
    };
  });

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }

  function settingAlert(message, type){

  if (type === 1) {

    $$("#alert").text(message).addClass("alert-primary").fadeIn(500);
  } else if (type === 2) {

    // $$("#alert").removeClass("alert-primary");

    // $$("#alert").text(message).addClass("success").fadeIn(500).delay(5000).fadeOut(500, function () {
      $$("#alert").text(message).addClass("alert-success").fadeIn(500).delay(5000).fadeOut(500, function () {

      // $$("#alert").removeClass("success");
      $$("#alert").removeClass("alert-success");
    });
  } else if (type === 3) {

    // $$("#alert").removeClass("alert-primary");

    // $$("#alert").text(message).addClass("error").fadeIn(500).delay(8000).fadeOut(500, function () {
      $$("#alert").text(message).addClass("alert-danger").fadeIn(500).delay(8000).fadeOut(500, function () {

      // $$("#alert").removeClass("error");
      $$("#alert").removeClass("alert-danger");
    });
  }

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

        $$(img).removeAttr("hidden");
        $$(img).animate({opacity: 1},{duration: 500});
      };

      reader.readAsDataURL(input[0].files[0]);
      $$(img).css({opacity: 0});
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

  function redirect(destiny){

  location.href = urls.baseUrl + "manager/products/#!/" + destiny;
  }

  function noDataVisibility(string){

    $$(".infoState .loader").addClass("hide");
    $$(".infoState .noData p").text(string);
    $$(".infoState .noData").removeClass("hide");
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

