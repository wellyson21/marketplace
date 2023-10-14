<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 06/07/2019
 * Time: 21:38
 */

namespace classes\models;
use classesSystem\utilities\Firestore;


class AboutModel{

  public function getAboutData(){

    $collection = new Firestore("About");
    return $collection->getDocuments()[0];
  }

}