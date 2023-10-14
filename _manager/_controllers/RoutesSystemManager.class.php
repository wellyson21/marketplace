<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 26/12/2018
 * Time: 23:24
 */

include_once("ComponentsManager.class.php");

use manager\basicsComponents\ComponentsManager;
use classesManager\utilities\PushNotificationFCM;
use classesSystem\controllers\View;
use classesSystem\utilities\Request;
use classesSystem\controllers\PayPal;

class RoutesSystemManager{

  private $pageTitle = "";
  private $urls = array();
  private $components = array();

  public function __construct(){

    $this->pageTitle = "CMS - ".Request::SESSION('companyInfo');

    $this->urls = array(
      "baseUrl" => Request::SERVER('BASE_URL'),
      "appUrl" => Request::SERVER('APP_URL'),
      "managerUrl" => Request::SERVER('MANAGER_URL'),
      "systemUrl" => Request::SERVER('SYSTEM_URL')
    );

    $components = new ComponentsManager();

    $this->components = array(
      "header" => $components->header(),
      "menu" => $components->menu(),
      "overlay" => $components->overlay(),
      "footer" => $components->footer(),
      "configs_head" => $components->configs_head(),
      "default_files_css" => $components->default_files_css(),
      "default_files_js" => $components->default_files_javascript()
    );
  }

  /***************************************************** Dashboard ****************************************************/

  public function dashboard(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Dashboard" ]);

      View::show('manager:Dashboard/dashboard',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  /***************************************************** Firebase settings ********************************************/

  public function firebaseSettings(){

    if(Request::SESSION("isLogged")){
      echo json_encode([
        "apiKey"=> "AIzaSyC4GA9E2hVb5ARjZ1jJIpfrlL3p6lVp9tc",
        "authDomain"=> "madefrio-977a2.firebaseapp.com",
        "databaseURL"=> "https://madefrio-977a2.firebaseio.com",
        "projectId"=> "madefrio-977a2",
        "storageBucket"=> "madefrio-977a2.appspot.com",
        "messagingSenderId"=> "713066261957",
        "appId"=> "1:713066261957:web:a284b32da1f75a46722fac",
        "measurementId"=> "G-RXK2KHT86Q"
      ]);
    }else{

      echo "false";
    }
  }

  /************************************************ Proposals and Adverts *********************************************/

  public function ajaxProposals(){

    if(!Request::SESSION("isLogged")){

      $this->login();
      return;
    }

    $action = Request::POST("action");
    $model = new \classes\models\AccountModel();

    if($action === "get"){

      echo json_encode($model->getProposals("to","system"));
    }else if($action === "remove"){

      $id = Request::POST("id");
      $productId = Request::POST("productId");
      echo $model->removeProposal($id, $productId);
    }
  }

  public function proposals(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Propostas" ]);

      View::show('manager:Proposals/proposals',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  public function ajaxAdverts(){

    if(!Request::SESSION("isLogged")){

      $this->login();
      return;
    }

    $action = Request::POST("action");
    $model = new \classes\models\AccountModel();

    if($action === "get"){

      echo json_encode($model->getAdverts("system"));
    }else if($action === "add"){

      $data = json_decode(Request::POST("advert"),true);
      echo json_encode($model->addAdvert($data,"system"));
    }else if($action === "update"){

      $data = json_decode(Request::POST("advert"),true);
      echo json_encode($model->updateAdvert($data));
    }else if($action === "remove"){

      $id = Request::POST("id");
      echo json_encode($model->removeAdvert($id));
    }

  }

  /**************************************************** Products ******************************************************/

  public function products(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Produtos" ]);

      View::show('manager:Products/products',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  /*************************************************** Contacts *******************************************************/

  public function contacts(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Contatos" ]);

      View::show('manager:Contacts/contacts',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  /**************************************************** About *********************************************************/

  public function about(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Sobre" ]);

      View::show('manager:About/about',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  /*************************************************** Settings *******************************************************/

  public function settings(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Configurações" ]);

      View::show('manager:Settings/settings',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  /***************************************************** Home *********************************************************/

  public function home(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Home" ]);

      View::show('manager:Home/home',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }

  /************************************************** Newsletter ******************************************************/

  public function newsletter(){

    if(Request::SESSION("isLogged")){

      $this->changeHeader([ "title"=> "Newsletter" ]);

      View::show('manager:Newsletter/newsletter',[
        "pageTitle" => $this->pageTitle,
        "urls" => $this->urls,
        "components" => $this->components
      ]);
    }else{

      $this->login();
    }
  }


  public function sendNewsletter(){

    if(!Request::SESSION("isLogged")){ return; }

    echo \classesManager\models\NewsletterModel::send(Request::POST());
  }

  /************************************************** Authentication **************************************************/

  public function login(){

    View::show('manager:Login/login',[
      'urls' => $this->urls,
      'components' => $this->components
    ]);
  }

  public function ajaxAuthentication(){

    $action = Request::POST("action");

    if($action === "login") {

      $model = new \classes\models\GeneralModel();
      $model = $model->getGeneralData();

      Request::SESSION("isLogged", true);
      Request::SESSION("companyInfo", $model["systemName"]);

      echo json_encode(["isLogged"=> true]);
    } else if($action === "logout"){

      @session_start();
      @session_destroy();

      echo json_encode(["isLogged"=> false]);
    }else if( $action === "status"){

      echo \classesSystem\utilities\Login::checkUser();
    }
  }



  /**************************************************** Utilities *****************************************************/

  private function changeHeader(array $data){

    $components = new ComponentsManager();
    $this->components["header"] = $components->header($data);
  }


}
