<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 29/09/2017
 * Time: 22:29
 */

namespace manager\basicsComponents;

use classesSystem\controllers\View;
use classesSystem\utilities\Firestore;
use classesSystem\utilities\Request;

class ComponentsManager {

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

    $component = View::show('manager:_components/configs_head',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function default_files_css(){
    $component = View::show('manager:_components/default_files_css',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function default_files_javascript(){
    $component = View::show('manager:_components/default_files_js',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function header(array $data = []){
    $component = View::show('manager:_components/header',[
      'urls'=> $this->allUrls,
      'data'=> $data
    ],true);
    return $component;
  }

  public function menu(){
    $component = View::show('manager:_components/menu',[
      'urls'=> $this->allUrls,
      "logo"=> $this->dataDeneral["logo"]
    ],true);
    return $component;
  }

  public function footer(){
    $component = View::show('manager:_components/footer',[
      'urls'=> $this->allUrls
    ],true);
    return $component;
  }

  public function overlay(){
    $component = View::show('manager:_components/overlay',[
        'urls'=> $this->allUrls
    ],true);
    return $component;
  }

}
