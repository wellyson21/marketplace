<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 06/07/2019
 * Time: 21:03
 */

namespace classes\models;
use classesSystem\utilities\Firestore;


class HomeModel{

  private $homeData;

  public function __construct(){

    $this->homeData = new Firestore("Home");
    $this->homeData = $this->homeData->getDocuments()[0];
  }

  public function getMainSlide(){

    return $this->homeData["slideImages"];
  }

  public function getBlocksData(){

    return $this->homeData["adverts"];
  }

  public function getTopProducts(){

    $collection = new Firestore("Products");
    $collection = $collection->getDocuments([
      "sortBy"=> ["access_count"=> "desc"],
      "limit"=> 12,
      "where"=> [["field"=>"visible","operator"=>"==","value"=> true],["field"=>"status","operator"=>"==","value"=> "released"]]
    ]);

    return $collection;
  }

  public static function subscribeNewsletter($email){

    $email = trim(strtolower($email));
    $collection = new Firestore("Newsletter");

    $newsLetter = $collection->getDocuments();

    if(count($newsLetter) > 0){

      $newsLetter = $newsLetter[0];

      if(!in_array($email,$newsLetter["data"])){

        array_push($newsLetter["data"],$email);
        return $collection->updateDocument(["data"=> $newsLetter["data"]],$newsLetter["id"]);
      }

      return 0;
    }else{

      return $collection->newDocument([
        "data"=> [$email]
      ]);
    }
  }

  public function getCategoriesData(){

    $categories = new \classes\models\ProductsModel();
    $categories = $categories->getCategories()["data"];

    $data = ["name"=> $categories,"qty"=> []];

    $collection = new Firestore("Products");

    foreach( $categories as $cat){

      $d = $collection->getDocuments([
        "where"=> [["field"=>"visible","operator"=>"==","value"=> true], ["field"=>"status","operator"=>"==","value"=> "released"], ["field"=>"category","operator"=>"==","value"=> $cat]]
      ]);

      array_push($data["qty"],count($d));
    }

    return $data;
  }

  public function getWhatData(){

    return $this->homeData["whatDoing"];
  }

}