<?php

    /***** Settings Website *******************************************************************************************/
    /******************************************************************************************************************
    ******************************************************************************************************************/

    $settingData = [];
    $settingData['authenticateFields'] = [];
    $settingData['database'] = [];

    /** URLS */
    $GLOBALS['BASE_URL'] = "{$_SERVER['REQUEST_SCHEME']}://{$_SERVER['HTTP_HOST']}/";
    $GLOBALS['APP_URL'] = $GLOBALS['BASE_URL'].'/_application/';
    $GLOBALS['MANAGER_URL'] = $GLOBALS['BASE_URL'].'/_manager/';
    $GLOBALS['SYSTEM_URL'] = $GLOBALS['BASE_URL'].'/_system/';

    /****database  settings ****/
    $settingData['database']['host'] = 'localhost';
    $settingData['database']['user'] = 'root';
    $settingData['database']['password'] = '';
    $settingData['database']['db'] = '';

    /**** directory views ******/
    $settingData['dir_views'] = [
      'app'=>'_application/_views',
      'manager'=>'_manager/_views'
    ];

    /**** project start *****/
    $settingData['dir_project'] = '';

    $GLOBALS['systemConfig'] = $settingData;

    /**** Firestore Settings *****/
    $GLOBALS['settingsFirestore'] = [
      'projectId' => 'madefrio-977a2',
      'keyPath' => __DIR__ . '/_system/_php/_json/madefrio-977a2-68d22d27cc44.json'
    ];

    /******* autoload ************/
    spl_autoload_register('autoload');
    function autoload($class){
      $pathArr = ['_application\\_php\\classesManager\\','_application\\','_manager\\_php\\classesManager\\','_manager\\'];
      $pathArr2 = ['_application\\_php\\','_manager\\_php\\','_system\\_php\\'];
      $arrDir = ['controllers','models','utilities','views'];

      if(!strpos($class,"\\")) {

        foreach ($pathArr as $dir) {
          foreach ($arrDir as $dirName) {
            $className = str_replace('\\','/', $dir . $dirName . '/' . $class . '.class.php');
            if (file_exists($className) && !is_dir($className)) {
              include_once($className);
            }
          }
          break;
        }

      } else {

        foreach ($pathArr2 as $dir) {
          $className = str_replace('\\','/',$dir . $class);
          if (file_exists($className . '.class.php') && !is_dir($className . '.class.php')) {
            include_once($className . '.class.php');
          }
        }
      }
    }

    require_once('_system/_php/composer/vendor/autoload.php');
