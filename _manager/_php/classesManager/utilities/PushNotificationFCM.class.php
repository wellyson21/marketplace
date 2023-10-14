<?php

namespace classesManager\utilities;

class PushNotificationFCM {

  private $messageBody = "";

  public function __construct(array $messageData){

    $this->messageBody = $this->composeMessageBody($messageData);
  }

  public function send($key) {

    $fcmUrl = 'https://fcm.googleapis.com/fcm/send';
    $headers = [ "Authorization: key=$key", 'Content-Type: application/json' ];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL,$fcmUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $this->messageBody);

    $result = curl_exec($ch);

    curl_close($ch);

    return $result;
  }

  private function composeMessageBody($messageData) {

    $messageBody = [
      "to" => '/topics/default',
      "priority" => "high",
      "notification" => $messageData
    ];

    return json_encode($messageBody);
  }  

}
