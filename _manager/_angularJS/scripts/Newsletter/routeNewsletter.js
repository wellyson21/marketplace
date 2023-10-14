/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('routeNewsletter',["ngRoute"]);

  app.config(function($routeProvider){

    $routeProvider.when("/",{
      templateUrl: urls.managerUrl + '_angularJS/views/Newsletter/main.html',
      controller: 'mainController'
    });

  });
