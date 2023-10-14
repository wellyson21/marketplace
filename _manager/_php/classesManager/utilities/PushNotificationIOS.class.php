<?php
/**
 * Created by PhpStorm.
 * User: lucas
 * Date: 15/12/2018
 * Time: 06:39
 */

namespace classesManager\utilities;

class PushNotificationIOS {

  private $socketClient = null;

  public function notification(array $deviceToken, $title, $subtitle, $messageBody, $sound, $categoryId, array $data = []){

    $conn = $this->connectionToAPN();
    $response = null;

    if($conn){

      $payload = $this->payloadNotification($title, $subtitle, $messageBody, $sound, $categoryId, $data);

      $response = $this->sendNotification($deviceToken, $payload);

      $this->closeConnectionToAPN();
    }

    return $response;
  }

  public function silentNotification(array $deviceToken, array $data){

    $conn = $this->connectionToAPN();
    $response = null;

    if($conn){

      $payload = $this->payloadSilentNotification($data);

      $response = $this->sendNotification($deviceToken, $payload);

      $this->closeConnectionToAPN();
    }

    return $response;
  }

  private function connectionToAPN(){

    $isConnected = false;

    $streamContext = stream_context_create();
    stream_context_set_option($streamContext, 'ssl', 'local_cert', dirname(__DIR__, 4).'/PushNotificationDev.pem');
    stream_context_set_option($streamContext, 'ssl', 'passphrase', '');
  
    $socketClient = @stream_socket_client("ssl://gateway.sandbox.push.apple.com:2195", $errNo, $errStr, 60, STREAM_CLIENT_CONNECT, $streamContext);
      
    if($socketClient){
      
      $this->socketClient = $socketClient;
      $isConnected = true;
    }

    return $isConnected;
  }

  private function closeConnectionToAPN(){

    if($this->socketClient){

      fclose($this->socketClient);
    }
  }

  private function payloadNotification($title, $subtitle, $messageBody, $sound, $categoryId, array $data){

    $payload = ["aps" => ["alert" => ["title" => $title, "subtitle" => $subtitle, "body" => $messageBody], "sound" => $sound, "category" => $categoryId], "data" => $data];
    $payload = json_encode($payload);

    return $payload;
  }

  private function payloadSilentNotification(array $data){

    $payload = ["aps" => ["content-available" => 1], "data" => $data];
    $payload = json_encode($payload);

    return $payload;
  }

  private function sendNotification(array $deviceToken, $payload){

    $response = null;

    foreach($deviceToken as $token){

      $message = pack("CnH*", 0, 32, $token) . pack("n", strlen($payload)) . $payload;

      $responseAPN = fwrite($this->socketClient, $message);

      if($responseAPN){
        $response[] = true;
      } else{
        $response[] = false;
      }
    }

    return $response;
  }

}
