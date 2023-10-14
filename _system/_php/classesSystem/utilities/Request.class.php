<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 28/11/2016
 * Time: 16:04
 */

namespace classesSystem\utilities;


class Request{

    private static $GET;
    private static $setGet;
    private static $POST;
    private static $SERVER;
    private static $REQUEST;
    private static $FILES;

    private function __construct(){}

    public static function setGet($param,$value){

      self::$setGet = true;
      self::$GET = $_GET;
      self::$GET[$param] = $value;

    }

    public static function GET($key = null){

      self::$GET = self::$setGet ? self::$GET : $_GET;
      return $key ? self::$GET[$key] : self::$GET;

    }

    public static function POST($key = null){

      self::$POST = filter_input_array(INPUT_POST,$_POST);
      return $key ? @self::$POST[$key] : @self::$POST;

    }

    public static function SERVER($key = null,$value = null){

      if($key && $value){

        $_SERVER[$key] = $value;
        self::$SERVER = $_SERVER;
        return self::$SERVER;
      }

      self::$SERVER = filter_input_array(INPUT_SERVER,$_SERVER);
      self::$SERVER['PAGE_INFO'] = @$_SERVER['PAGE_INFO'];
      self::$SERVER['BASE_URL'] = @$GLOBALS['BASE_URL'];
      self::$SERVER['APP_URL'] = @$GLOBALS['APP_URL'];
      self::$SERVER['SYSTEM_URL'] = @$GLOBALS['SYSTEM_URL'];
      self::$SERVER['MANAGER_URL'] = @$GLOBALS['MANAGER_URL'];
      return $key ? @self::$SERVER[$key] : @self::$SERVER;

    }

    public static function SESSION($key = null,$val = false){

      @session_start();
      if($key && $val){

        @$_SESSION[$key] = $val;
        return true;
      }

      return $key ? @$_SESSION[$key] : $_SESSION;

    }

    public static function REQUEST($key = null){

      self::$REQUEST = $_REQUEST;

      foreach (self::GET() as $key2=> $value2){

        self::$REQUEST[$key2] = $value2;
      }

      return $key ? @self::$REQUEST[$key] : @self::$REQUEST;

    }

    public static function FILES($key = null){

      self::$FILES = $_FILES;
      return $key ? @self::$FILES[$key] : @self::$FILES;

    }

    public static function isFilled($Data){

        if(count($Data) > 0){
            foreach($Data as $value){
                if(!$value){
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }


}
