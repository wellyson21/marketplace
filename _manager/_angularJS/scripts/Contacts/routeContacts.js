/**
 * Created by Lucas on 21/12/2017.
 */

  var app = angular.module('routeContacts',["ngRoute"]);

  app.config(function($routeProvider){

    $routeProvider.when("/",{
      templateUrl: urls.managerUrl + '_angularJS/views/Contacts/main.html',
      controller: 'mainController'
    });

  });
