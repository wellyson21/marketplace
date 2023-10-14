<?php
/**
 * Created by IntelliJ IDEA.
 * User: welly
 * Date: 18/07/2019
 * Time: 03:18
 */

namespace classes\models;

use classesSystem\utilities\Firestore;
use classesSystem\utilities\Request;

class GeneralModel{

  public function getGeneralData(){

    $collection = new Firestore("General");
    return $collection->getDocuments()[0];
  }

  public static function sendEmail($data){

    $to = $data['to'];
    $message = $data['message'];
    $subject = @$data['subject'] ? $data['subject'] : "Madefrio";
    return imap_mail($to,$subject,$message);
  }

  public static function update_site_map(){

    $collection = new Firestore("General");
    $collection_data = $collection->getDocuments()[0];

    $current_date = $collection_data;
    $current_date = $current_date["sitemapUpdate"];
    $current_date_str = $current_date->get()->format("Y-m-d");

//    $current_date = new Read('general_settings',['sitemap_update']);
//    $current_date = $current_date->getResult()[0]['sitemap_update'];
    $current_date = explode('-',$current_date_str);

    if(!self::dateExpired(date('Y-'.$current_date[1].'-'.$current_date[2]))){return;}

    $base_url = Request::SERVER('BASE_URL');

    $main_pages = [
      [$base_url,1],
      [$base_url.'products/',1],
      [$base_url.'contact/',1],
      [$base_url.'about/',1],
      [$base_url.'login/',1],
    ];


    ///Mount sitemap///
    $collection->setCollection("Products");
    $products =  $collection->getDocuments();

    $site_map = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";

    foreach ($main_pages as $page){
      $site_map .= "\n<url><loc>{$page[0]}</loc><changefreq>weekly</changefreq><priority>{$page[1]}</priority></url>";
    }

    $url_products = $base_url.'products/';

    foreach ($products as $product_code){

      $site_map .= "\n<url><loc>{$url_products}{$product_code['id']}/</loc><changefreq>weekly</changefreq><priority>1</priority></url>";
    }

    $site_map .="</urlset>";

    $fp = fopen('sitemap.xml','w+');
    fwrite($fp,$site_map);
    fclose($fp);
    ///end mount sitemap///


    $update_date = self::getIncrementedDate($current_date_str,7);

//    new Update('general_settings',['sitemap_update'],[$update_date],"id is not null");

    $collection->setCollection("General");
    $collection->updateDocument(["sitemapUpdate"=> $update_date],$collection_data["id"]);

  }



  ///Utilities
  public static function getIncrementedDate($date = null, $to = null){

    $date = $date ? $date : date("Y-m-d");
    $current_date = explode('-',$date);

    $cm = (int)$current_date[1];
    $cd = (int)$current_date[2];

    $fullMonths = [1,3,5,7,9,11];
    $monthDays = in_array($cm,$fullMonths) ? 31 : 30;
    $updateDayCount = $to;

    if(is_int($updateDayCount)){

      if($cm === 2 && $cd + $updateDayCount > 27){
        $update_day = ($cd + $updateDayCount) - 27;
        $update_month = $cm + 1;
      }else if($cm !== 2 && $cd + $updateDayCount > $monthDays){
        $update_day = $cd + $updateDayCount - $monthDays;
        $update_month = $cm + 1 > 12 ? 1 : $cm + 1;
      }else{
        $update_day = $cd + $updateDayCount;
        $update_month = $cm;
      }

      $update_month = $update_month < 10 ? "0".$update_month : $update_month;
      $update_day = $update_day < 10 ? "0".$update_day : $update_day;
    }else{

      $update_month = $cm + 1 > 12 ? 1 : $cm + 1;
      $update_month = $update_month < 10 ? "0".$update_month : $update_month;
      $update_day = $cd < 10 ? "0".$cd : $cd;
    }

    $update_date = date('Y-'.$update_month ."-". $update_day);
    $update_date = date_create($update_date);

    return $update_date;
  }

  public static function dateExpired($date){

    $current_date = explode('-',$date);

    $s_current_date = date_create(date('Y-m-d'));
    $s_update_date = date_create(date($current_date[0].'-'.$current_date[1].'-'.$current_date[2]));
    $ddiff = date_diff($s_update_date,$s_current_date);

    if($ddiff->days > 0 && $ddiff->invert || $ddiff->days > 0 && $ddiff->m > 0 && $ddiff->invert){

      return false;
    }else{

      return true;
    }
  }


}