<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 06/07/2019
 * Time: 21:37
 */

namespace classes\models;
use classesSystem\utilities\Firestore;


class ContactModel{

  public function getContactData(){

    $collection = new Firestore("Contact");
    return $collection->getDocuments()[0];
  }

}