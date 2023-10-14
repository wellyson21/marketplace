<?php
/**
 * Classe Login => Responsável por limitar acesso a certas área do sistema.
 */

namespace classesSystem\utilities;
use classesSystem\crud\Read;
use classesSystem\crud\Create;
use classesSystem\utilities\Firestore;


class Login {
    /** @var Bool Validate = Armazena o sucesso ou falha na validação */
    private static $Validate = false;
    public static $tableLogin;
    public static $session_fields = [];
    public static $session_set_data = [];
    public static $db_provider = "mysql";
    /**
     * Método authenticate = Responsável por autenticar usuários.
     *
     * @param array $LoginData = Recebe os dados do usuário.
     */
    private static function __constructor(){}

    public static function authenticate(array $LoginData){

      $fieldsName = array_keys($LoginData);
      $fieldsValue = array_values($LoginData);
      $condStr = '';
      $i = 0;
      self::$Validate = false;

      foreach ($fieldsValue as $k=>$v){
        $condStr.= count($fieldsName) > 0 && $i < count($fieldsName) - 1 ? $fieldsName[$i] . "='{$v}' AND " :$fieldsName[$i]. "='{$v}'";
        $i++;
      }

      if(self::$db_provider === "mysql"){

        $readData = new Read(self::$tableLogin,null,$condStr);
        $readData = $readData->getResult();
      }else{

        $readData = new Firestore(self::$tableLogin);
        $readData = $readData->getDocuments([
          "where"=> [["field"=>"email","operator"=>"==","value"=> strtolower(trim($LoginData["email"]))],["field"=>"password","operator"=>"==","value"=>trim($LoginData["password"])]]
        ]);
      }

      if(count($readData) > 0){
        @session_start();
        $userData = $readData[0];

        foreach (self::$session_set_data as $key=>$val){
          $_SESSION[$key] = $val;
        }

        foreach (self::$session_fields as $key=>$val){
          $_SESSION[$key] = $userData[$val];
        }

        $_SESSION['auth_user'] = true;
        $_SESSION['email'] = $userData["email"];
        self::$Validate = true;
      }

      unset($email,$pass);
      return @$_SESSION['auth_user'] == true ? 1 : 0;
    }

    /**
     * Método pageLocation = Responsável por direcionar o usuário para a página especificada.
     *
     * @param $Page = Recebe o link de redirecionamento em caso de sucesso no login.
     */
    public static function pageLocation($Page){
        header("location: {$Page}");
    }

    public static function redirect($Page){
      @session_start();
      if($_SESSION['auth_user']){
        header("location: {$Page}");
      }
    }

  /**
     * Métodos setUser = Responsável por cria novos usuários, autenticar e redirecionar.
     *
     * @param $RegisterData = Recebe os dados para criação de usuários.
     * @param $LoginData = Recebe os nomes dos campos do registro.
     * @param $up = Recebe os nomes dos campos do registro.
     */
    public static function setUser($RegisterData,$LoginData = null,$up = null){

      if(self::$db_provider === "mysql"){

        $createUser = new Create(self::$tableLogin,array_keys($RegisterData),array_values($RegisterData));
        $createUser = $createUser->rowCount() > 0;
      }else{
        $createUser = new Firestore(self::$tableLogin);
        $createUser = $createUser->newDocument($RegisterData);
      }

      if(!$LoginData){

        $LoginData = ["email"=> $RegisterData["email"],"password"=> $RegisterData["password"]];
      }

      if(is_bool($createUser) && $createUser){

        self::authenticate($LoginData);
      }

      unset($name,$user,$pass,$createUser);
      return @$_SESSION['auth_user'] == true ? 1 : 0;
    }

    public static function logout($page = null){
      session_start();
      if(@$_SESSION['auth_user']){


        if(is_array($_SESSION["session_map"])){
          foreach ($_SESSION["session_map"] as $key=>$val){
            unset($_SESSION[$val]);
          }
        }

        unset($_SESSION["email"]);

        foreach (self::$session_set_data as $key=>$val){
          unset($_SESSION[$val]);
        }

        foreach (self::$session_fields as $key=>$val){
          unset($_SESSION[$val]);
        }

        unset($_SESSION['auth_user']);

        $page = (string) $page;
        if($page){

          header("location: {$page}");
        }
      }else{
        header('Location: ./');
      }
    }

    public static function checkUser(){
      @session_start();
      return @$_SESSION['auth_user'] == true;
    }


}