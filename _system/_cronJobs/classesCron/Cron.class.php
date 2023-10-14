<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 13/02/2018
 * Time: 19:04
 */

namespace _cronJobs;

require_once(dirname(__DIR__).'/config_cron.inc.php');

use classesSystem\crud\Read;
use classesSystem\crud\Update;

class Cron{

  public static function refreshValueCurrencies(){

    $read = new Read('currencies',['id','currency']);
    $dataCurs = $read->getResult();

    if($read->getRowCount()){

      $date = date('Y-m-d H:i:s');
      $arrStatus = [];

      foreach($dataCurs as $key => $val){
        $read = new Read('currencies',['currency'],"currency != '{$val['currency']}'");
        $data = $read->getResult();

        if($read->getRowCount()){

          $arr = [];
          foreach($data as $key1 => $val1){
            $from = $val['currency'];
            $to = $val1['currency'];
            $converting = self::currency_convert($from,$to,1);
            $arr[$val1['currency']] = $converting;
          }

          $jsonData = json_encode($arr);

          $update = new Update('currencies',['price_unit','last_updating'],[$jsonData,$date],"id = {$val['id']}");

          $arrStatus[] = $update->errorInfo();

        }

      }

      self::refreshPriceProducts();

      $arrStatus[] = $date;
      
      return json_encode($arrStatus);

    }

  }

  private static function currency_convert($from,$to,$value){

    $data = file_get_contents("https://finance.google.com/finance/converter?a={$value}&from={$from}&to={$to}");
    preg_match("/<span class=bld>(.*)<\/span>/",$data, $converted);
    $converted = preg_replace("/[^0-9.]/", "", $converted[0]);

    return number_format(round($converted, 3),2);

  }

  private static function refreshPriceProducts(){

    $read2 = new Read('products',['id','price']);

    if($read2->getRowCount()){
      $data = $read2->getResult();

      foreach($data as $key => $value){
        $arrPrices = json_decode($data[$key]['price'],true);

        foreach($arrPrices as $curr => $obj){
          $read = new Read('currencies',["price_unit"],"currency = '{$curr}'");
          if($read->getRowCount()){
            $dataCurrency = json_decode($read->getResult()[0]['price_unit'],true);

            $arrNewPrices = [];

            $arrNewPrices[$curr]['price'] = $obj['price'];
            $arrNewPrices[$curr]['symbol'] = $obj['symbol'];

            foreach($dataCurrency as $curr2 => $price){

              if(array_key_exists($curr2,$arrPrices)){

                $arrNewPrices[$curr2]['price'] = number_format($obj['price'] * $price,2);
                $arrNewPrices[$curr2]['symbol'] = $arrPrices[$curr2]['symbol'];

              } else{
                $read = new Read('currencies',["price_unit","symbol"],"currency = '{$curr2}'");
                $dataNewCurrency = $read->getRowCount() ? $read->getResult()[0] : [];
                $price = json_decode($dataNewCurrency['price_unit'],true)[$curr];
                $symbol = $dataNewCurrency['symbol'];

                $arrNewPrices[$curr2]['price'] = number_format($obj['price'] * $price,2);
                $arrNewPrices[$curr2]['symbol'] = $symbol;

              }

            }

            $arrJson = json_encode($arrNewPrices);
            new Update('products',['price'],[$arrJson],"id = {$value['id']}");

          }
          break;
        }

      }

    }

  }

}