<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 03/08/2019
 * Time: 00:41
 */

namespace classesSystem\utilities;

use PHPMailer\PHPMailer\Exception;
use \PHPMailer\PHPMailer\PHPMailer;

class Mail{

  private $Host = 'smtp.gmail.com';
  private $SMTPAuth = true;
  private $SMTPSecure = 'tls';
  private $Port = 587;

  public $ErrorInfo;

  private $mail;

  public function __construct(){

    $mail = new PHPMailer();
    $mail->Host = $this->Host;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Port = $this->Port;

    $this->mail = $mail;

    $this->mail->isSMTP();
    $this->isHTML();
    $this->setCharset();
    $this->mail->CharSet = "utf-8";

  }


  public function setProvider($name){

    $name = trim(strtolower($name));

    if($name === "gmail"){

      $this->mail->Port = 587;
      $this->mail->Host = 'smtp.gmail.com';
      $this->mail->SMTPSecure = 'tls';
    }else if($name === "outlook" || $name === "hotmail"){

      $this->mail->Port = 587;
      $this->mail->Host = 'SMTP.office365.com';
      $this->mail->SMTPSecure = 'STARTTLS';
    }
  }

  public function setCharset($charset = "utf-8"){

    $this->mail->CharSet = $charset;
  }

  public function isHTML($value = true){

    $this->mail->isHTML($value);
  }

  public function login($email, $password){

    $this->mail->Username = $email;
    $this->mail->Password = $password;

    $provider = trim(strtolower(explode(".",explode("@",$email)[1])[0]));

    $this->setProvider($provider);
    $this->setFrom();
  }

  public function setMessage($subject,$body){

    $this->mail->Subject = $subject;
    $this->mail->Body = $body;
    $this->mail->AltBody = 'Error in the read this message.';
  }

  public function setFrom($email = null){
    try{

      $this->mail->setFrom($email ? $email : $this->mail->Username);
      $this->mail->addReplyTo($email ? $email : $this->mail->Username);
    }catch (Exception $e){

    }
  }

  public function addAddress($email){

    $this->mail->addAddress($email);
    $this->mail->addCC($email);
    $this->mail->addBCC($email);
  }

  public function addFile($path){

    try{
      $this->mail->addAttachment($path);
    }catch (Exception $e){

    }
  }

  public function send(){
    try{

      $status = $this->mail->send();
      $this->ErrorInfo = $this->mail->ErrorInfo;
      return $status;
    }catch (Exception $e){

      $this->ErrorInfo = $e->errorMessage();
      return $e;
    }
  }



}