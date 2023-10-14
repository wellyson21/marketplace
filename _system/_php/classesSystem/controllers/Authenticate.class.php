<?php
/**
 * Created by PhpStorm.
 * User: KENPACHI
 * Date: 01/01/2017
 * Time: 19:30
 */

namespace classesSystem\controllers;
use classesSystem\utilities\Request;
use classesSystem\utilities\Login;

class Authenticate{

    public $isFilledL;
    public $isFilledR;

    public function __construct(){

      if(Request::POST('action') === 'logar'){

            $login = new Login;
            if(Request::isFilled(Request::POST())){
                $login->authenticate([Request::POST('email'),Request::POST('password')]);
                $this->isFilledL = true;
            }else{
                $this->isFilledL = false;
            }

        }else if(Request::POST('action') === 'register'){

            if(Request::isFilled($_POST)){
                $login = new Login;
                $login->setUser([Request::POST('name'),Request::POST('email'),Request::POST('password')]);
                $login->pageLocation('./');
                $this->isFilledR = true;
            }else{
                $this->isFilledR = false;
            }

        }
    }

    public function status(){
        $login = new Login();
        return $login->checkUser();
    }

}