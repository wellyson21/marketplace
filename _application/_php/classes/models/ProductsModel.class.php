<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 05/07/2019
 * Time: 19:04
 */

namespace classes\models;
use classesSystem\utilities\Firestore;
use classesSystem\utilities\Request;


class ProductsModel{

  public function queryByName($data){

    $name = $data["name"];
    $offset = isset($data["offset"]) ? $data["offset"] : null;
    $limit = 9;
    $collection = new Firestore("Products");

    if($offset != null){

      $startAt = $collection->getDocuments(["docName"=> $offset,"snapshot"=> true]);
    }else{

      $startAt = null;
    }

    $where = trim($name) === "" ? [["field"=>"status","operator"=> "==","value"=> "released"], ["field"=>"visible","operator"=> "==","value"=> true]] : [["field"=>"name_lowercase","operator"=> ">=","value"=>strtolower($name)],["field"=>"status","operator"=> "==","value"=> "released"], ["field"=>"visible","operator"=> "==","value"=> true]];
    $docsP = $collection->getDocuments(["where"=> $where]);
    $paginationInfo = [];

    if($limit > 0){
      for($i = 0;$i < count($docsP);$i+= $limit){
        if(isset($docsP[$i])){

          array_push($paginationInfo,$docsP[$i]["id"]);
        }
      }
    }

    $docs = $collection->getDocuments([
      "where"=> $where,
      "startAt"=> $startAt,
      "limit"=> $limit
    ]);

    echo json_encode(["paginationInfo"=>$paginationInfo, "data"=>$docs]);
  }

  public function getProduct($name,$addAccess = false,$getAdvertiser = true){

    $collection = new Firestore("Products");
    $data = $collection->getDocuments(["docName"=> trim($name)]);

    if($addAccess){

      $accessCount = ($data["access_count"] * 1) + 1;

      $collection->updateDocument(["access_count"=> $accessCount],$name, true);
    }

    if($getAdvertiser){

      if($data["advertiser"] === "system"){

        $gm = new GeneralModel();
        $gm = $gm->getGeneralData();
        $cm = new ContactModel();
        $cm = $cm->getContactData();

        $advertiser = [
          "from"=> "system",
          "name"=> $gm["systemName"],
          "email"=> $cm["contacts"]["email"]["value"],
          "photo"=> $gm["logoIcon"],
        ];
      }else{

        $am = new AccountModel();
        $advertiser = new Firestore("Profiles");
        $advertiser = $advertiser->getDocuments(["docName"=> $data["advertiser"]]);
        $advertiser["from"] = "user";

        if(!$am->hasPayed($advertiser["email"])){

          $am->changeAdvertsVisibilityStatus($advertiser["email"],false);
          $data = [];
        }
      }
      $data["advertiser"] = $advertiser;

      if(isset($data["status"]) && $data["status"] !== "released"){

        $data = [];
      }
    }

    return $data;
  }

  public function getProducts($data){

    $offset = isset($data["offset"]) ? $data["offset"] : null;
    $category = $data["category"];
    $country = $data["country"];
    $state = $data["state"];
    $limit = 9;
    $where = [];
    $collection = new Firestore("Products");

    if($offset != null){

      $startAt = $collection->getDocuments(["docName"=> $offset,"snapshot"=> true]);
    }else{

      $startAt = null;
    }

    if($category != "all"){

      array_push($where,["field"=>"category","operator"=>"==","value"=>$category]);
    }

    if($state != "all"){

      array_push($where,["field"=>"state","operator"=>"==","value"=>strtolower($state)]);
    }

    if($country != "all"){

      array_push($where,["field"=>"country","operator"=>"==","value"=>strtolower($country)]);
    }

    array_push($where,["field"=>"visible","operator"=>"==","value"=> true]);
    array_push($where,["field"=>"status","operator"=>"==","value"=> "released"]);

    $docsP = $collection->getDocuments(["where"=> count($where) === 0 ? null : $where]);
    $paginationInfo = [];

    if($limit > 0){
      for($i = 0;$i < count($docsP);$i+= $limit){
        if(isset($docsP[$i])){

          array_push($paginationInfo,$docsP[$i]["id"]);
        }
      }
    }

    $docs = $collection->getDocuments([
      "where"=> count($where) === 0 ? null : $where,
      "startAt"=> $startAt,
      "limit"=> $limit
    ]);

    echo json_encode(["paginationInfo"=>$paginationInfo, "data"=>$docs]);
  }

  public function hasProposalRegistered($productId){

    if(!Request::SESSION("email")){

      return false;
    }

    $collection = new Firestore("Profiles");

    $profile = @$collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==","value"=> Request::SESSION("email")]
    ])[0];

    if(!$profile){

      return false;
    }
    
    $collection->setCollection("Proposals");
    
    return count($collection->getDocuments([
      "where"=>[["field"=> "productId","operator"=>"==", "value"=> $productId],["field"=> "from","operator"=>"==", "value"=> $profile["id"]]]
    ])) > 0;
  }

  public function getCategories(){

    $collection = new Firestore("ProductsCategories");
    $collection = $collection->getDocuments()[0];
    return $collection;
  }

}