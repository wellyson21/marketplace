/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('routeProducts',["ngRoute"]);

  app.config(function($routeProvider){

    $routeProvider.when("/",{
      templateUrl: urls.managerUrl + '_angularJS/views/Products/main.html',
      controller: 'mainController'
    });

    $routeProvider.when("/view",{
      templateUrl: urls.managerUrl + '_angularJS/views/Products/view.html',
      controller: 'viewController'
    });

    $routeProvider.when("/create-update",{
      templateUrl: urls.managerUrl + '_angularJS/views/Products/createUpdate.html',
      controller: 'createUpdateController'
    });

  });
