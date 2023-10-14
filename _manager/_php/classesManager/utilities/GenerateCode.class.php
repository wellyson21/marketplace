<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 08/02/2017
 * Time: 20:55
 */

namespace classesManager\utilities;

class GenerateCode{
  private static $Code;
  private static $CodeProduct;
  private static $ChatToken;

  /*************************** Method for create code of Product ****************************/

  public static function codeProduct(array $arrCode,$length = 6){
    self::createCode($length);
    $data = substr(date('Y'),3);
    $code = 'P' . $data . self::getCode();

    for($i = 0; in_array($code,$arrCode);$i++) {
      self::createCode($length);
      $code = 'P' . $data . self::getCode();
    }

    self::$CodeProduct = $code;
    return self::$CodeProduct;
  }

  /*************************** Method for create token for chat ****************************/

  public static function chatToken($length = 6){
    self::createCode($length);
    $data = substr(date('Y'),3);
    $code = 'CHAT' . $data . self::getCode();

    self::$ChatToken = $code;
    return self::$ChatToken;
  }

  /******************************************** Method for generate code ********************************************/

  private static function createCode($length = 6){
    $hexDec = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    $code = '';

    for($i = 1; $i <= $length; $i++){
      $code .= $hexDec[rand(0,15)];
    }

    self::$Code = strtoupper($code);
  }

  private static function getCode(){
    return self::$Code;
  }

}