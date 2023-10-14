<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 28/11/2016
 * Time: 16:58
 */

namespace classesSystem\controllers;
require_once('./_system/_php/composer/vendor/autoload.php');

class View{

  private static $tplRoot;

  public static function show($dirFile,array $data,$stored = false){

    self::$tplRoot = $GLOBALS['systemConfig']['dir_views'];

    $key = substr($dirFile,0,strpos($dirFile,':'));
    $dirFile = strpos($dirFile,':') != 0 ? substr($dirFile,strpos($dirFile,':')+1) : $dirFile;

    $localSearch = $key == 'app' || empty($key) ? 'app' : ($key == 'manager' ? 'manager' : '');

    $route = array_filter(explode('/',$dirFile),function($v){ return $v != ''; });
    $filename = $route[count($route)-1];
    $dirName = self::$tplRoot[$localSearch];

    if(count($route) > 1){
      array_pop($route);
      $dirName = str_replace("\\",'/',self::$tplRoot[$localSearch]).'/'.implode($route,'/');
    }

    if(is_dir($dirName) && file_exists($dirName.'/'.$filename.'.html')){

      $loader = new \Twig_Loader_Filesystem($dirName);
      $twig = new \Twig_Environment($loader);

      if($stored){

        return $twig->render($filename.'.html',$data);

      }else{

        echo $twig->render($filename.'.html',$data);

      }

    }

  }

}
