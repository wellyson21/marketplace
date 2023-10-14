  var route = angular.module("accountRoute",["ngRoute"]);

  route.config(function($routeProvider){


    $routeProvider.when("/",{
      templateUrl: urls.appUrl + '_angularJS/views/proposal.html',
      controller: "proposalController"
    });

    $routeProvider.when("/proposal",{
      templateUrl: urls.appUrl + '_angularJS/views/proposal.html',
      controller: "proposalController"
    });


    $routeProvider.when("/adverts",{
      templateUrl: urls.appUrl + '_angularJS/views/ad.html',
      controller: "advertsController"
    });

    $routeProvider.when("/adverts/view",{
      templateUrl: urls.appUrl + '_angularJS/views/viewAdvert.html',
      controller: "viewAdvertController"
    });

    $routeProvider.when("/adverts/create-update",{
      templateUrl: urls.appUrl + '_angularJS/views/createUpdateAdvert.html',
      controller: "advertsCreateUpdateController"
    });


    $routeProvider.when("/profile",{
      templateUrl: urls.appUrl + '_angularJS/views/profile.html',
      controller: "profileController"
    });
    $routeProvider.when("/profile/edit",{
      templateUrl: urls.appUrl + '_angularJS/views/profileEdit.html',
      controller: "profileEditController"
    });
  });