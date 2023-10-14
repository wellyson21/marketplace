<?php
/**
 * Classe Rote => Classe para definição de rotas
 *
 * @copyright (c) 2016 WebMaster
 */

namespace classesSystem\controllers;
use classesSystem\utilities\Request;


class Route {
  private static $Status;
  private static $Root;
  private static $pageId;

  private function __construct(){}

  public static function get($rout, $class, $method){
    if(Request::SERVER('REQUEST_METHOD') === 'GET'){

      self::matchRoute($rout, $class, $method);
    }
  }

  public static function post($rout, $class, $method){
    if(Request::SERVER('REQUEST_METHOD') === 'POST'){

      self::matchRoute($rout, $class, $method);
    }
  }

  public static function put($rout, $class, $method){

    if(Request::SERVER('REQUEST_METHOD') === 'PUT'){

      self::matchRoute($rout, $class, $method);
    }
  }

  public static function any($rout, $class, $method){

    self::matchRoute($rout, $class, $method);

  }

  private static function matchRoute($rout,  $class, $method){

    self::$Root = $GLOBALS['systemConfig']['dir_project'];

    /**** define o array contendo a rota que sera mapeada ****/
    if(strlen($rout) < 1) {
      exit();
    }

  
    
    if ($rout[0] === '/' && $rout[strlen($rout) - 1] === '/') {
      $route = explode('/', substr($rout, 1, strlen($rout) - 1));
    } else if ($rout[0] === '/') {
      $route = explode('/', substr($rout, 1));
    } else if ($rout[strlen($rout) - 1] === '/') {
      $route = explode('/', substr($rout, 0, strlen($rout) - 1));
    } else {
      $route = explode('/', $rout);
    }

    $uri = explode('?',@$_SERVER['REQUEST_URI'])[0];

    /*** faz redirecionamento caso chamado explicitamnete em um arquivo EX: /index.php ***/
    if(substr($uri,strrpos($uri,'/')) == '/index.php'){
      header("location: ". substr($uri,0,strrpos($uri,'/')));
    }

    /*** define o array contento a url a ser combinada ***/
    $url = $uri[0] === '/' && $uri[strlen($uri) - 1] === '/' ? explode('/',substr($uri,1,strlen($uri) - 2)) : explode("/",substr($uri,1));
    $rootPos = array_search(self::$Root, $url);

    if (self::$Root) {
      for ($i = 0; $i <= $rootPos; $i++) {
        array_shift($url);
      }
    }

    foreach ($route as $k=>$r){$r = trim($r);if(!$r){unset($route[$k]);}}

    if(strlen($rout) === 1 && $rout[0] === '/' && count($route) === 0 && count($url) === 0 || strlen($rout) === 2 && $rout[0] === '.' && count($route) === 0 && $route[0] === '.' && count($url) === 0){

      self::$Status = true;
      self::callFunc($class,$method,"/");
      return;
    }

    $view = '';
    foreach ($route as $routePart) {

      if (preg_match("@[0-9a-z]+{[0-9a-z\-\_\.\&\$\#\@\!*]+}@i", $routePart)) {

        $routeId = true;
        $paramName = substr($routePart, 0, strpos($routePart, '{'));
        $getName = substr($routePart, strpos($routePart, '{') + 1, strlen($routePart));
        $getName = substr($getName, 0, strlen($getName) - 1);

        foreach ($url as $key => $urlPartN) {
          if ($paramName == $urlPartN) {
            $getValue = @($url[$key + 1]);
          }
        }

        if(isSet($getName) && isSet($getValue)){
          Request::setGet($getName,$getValue);
        }

      } else if (preg_match("@[[:alpha:]]+@", $routePart, $match)) {

        @$view .= $view[strlen($view)-1] == '/' ? $routePart.'/' : '/'.$routePart;
      }

      if (isSet($routeId)) {

        @$view .= $view[strlen($view)-1] == '/' ? $paramName . '/' . $getValue : '/'.$paramName . '/' . $getValue;
      }

      $routeId = null;
    }

    if ('/' . implode('/', $url) == '/' . $view) {

      self::$Status = true;
      self::callFunc($class,$method,$view);
    }else if('/' . implode('/', $url) == $view){

      self::$Status = true;
      self::callFunc($class,$method,$view);
    }

  }

  public static function pageNotFound($msgM = false){
    if(!self::$Status && !$msgM){

      echo 'Error: 404 Page Not Found!';

    }else if(!self::$Status && $msgM){

      return self::$Status;

    }
  }

  private static function callFunc($class,$method,$view){

    $view = $view ? $view : "";
    $arrRoute = ['_application/_controllers/'.$class.'.class.php','_manager/_controllers/'.$class.'.class.php'];
    $viewf = strlen($view) > 0 && @$view[0] !== "/" ? "/".$view : $view;
    $viewf = strlen($view) > 0 && @$viewf[strlen($viewf) - 1] !== "/" ? $viewf."/" : $viewf;
    $viewf = $viewf ? $viewf : "";
    $privateRoutes = json_decode(Request::POST("privateRoutes"),true);
    $privateRoutes = $privateRoutes ? $privateRoutes : [];
    $viewf = in_array($view,$privateRoutes) ? $viewf.'/'.Request::POST('id') : $viewf;

    foreach($arrRoute as $route){
      if(file_exists($route)){
        include_once($route);
        self::$pageId = sha1($route.$viewf);

        Request::SERVER("PAGE_INFO",['id'=>self::$pageId,"dir"=>sha1($route)]);
      }
    }

    if(isset($_POST['PAGE_INFO']) && $_POST['PAGE_INFO'] && Request::SERVER('REQUEST_METHOD') === 'POST'){

      echo json_encode(Request::SERVER("PAGE_INFO"));
      return true;
    }else{
      
      $constructClass = new $class();
      call_user_func_array([$constructClass,$method],[]);
      return true;
    }
  }

}
