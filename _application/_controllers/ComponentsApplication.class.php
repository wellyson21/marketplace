<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 29/09/2017
 * Time: 22:29
 */

namespace application\basicsComponents;

use classes\models\AccountModel;
use classes\models\GeneralModel;
use classes\models\ContactModel;
use classes\models\HomeModel;
use classesSystem\controllers\View;
use classesSystem\utilities\Login;
use classesSystem\utilities\Request;
use classesSystem\utilities\Firestore;

class ComponentsApplication{

  private $allUrls = array();
  private $dataDeneral;

  public function __construct(){

   $this->allUrls = array(
      'appUrl'=> Request::SERVER('APP_URL'),
      'managerUrl'=> Request::SERVER('MANAGER_URL'),
      'baseUrl'=> Request::SERVER('BASE_URL'),
      'systemUrl'=> Request::SERVER('SYSTEM_URL')
    );

    $collection = new Firestore("General");
    $this->dataDeneral = $collection->getDocuments()[0];
  }

  public function configs_head(){
    $component = View::show('app:_components/configs_head',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function default_files_css(){
    $component = View::show('app:_components/default_files_css',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function default_files_javascript(){
    $component = View::show('app:_components/default_files_js',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function header($pageInfo = null,$categories = [], $slideImages = []){

    $model = new AccountModel();
    $cmodel = new ContactModel();
    $cmodel = $cmodel->getContactData();

    $component = View::show('app:_components/header',[
      'urls'=> $this->allUrls,
      "isLogged"=> Login::checkUser(),
      "pageInfo"=> $pageInfo,
      "slideImages"=> $slideImages,
      "logo"=> $this->dataDeneral["logo"],
      "userData"=> $model->getProfile(),
      "categories"=> $categories,
      "email"=> $cmodel["contacts"]["email"]["value"],
      "phone"=> $cmodel["contacts"]["phone"]["value"],
      "whatsapp"=> $cmodel["contacts"]["whatsapp"]["value"]
    ],true);
    return $component;
  }

  public function menu(){

    $component = View::show('app:_components/menu',[
      'urls'=> $this->allUrls,
      "logo"=> $this->dataDeneral["logo"],
    ],true);
    return $component;
  }

  public function footer(){

    $collection = new Firestore("About");
    $collection = $collection->getDocuments()[0];

    $cmodel = new ContactModel();
    $cmodel = $cmodel->getContactData();

    $hmodel = new HomeModel();
    $hmodel = $hmodel->getWhatData();


    $component = View::show('app:_components/footer',[
      'urls'=> $this->allUrls,
      "socialMedias"=> $this->dataDeneral["socialMedias"],
      "shortDescription"=> $collection["shortDescription"],
      "logo"=> $this->dataDeneral["logo"],
      "email"=> $cmodel["contacts"]["email"]["value"],
      "phone"=> $cmodel["contacts"]["phone"]["value"],
      "whatsapp"=> $cmodel["contacts"]["whatsapp"]["value"],
      "whatDoing"=> $hmodel
    ],true);
    return $component;
  }

}
