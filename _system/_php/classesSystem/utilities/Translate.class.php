<?php
/**
 * Created by PhpStorm.
 * User: KENPACHI
 * Date: 05/09/2017
 * Time: 02:49
 */

namespace classesSystem\utilities;


use classesSystem\crud\Read;

class Translate{

  private static $langs = ['pt-br','en','zh-cn','zh','pt','es','fr','ja','de','ca','el','la','it','auto','zh-tw'];

  //execute the routing
  public function __construct($blank = false){

    if(!$blank){

      if(Request::POST("translate") === "true"){

        echo json_encode($this->exec(Request::POST("from"),Request::POST("to"),json_decode(Request::POST('data'),true)));
      }else if(Request::POST("settingCache") === "true"){

        self::config();
      }else if(Request::POST("generateViewCode") === "true"){

        $pageInfo = json_decode(Request::POST("PAGE_INFO"),true);
        echo json_encode(['viewCode'=>sha1(self::getElementCode($pageInfo["id"].Request::POST("viewName")))]);
      }
    }
  }

  //execute a translation
  public function exec($from,$to,Array $text = [],$exploded = true){

    if(!in_array(strtolower($from),self::$langs) || !in_array(strtolower($to),self::$langs)){return false;}

    $count = count($text);
    $textArr = $text;

    if($count === 0){

      return [];
    }

    if($exploded){

      $text = trim($text[0]);
    }else{

      foreach ($text as $key=>$item) {$text[$key] = trim($text[$key]);}

      $text = implode(" ,[(==|-(=##=##=)-|==)], ",$text);
    }

    $text = urlencode($text);
//    $text = urldecode($text);

//    echo json_encode([count($textArr)]);

//    return $text;


    try{


//      $json = [[[$text]]];
      $json = json_decode(@file_get_contents("https://translate.googleapis.com/translate_a/single?&client=gtx&sl={$from}&tl={$to}&dt=t&q={$text}"),true);


      if($json == null){

        return [];
      }


//      $json2 = json_decode(@file_get_contents("https://translate.googleapis.com/translate_a/single?&client=gtx&sl={$from}&tl={$to}&dt=t&q={$text}"),true);
//      $json = json_decode(@file_get_contents("http://api.mymemory.translated.net/get?q={$text}&langpair={$from}|{$to}"),true);
//      $json = json_decode(@file_get_contents("http://api.mymemory.translated.net/get?q={$text}&langpair={$from}|{$to}"),true);
//      $json = (file_get_contents("http://www.worldlingo.com/S000.1/api?wl_srclang={$from}&wl_trglang={$to}&wl_password=secret&wl_data={$text}"));
//      $json = substr($json,1);
//      $json = json_decode(file_get_contents("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170907T094114Z.c9e4de2dbaef6dd4.75268ab9489c81cd7ab2c9809b6793eb693737f2&text={$text}&lang={$to}&options=1"),true);
//      $json = json_decode(file_get_contents("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170907T094114Z.c9e4de2dbaef6dd4.75268ab9489c81cd7ab2c9809b6793eb693737f2&text={$text}&lang={$from}-{$to}"),true);


      $str = "";
      foreach ($json[0] as $part){

        $str .= @$part[0]."";
      }

      $json = $str;

//      return $json;

//      $appKey = "trnsl.1.1.20180318T125105Z.607935afc2e9beaf.887c1fbecc6c7b6e89d8a21785cf0970ac05a446";//ipartts
//      $appKey = "trnsl.1.1.20170907T094114Z.c9e4de2dbaef6dd4.75268ab9489c81cd7ab2c9809b6793eb693737f2";//developer

//      $data = http_build_query(['text'=> $text]);
//
//      if(strtolower($from) === 'auto'){
//
//        $url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key={$appKey}&lang={$to}&options=1&text={$text}";
//      }else{
//
//        $url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key={$appKey}&lang={$from}-{$to}&text={$text}";
//      }
//
//      $context = stream_context_create(array(
//        'https' => array(
//          'method' => 'POST',
//          'content' => $data,
//          'header' => "Content-type: application/x-www-form-urlencoded\r\n"
//            . "Content-Length: " . strlen($data) . "\r\n",
//        )
//      ));

//      $json = json_decode(file_get_contents($url,null,$context),true);
//      $json = $json['text'][0];
    }catch (\Exception $e){return false;}

    $str = "the current password to update email or change current password is required, the[(==)], e-mail:";
//    $json = preg_split("@[ ]?\,?\[[ ]*\([ ]*\=[ ]*\=[ ]*\)[ ]*\][ ]?\,?@", $str);

    if($count > 1 || $exploded) {

//      $json = (preg_split("@[ ]*\,[ ]*.[ ]*\[[ ]*\([ ]*\=[ ]*\=[ ]*\)[ ]*\][ ]*.[ ]*\,@", $json));
      $json = (preg_split("@[ ]?\,?[ ]?\[[ ]?\([ ]?\=[ ]?\=[ ]?\|[ ]?\-[ ]?\([ ]?\=[ ]?\#[ ]?\#[ ]?\=[ ]?\#[ ]?\#[ ]?\=[ ]?\)[ ]?\-[ ]?\|[ ]?\=[ ]?\=[ ]?\)[ ]?\][ ]?\,?@", $json));

      if(is_array($json) && !$exploded){

        foreach ($json as $k=>$v){
          $v = trim($v);

          $fromText = $textArr[$k];
          $toText = $v;

          if($fromText[strlen($fromText) - 1] !== "," && $toText[strlen($toText) - 1] === ","){

            $json[$k] = trim(substr($toText,0,strlen($toText) - 1));
          }
        }
      }

    }else{$json = [trim($json)];}

    return $json;
  }

