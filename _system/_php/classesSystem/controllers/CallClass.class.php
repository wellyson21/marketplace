<?php
/**
 * Created by PhpStorm.
 * User: KENPACHI
 * Date: 16/07/2017
 * Time: 08:23
 */

class CallClass{

  public function __construct($class,$method){

    include_once('_application/_controllers/'.$class.'.class.php');
    $constructClass = new $class();
    call_user_func_array([$constructClass,$method],[]);

  }

}