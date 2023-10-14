<?php

  $str = $_SERVER['PHP_SELF'];
  $arr = array_filter(explode('/',$str),function($v){ return $v != ''; });
  $path = '/'.implode('/',array_slice($arr,0,array_search('public_html',$arr))).'/';
  $_SERVER['DOCUMENT_ROOT'] = $path;

  date_default_timezone_set('America/Sao_Paulo');
  $settingData['database']['host'] = 'localhost';
  $settingData['database']['user'] = 'u867783066_ipart';
  $settingData['database']['pass'] = 'ipartts123';
  $settingData['database']['db'] = 'u867783066_ipart';

  $GLOBALS['systemConfig'] = $settingData;

  spl_autoload_register('autoload');
  function autoload($class){
    $pathArr = ['_application\\_php\\classesManager\\','_application\\','_manager\\_php\\classesManager\\','_manager\\'];
    $pathArr2 = ['_application\\_php\\','_manager\\_php\\','_system\\_php\\'];
    $arrDir = ['controllers','models','utilities','views'];

    if(!strpos($class,"\\")) {

      foreach ($pathArr as $dir) {
        foreach ($arrDir as $dirName) {
          $className = str_replace('\\','/', $_SERVER['DOCUMENT_ROOT'] . $dir . $dirName . '/' . $class . '.class.php');
          if (file_exists($className) && !is_dir($className)) {
            include_once($className);
          }
        }
        break;
      }

    } else {

      foreach ($pathArr2 as $dir) {
        $className = str_replace('\\','/', $_SERVER['DOCUMENT_ROOT'] . $dir . $class . '.class.php');
        if (file_exists($className) && !is_dir($className)) {
          include_once($className);
        }
      }
    }
  }