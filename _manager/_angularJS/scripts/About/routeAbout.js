/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('routeAbout',["ngRoute"]);

  app.config(function($routeProvider){

    $routeProvider.when("/",{
      templateUrl: urls.managerUrl + '_angularJS/views/About/main.html',
      controller: 'mainController'
    });

  });
