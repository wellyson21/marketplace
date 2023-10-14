<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 02/08/2019
 * Time: 22:18
 */

namespace classesManager\models;


use classes\models\GeneralModel;
use classesSystem\utilities\Firestore;
use classesSystem\utilities\Mail;

class NewsletterModel{


  public static function send(array $data){

    $collection = new Firestore("Newsletter");
    $collection = $collection->getDocuments();

    if(count($collection) > 0) {

      $collection = $collection[0];

      $gm = new GeneralModel();
      $gm = $gm->getGeneralData();
      $mail = new Mail();

      $mail->login($gm["mail"]["email"],$gm["mail"]["password"]);
      $mail->setMessage($data["subject"],$data["message"]);
      $mail->setProvider("gmail");

      foreach ($collection["data"] as $email) {

        $mail->addAddress($email);
      }

      return $mail->send();
    }

    return false;
  }

}