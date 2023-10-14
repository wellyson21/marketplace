<?php
/**
 * Created by PhpStorm.
 * User: lucas
 * Date: 06/02/2019
 * Time: 14:37
 */

namespace classesManager\utilities;

use classesSystem\utilities\Upload;

class UploadFiles {

  public static function saveImages(array $toUpdate = null){

    $allPathsUpload = [];

    if(isset($_FILES["mainImage"]) || isset($_FILES["secondaryImages"])){

      Upload::$dir = "_manager/_medias/";
    }

    if(isset($_FILES["mainImage"])){

      $mainImage = $_FILES["mainImage"];

      if($mainImage['error'] == 0){

        Upload::images("_images/_uploaded",$mainImage);
        $allPathsUpload["mainImage"] = Upload::getImgName(true);

        if($allPathsUpload["mainImage"] && $toUpdate != null){

          @unlink($toUpdate["mainImage"]);
        }
      }
    }

    if(isset($_FILES["secondaryImages"])){

      $arr = [];
      $imagesSecondaries = $_FILES["secondaryImages"];
      foreach($imagesSecondaries['error'] as $key => $value){

        $arr2 = [];
        if($value == 0){

          $arr2["name"] = sha1(date("Y-m-d-H-i-s")."-".$key) . $imagesSecondaries["name"][$key];
          $arr2["type"] = $imagesSecondaries["type"][$key];
          $arr2["tmp_name"] = $imagesSecondaries["tmp_name"][$key];
          $arr2["error"] = $imagesSecondaries["error"][$key];
          $arr2["size"] = $imagesSecondaries["size"][$key];

          $arr[] = $arr2;

          $allPathsUpload["imagesOrder"][] = $key;
        }
      }

      if(count($arr) > 0){

        Upload::images("_images/_uploaded", $arr, true);
        $allPathsUpload["secondaryImages"] = Upload::getImgName(true);

        if(count($allPathsUpload["secondaryImages"]) > 0  && $toUpdate != null){

          foreach($allPathsUpload["imagesOrder"] as $v){

            if($v <= $toUpdate["secondaryImages"]){

              @unlink($toUpdate["secondaryImages"][$v]);
            }
          }
        }
      }
    }

    return $allPathsUpload;
  }

}
