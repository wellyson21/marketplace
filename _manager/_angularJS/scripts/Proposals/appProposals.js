/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('appProposals', ['routeProposals']);

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

    overlayVisibility(true);

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

            getProposals($scope.paginationLinks[$$(li).attr("data-documentId").trim() * 1]);
          }
        }
      });
    }

    function getProposals(startAt, limit = 30){

      overlayVisibility(true);
      $$(".no-data").css("opacity",0);

      if($scope.isGeneratePaginationLinks){

        $scope.hasPaginationLinks = false;
        $scope.isGeneratePaginationLinks = false;
        $scope.paginationLinks = [];

        if(getProposals.linksOnSnaphot){

          getProposals.linksOnSnaphot();
        }

        let isFirstFetch = true,
          addedCount = 0;
        getProposals.linksOnSnaphot = customerFirebase.firestore().collection("Proposals").where("to","==","system").orderBy("date", "desc").onSnapshot(function(data){

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

      if(getProposals.onSnaphot){

        getProposals.onSnaphot();
      }

      let isLoading;
      let collection = startAt ? customerFirebase.firestore().collection("Proposals").where("to","==","system").orderBy("date", "desc").startAt(startAt).limit(limit) :  customerFirebase.firestore().collection("Proposals").where("to","==","system").orderBy("date", "desc").limit(limit);

      $scope.proposals = [];
      getProposals.onSnaphot = collection.onSnapshot(function(data){

        let totalData = data.docChanges().length;

        isLoading = isLoading === undefined;

        if(totalData === 0){

          noDataVisibility(true);
          overlayVisibility(false);
          $scope.$apply();
          return;
        }

        data.docChanges().forEach(function(change){

          let type = change.type;
          let docData = change.doc.data();
          docData.id = change.doc.id;
          // let docDate = docData.date.toDate();
          // let docDate = docData.date.toDate();

          // docData.date = docDate.getFullYear() + "-" + ( docDate.getMonth() <= 9 ? "0" + docDate.getMonth() : docDate.getMonth()) + "-" + ( docDate.getDate() <= 9 ? "0" + docDate.getDate() : docDate.getDate());

          if(type === "added") {

            $scope.proposals.push(docData);
            $scope.$apply();
          } else if(type === "removed") {

            $scope.proposals.forEach(function(data, i){
              if(data.id === docData.id) {
                $scope.proposals.splice(i,1);
                $scope.$apply();
              }
            });
          }
        });

        $$(".no-data").css("opacity",1);
        setTimeout(function() {
          overlayVisibility(false);
        }, 2500);
      });

      return collection;
    }

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
        url: urls.baseUrl + "manager/ajaxProposals/",
        type: "post",
        data: {action: "remove",id: id},
        success: function(r){

          console.log(r);

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
 
      let it = setInterval(function(){
        if(isLogged && customerFirebase){

          Utilities.activeButton({
            elements: page.find(".header li"),
            style: {
              backgroundColor: "rgba(85, 138, 167, 0.76)",
              color: "white"
            },
            callback: function(li){
    
              // $$(".loader").removeClass("hide");
              $$(".no-proposal").css("opacity",0);
              $scope.isGeneratePaginationLinks = true;
              getProposals();
            }
          });

          clearInterval(it);
        }
      },0);

    

    },100);

  });


  /*********************************** Utilities ***********************************/

  function overlayVisibility(state = false) {

    $$("#overlay").css({ display: ( state ? "table" : "none" ) });   
  }

  function noDataVisibility(string){

    $$(".no-data").css("opacity",1);
    $$(".infoState .loader").addClass("hide");
    $$(".infoState .noData p").text(string);
    $$(".infoState .noData").removeClass("hide");
  }