  //set and read cache
  private static function config(){

    $pageInfo = json_decode(Request::POST("pageInfo"),true);
    if(!$pageInfo){return;}

    $data = @json_decode(Request::POST("data"),true);
    $action = Request::POST("action");
    $pageId = $pageInfo['id'];
    $readIndexes = json_decode(Request::POST("readIndexes"),true);

    @mkdir("_application/_json/_translate",0777,true);

    $json = new Json([
      "routeFolder"=>"_application/_json/_translate/",
      "fileName"=> $pageId.'.json'
    ]);

    $ESDataJs = [
      "data"=>[
        "fixed"=>[],
        "ajax"=>[]
      ],
      "last_access"=>date("Y-m-d")
    ];

    foreach (self::getLanguages() as $lang){

      $lang = $lang["lang_code"];
      $ESDataJs["data"]["fixed"][$lang] = [];
      $ESDataJs["data"]["ajax"][$lang] = [];
    }

    $json->createJson(json_encode($ESDataJs));
    $dataJsf = $json->readJson(true);

    if($action === 'update_ajax'){

      $dataJsf['data']['ajax'][Request::POST("index")] = $data;
      $data = $dataJsf;
      $json->replaceJson($data);
      echo json_encode($data);
    }
    else if($action === 'update_fixed'){

      $dataJsf['data']['fixed'][Request::POST("index")] = $data;
      $data = $dataJsf;
      $json->replaceJson($data);
      echo json_encode($data);
    }
    else if($action === 'read'){

      $dataJsf = $json->readJson(true);
      $dataJsf['last_access'] = date('Y-m-d');

      $readData = [
        'data'=>[
          'fixed'=>[
            $readIndexes['from']=> isSet($dataJsf['data']['fixed'][$readIndexes['from']]) ? $dataJsf['data']['fixed'][$readIndexes['from']] : [],
            $readIndexes['to']=> isSet($dataJsf['data']['fixed'][$readIndexes['to']]) ? $dataJsf['data']['fixed'][$readIndexes['to']] : []
          ],
          'ajax'=>[
            $readIndexes['from']=> isSet($dataJsf['data']['ajax'][$readIndexes['from']]) ? $dataJsf['data']['ajax'][$readIndexes['from']] : [],
            $readIndexes['to']=> isSet($dataJsf['data']['ajax'][$readIndexes['to']]) ? $dataJsf['data']['ajax'][$readIndexes['to']] : []
          ]
        ]
      ];

      $json->replaceJson($dataJsf);
      echo json_encode($readData);
    }

    //delete pages not accessed
    $current_date = date("Y-m-d");
    $current_date = date_create($current_date);
    $delete_page_after = 10;

    $folder = "_application/_json/_translate/";

    if(!file_exists($folder."update_info.txt")){

      $fp = fopen($folder."update_info.txt","w+");
	    fwrite($fp,date("Y-m-d"));
    }else{

      $fp = fopen($folder."update_info.txt","r");
    }

    $update_info_fs = filesize($folder."update_info.txt");
    $update_info_fs = $update_info_fs > 0 ? $update_info_fs : 1;
    $update_info = explode('-',fread($fp,$update_info_fs));
    fclose($fp);
	
    if(count($update_info) === 3){

      $last_update = implode("-",$update_info);
      $last_update = date_create($last_update);
      $is_update = date_diff($last_update,$current_date);

      if($is_update->days >= $delete_page_after || $is_update->m >= 1) {

        $translate_json_dir = dir($folder);
        while ($file = $translate_json_dir->read()){

          if(!is_dir($folder.$file) && $file !== "update_info.txt"){

            $current_page_json = new Json(["routeFolder"=> $folder,"fileName"=> $file]);
            $current_page_json = $current_page_json->readJson(true);

            $last_access = $current_page_json['last_access'];
            $last_access = date_create($last_access);
            $is_delete = date_diff($last_access,$current_date);

            if($is_delete->days >= $delete_page_after || $is_delete->m >= 1) {

               @unlink($folder.$file.".json");
            }
          }
        }
	  }
    }
  }

  //generate element Code
  public static function getElementCode($routeId,$viewId = ''){

    return sha1($routeId.$viewId);
  }

  //get system languages //default table: languages
  private static function getLanguages(){

//    $langs = new Read("languages");
//    $langs = $langs->getResult();
    $langs = [
      ["lang_code"=>"pt"],
      ["lang_code"=>"en"],
      ["lang_code"=>"es"],
    ];
    return $langs;
  }

}