<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 08/02/2017
 * Time: 20:55
 */

namespace classes\utilities;


class GenerateCode{
  private static $Code;
  private static $CodeTeacher;
  private static $CodeStudent;
  private static $CodeCourse;

  /*************************** Method for create codes of Teachers, Students and Courses ****************************/

  public static function codeTeacher(array $arrCode,$length = 6){
    self::createCode($length);
    $data = substr(date('Y'),3);
    $code = 'T' . $data . self::getCode();

    for($i = 0; in_array($code,$arrCode);$i++) {
      self::createCode($length);
      $code = 'T' . $data . self::getCode();
    }

    self::$CodeTeacher = $code;
    return self::$CodeTeacher;
  }

  public static function codeStudent(array $arrCode,$length = 6){
    self::createCode($length);
    $data = substr(date('Y'),3);
    $code = 'S' . $data . self::getCode();

    for($i = 0; in_array($code,$arrCode);$i++) {
      self::createCode($length);
      $code = 'S' . $data . self::getCode();
    }

    self::$CodeStudent = $code;
    return self::$CodeStudent;
  }

  public static function cs_code(array $arrCode,$length = 6){
    self::createCode($length);
    $data = substr(date('Y'),3);
    $code = 'CS' . $data . self::getCode();

    for($i = 0; in_array($code,$arrCode);$i++) {
      self::createCode();
      $code = 'CS' . $data . self::getCode();
    }

    self::$CodeStudent = $code;
    return self::$CodeStudent;
  }

  public static function codeCourse(array $arrCode,$length = 6){
    self::createCode($length);
    $data = substr(date('Y'),3);
    $code = 'C' . $data . self::getCode();

    for($i = 0; in_array($code,$arrCode);$i++) {
      self::createCode($length);
      $code = 'C' . $data . self::getCode();
    }

    self::$CodeCourse = $code;
    return self::$CodeCourse;
  }

  public static function getPassword($length = 6){
    self::createCode($length);
    $code = 'P' . self::getCode();
    self::$CodeCourse = $code;
    return self::$CodeCourse;
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