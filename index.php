<?php
  require('config.inc.php');

  use classesSystem\controllers\Route;
  use  classesSystem\utilities\Firestore;

  include_once("_application/_controllers/RoutesSystemApplication.class.php");
  include_once("_manager/_controllers/RoutesSystemManager.class.php");


  /************************************************ Application Routes ************************************************/

    Route::any("/","RoutesSystemApplication", "index");
      Route::post("/subscribeNewsLetter/","RoutesSystemApplication", "subscribeNewsletter");

    Route::any("/products/","RoutesSystemApplication", "products");
      Route::any("/products{productId}/","RoutesSystemApplication", "productDetails");
      Route::any("/getProducts/","RoutesSystemApplication", "productsAjax");

    Route::any("/contact","RoutesSystemApplication", "contact");
      Route::post("/contact/sendMessage/","RoutesSystemApplication", "sendMessage");

    Route::get("/about/","RoutesSystemApplication", "about");

    Route::get("/account/","RoutesSystemApplication", "account");
      Route::post("/account/proposals/","RoutesSystemApplication", "ajaxProposals");
      Route::post("/account/adverts/","RoutesSystemApplication", "ajaxAdverts");
      Route::post("/account/profile/","RoutesSystemApplication", "ajaxProfile");
      Route::post("/account/general/","RoutesSystemApplication", "ajaxAccountGeneral");
      Route::post("/account/profile-general/","RoutesSystemApplication", "ajaxAccountProfileGeneral");

    Route::any("/login/","RoutesSystemApplication", "login");
      Route::post("/authentication/","RoutesSystemApplication", "ajaxAuthentication");
      Route::post("/requestResetPassword/","RoutesSystemApplication", "requestRestPassword");
      Route::get("/resetPassword{emailCode}/","RoutesSystemApplication", "resetPassword");

   /************************************************* endpoints *******************************************************/

    Route::any("/paypal","RoutesSystemApplication", "payTax");


  /********************************************** Routee for Translate API ********************************************/

    Route::post('/api/translate/','RoutesSystemApplication','translate');


  /************************************************** Manager Routes **************************************************/

    Route::get("/manager/","RoutesSystemManager", "dashboard");
    Route::get("/manager/proposals/","RoutesSystemManager", "proposals");
      Route::post("/manager/ajaxProposals/","RoutesSystemManager", "ajaxProposals");
    Route::get("/manager/products/","RoutesSystemManager", "products");
      Route::post("/manager/ajaxAdverts/","RoutesSystemManager", "ajaxAdverts");
    Route::get("/manager/contacts/","RoutesSystemManager", "contacts");
    Route::get("/manager/about/","RoutesSystemManager", "about");
    Route::get("/manager/home/","RoutesSystemManager", "home");
    Route::get("/manager/newsletter/","RoutesSystemManager", "newsletter");
      Route::post("/manager/sendNewsletter/","RoutesSystemManager", "sendNewsletter");
    Route::get("/manager/settings/","RoutesSystemManager", "settings");

    
    ////ajax authentication
    Route::post("/manager/ajaxAuthentication/","RoutesSystemManager", "ajaxAuthentication");

    ////Firebase Settings
    Route::post("/manager/firebaseSettings/","RoutesSystemManager", "firebaseSettings");