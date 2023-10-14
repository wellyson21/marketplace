<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 17/07/2019
 * Time: 23:59
 */

namespace classes\models;
use classesSystem\utilities\Firestore;
use classesSystem\utilities\Request;
use classesSystem\utilities\Mail;


class AccountModel{


  //Profile
  public function getProfile(){

    $collection = new Firestore("Profiles");
    return $collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==","value"=> Request::SESSION("email")]
    ])[0];
  }

  public function setProfile(array $data){

    $collection = new Firestore("Profiles");
    $docName = $collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==","value"=> Request::SESSION("email")]
    ])[0]["id"];

    if(isset($data["photo"])){

      $tarr = $data["photo"];

      if(strrpos($tarr,"%2F") === false) {

        $start = substr($tarr, 0, strrpos($tarr, "/"));
        $end = substr($tarr, strrpos($tarr, "/") + 1);

        $url = $start . "%2F" . $end;
        $data["photo"] = $url;
      }
    }

    return $collection->updateDocument($data, $docName,true);
  }


  //Adverts
  public function getAdverts($advertiser = null,$offset = null,$limit = false){

    $advertiser = $advertiser ? $advertiser : @$this->getProfile()["id"];

    if(!$advertiser){

      return [];
    }

    $limit = $limit ? 20 : 0;

    $collection = new Firestore("Products");

    if($offset != null){

      $startAt = $collection->getDocuments(["docName"=> $offset,"snapshot"=> true]);
    }else{

      $startAt = null;
    }

    if($limit >= 1){

      $adverts = $collection->getDocuments([
        "where"=> ["field"=> "advertiser","operator"=> "==","value"=> $advertiser],
        "startAt"=> $startAt,
        "limit"=> $limit
      ]);
    }else{
      $adverts = $collection->getDocuments([
        "where"=> ["field"=> "advertiser","operator"=> "==","value"=> $advertiser],
      ]);
    }

    
    foreach ($adverts as $key=>$item){

      $date = date_create(date($item["date"] . ""));
      $date = date_format($date,"Y-m-d");
      $adverts[$key]["date"] = $date;
    }

    $docsP = $collection->getDocuments([
      "where"=> ["field"=> "advertiser","operator"=> "==","value"=> $advertiser]
    ]);

    $paginationInfo = [];
    if($limit > 0){
      for($i = 0;$i < count($docsP);$i+= $limit){
        if(isset($docsP[$i])){

          array_push($paginationInfo,$docsP[$i]["id"]);
        }
      }
    }

    return $limit >= 1 ? (["paginationInfo"=>$paginationInfo, "data"=>$adverts]) : $adverts;

    return $collection;
  }

  public function addAdvert(array $data,$advertiser = null){

    $data["advertiser"] = $advertiser ? $advertiser : $this->getProfile()["id"];
    $collection = new Firestore("Products");
    $data["date"] = date_create(date("Y-m-d"));
    $data["price"] = number_format((float)$data["price"],2);
    $data["state"] = strtolower($data["state"]);
    $data["country"] = strtolower($data["country"]);
    $data["visible"] = true;
    $data["status"] = "revision";
    return $collection->newDocument($data);
  }

  public function updateAdvert(array $data){

    $collection = new Firestore("Products");

    if($data["thumbnail"]){

      $tarr = $data["thumbnail"];

      if(strrpos($tarr,"%2F") === false) {

        $start = substr($tarr, 0, strrpos($tarr, "/"));
        $end = substr($tarr, strrpos($tarr, "/") + 1);

        $url = $start . "%2F" . $end;
        $data["thumbnail"] = $url;
      }
    }

    if(is_array($data["secondariesImages"])){

      foreach ($data["secondariesImages"] as $key=>$secImage) {

        if(strpos($secImage,'%2F') === false) {

          $tarr = $secImage;
          if(strrpos($tarr,"%2F") === false) {

            $start = substr($tarr, 0, strrpos($tarr, "/"));
            $end = substr($tarr, strrpos($tarr, "/") + 1);

            $url = $start . "%2F" . $end;
            $data["secondariesImages"][$key] = $url;
          }
        }
      }
    }

    // $data["price"] = number_format((float)$data["price"],2);
    $data["state"] = strtolower($data["state"]);
    $data["country"] = strtolower($data["country"]);

    $id = $data["id"];
    unset($data["id"]);

    return $collection->updateDocument($data,$id);
  }

  public function removeAdvert($id){

    $collection = new Firestore("Products");
    return $collection->dropDocument($id);
  }


  //Proposals
  public function getProposals($type = "from",$value = null,$offset = null){

    $limit = 20;
    $collection = new Firestore("Proposals");

    if($offset != null){

      $startAt = $collection->getDocuments(["docName"=> $offset,"snapshot"=> true]);
    }else{

      $startAt = null;
    }

    $value = $value ? $value : $this->getProfile()["id"];
    $proposals = $collection->getDocuments([
      "where"=> ["field"=> $type === "from" ? "from" : "to","operator"=> "==","value"=> $value],
      "startAt"=> $startAt,
      "limit"=> $limit
    ]);

    foreach ($proposals as $key=>$item){

      $date = date_create(date($item["date"] . ""));
      $date = date_format($date,"Y-m-d");
      $proposals[$key]["date"] = $date;
    }

    $docsP = $collection->getDocuments([
      "where"=> ["field"=> $type === "from" ? "from" : "to","operator"=> "==","value"=> $value],
    ]);
    $paginationInfo = [];

    if($limit > 0){
      for($i = 0;$i < count($docsP);$i+= $limit){
        if(isset($docsP[$i])){

          array_push($paginationInfo,$docsP[$i]["id"]);
        }
      }
    }

    return (["paginationInfo"=>$paginationInfo, "data"=>$proposals]);
  }

  public function addProposal($id,$price){

    $pmodel = new ProductsModel();
    $collection = new Firestore("Proposals");
    $profile = $this->getProfile();

    $proposal = $pmodel->getProduct($id,null, false);
    $proposal["productId"] = $proposal["id"];
    $proposal["info"] = $profile;
    $proposal["from"] = $profile["id"];
    $proposal["to"] = $proposal["advertiser"];
    $proposal["date"] = date_create(date("Y-m-d"));
    $proposal["customerPrice"] = $price;

    unset($proposal["id"]);

    $collection->setCollection("Profiles");
    $advertiserProfile = $collection->getDocuments([
      "docName"=> $proposal["to"]
    ]);

    if(!$advertiserProfile){return false;}

    if($proposal["to"] === "system"){

      $collection->setCollection("Proposals");
      $this->sendProposalEmail($proposal);
      return $collection->newDocument($proposal);
    }else{

      if($this->hasPayed($advertiserProfile["email"])){

        $collection->setCollection("Proposals");
        $this->sendProposalEmail($proposal);
        return $collection->newDocument($proposal);
      }else{

        return false;
      }
    }
  }

  private function sendProposalEmail($proposal){

    $cm = new ContactModel();
    $cm = $cm->getContactData();
    $gm = new GeneralModel();
    $gm = $gm->getGeneralData();

    $email = $proposal["to"];
    $email = $email === "system" ? $cm["contacts"]["email"]["value"] : $email;

    $mail = new Mail();
    $mail->login($gm["mail"]["email"],$gm["mail"]["password"]);
    $mail->setFrom(Request::POST("email"));
    $mail->setMessage("Pedido de Produto","Voçê recebeu Um pedido para o produto: {$proposal['name']} do cliente {$proposal['info']["email"]}");
    $mail->addAddress($email);
    $mail->send();
  }

  public function removeProposal($id = null, $productId = null){

    $collection = new Firestore("Proposals");

    if($productId){

      $id = @$collection->getDocuments([
        "where"=> ["field"=> "productId","operator"=> "==","value"=> $productId]
      ])[0]["id"];
    }

    return $collection->dropDocument($id);
  }


  //Payments
  public function hasPayed($email = null){

    $email = $email ? $email : Request::SESSION("email");
    $collection = new Firestore("Payments");
    $collection = $collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==", "value"=> $email]
    ]);

    if(count($collection) > 0){

      $collection = $collection[0];
      $dates = array_keys($collection["data"]);
      sort($dates);

      if(count($dates) > 0){

        $lastPayment = $dates[count($dates) - 1];
        $status = !GeneralModel::dateExpired($lastPayment);

        $this->changeAdvertsVisibilityStatus($email, $status);
        return $status;
      }else{

        $this->changeAdvertsVisibilityStatus($email,false);
        return false;
      }
    }else{

      $this->changeAdvertsVisibilityStatus($email,false);
      return false;
    }
  }

  public function addPayment($email = null){

    $email = $email ? $email : Request::SESSION("paypalCustomerEmail");

    if(!$email){return false;}

    $collection = new Firestore("Payments");
    $data = $collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==", "value"=> $email],
    ]);

    if(count($data) > 0){

      $data = $data[0];

      if(!isset($data["data"])){ $data["data"] = []; }

      $date = date("Y-m-d");
      $data["data"][$date] = true;
      $data["data"][GeneralModel::getIncrementedDate()->format("Y-m-d")] = false;
      $id = $data["id"];
      unset($data["id"]);

      $status = $collection->updateDocument($data,$id);

      if(!$this->getProfile()["advertsEnabled"] && $status){

        $this->setProfile(["advertsEnabled"=> true]);
      }

      if($status){

        $this->changeAdvertsVisibilityStatus($email,true);
      }

      return $status;
    }else{

      $status = $collection->newDocument([
        "data"=> [date("Y-m-d")=> true,GeneralModel::getIncrementedDate()->format("Y-m-d")=> false],
        "email"=>$email
      ]);

      if(!$this->getProfile()["advertsEnabled"] && $status){

        $this->setProfile(["advertsEnabled"=> true]);
      }

      return $status;
    }
  }

  public function getMonthlyFee(){

    $model = new GeneralModel();
    return $model->getGeneralData()["monthlyFee"];
  }

  public function changeAdvertsVisibilityStatus($email, $status){

    $collection = new Firestore("Profiles");

    $profile = $collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==","value"=> $email]
    ]);


    if($profile != false && count($profile) === 1){

      $docs = $this->getAdverts($profile[0]["id"]);

      if(count($docs) > 0){

        if($docs[0]["visible"] === !$status){
  
          if(count($profile) === 0){return false;}
  
          $profile = $profile[0];
          $collection->setCollection("Products");
          $adverts = $collection->getDocuments([
            "where"=> ["field"=> "advertiser","operator"=> "==","value"=> $profile["id"]]
          ]);
  
          if(count($adverts) > 0) {
  
            $batch = $collection->getBatch();
            foreach ($adverts as $advert) {
  
              $doc = $collection->getDocuments(["docName"=> $advert["id"],"documents"=> true]);
              $batch->update($doc,[["path"=>"visible","value"=> $status]],["merge"=>true]);
            }
  
            return $batch->commit();
          }
        }
      }else{
  
        return false;
      }
    }else{

      return false;
    }
  }


}