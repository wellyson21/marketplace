<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 25/07/2017
 * Time: 13:17
 */

namespace classesSystem\utilities;

use classesSystem\crud\Create;
use classesSystem\crud\Read;
use classesSystem\crud\Update;

class Json {

  // Attributes for JSON database
  private $TableJsonDB;
  private $ColumnIdJsonDB;
  private $ColumnNameJsonDB;
  private $ColumnDataJsonDB;
  private $NameJsonDB;
  public $IdJsonDB;

  // Attributes for JSON file
  private $RouteFolder;
  private $FileName;

  public function __construct(array $settings){

    // Initialization attributes for manipulating JSON from the database
    $this->NameJsonDB = isset($settings['nameJsonDB']) ?  $settings['nameJsonDB'] : null;
    $this->TableJsonDB = isset($settings['tableJsonDB']) ? $settings['tableJsonDB'] : null;
    $this->ColumnIdJsonDB = isset($settings['colIdJsonDB']) ? $settings['colIdJsonDB'] : null;
    $this->ColumnNameJsonDB = isset($settings['colNameJsonDB']) ? $settings['colNameJsonDB'] : null;
    $this->ColumnDataJsonDB = isset($settings['colDataJsonDB']) ? $settings['colDataJsonDB'] : null;

    // Initialization attributes for manipulating JSON file
    $this->RouteFolder = isset($settings['routeFolder']) ? $settings['routeFolder'] : null;
    $this->FileName = isset($settings['fileName']) ? $settings['fileName'] : null;

  }

  public function readJsonDB($arr = false){

    $nameJsonDB = $this->NameJsonDB;
    $tableDB = $this->TableJsonDB;
    $idJson = $this->ColumnIdJsonDB;
    $colDataJson = $this->ColumnDataJsonDB;
    $json = '';

    $read = new Read($tableDB, ['*'], "nameJson = '{$nameJsonDB}'");
    $data = $read->getResult();

    if($read->getRowCount() > 0){
      $json = json_decode($data[0]["{$colDataJson}"],$arr);
      $this->IdJsonDB = $data[0]["{$idJson}"];
    }

    return $json;

  }

  public function createJsonDB($dataJson){

    $nameJsonDB = $this->NameJsonDB;
    $tableDB = $this->TableJsonDB;
    $colNameJson = $this->ColumnNameJsonDB;
    $colDataJson = $this->ColumnDataJsonDB;

    $read = new Read($tableDB,['nameJson'],"nameJson = '{$nameJsonDB}'");

    if($read->getRowCount() == 0){
      new Create($tableDB,["{$colNameJson}","{$colDataJson}"], ["{$nameJsonDB}","{$dataJson}"]);
    }

  }

  public function updateDataJsonDB(array $dataUpdate,$setting = true){

    $read = $this->readJsonDB();

    if($setting){

      $newData = $this->configUpdateJson($read, $dataUpdate);
      $dataJson = json_encode($newData);
    }else{

      $dataJson = json_encode($dataUpdate);
    }

    $table = $this->TableJsonDB;
    $colData = $this->ColumnDataJsonDB;
    $colId = $this->ColumnIdJsonDB;
    $id = $this->IdJsonDB;

    new Update($table,["{$colData}"],["{$dataJson}"],"{$colId} = {$id}");
  }

  public function addDataJson(){

  }

  public function json_exist(){

    return file_exists($this->RouteFolder.$this->FileName);
  }

  public function deleteDataJson(){


  }

  /*#************************************** Methods for handling JSON files *****************************************#*/

  public function readJson($arr = false){

    $fileName = $this->FileName;
    $routeFolder = $this->RouteFolder;
    $routeFolderCheck = implode('\\',explode('/',$routeFolder));
    $routeFolderCheck = str_replace("\\","/",$routeFolderCheck);
    $content = '';

    if(file_exists($routeFolderCheck.$fileName)) {

      $read = file_get_contents($routeFolder.$fileName);
      $content = json_decode($read,$arr);
    }

    return $content;
  }

  public function createJson($dataJson){

    $fileName = $this->FileName;
    $routeFolder = $this->RouteFolder;
    $routeFolderCheck = implode('\\',explode('/',$routeFolder));
    $routeFolderCheck = str_replace("\\","/",$routeFolderCheck);

    if(is_dir($routeFolderCheck)){

      if(!file_exists($routeFolderCheck.$fileName)){

        $this->configCreateJson($dataJson);
      }
    } else{

      mkdir($routeFolderCheck);
      $this->configCreateJson($dataJson);
    }

    return true;
  }

  public function updateJson(array $dataUpdate){

    $read = $this->readJson();
    $this->configUpdateJson($read, $dataUpdate);
    $dataJson = json_encode($read);
    $this->writeUpdateJson($dataJson);
  }

  public function replaceJson(Array $data){

    $dataJson = json_encode($data);
    $this->writeUpdateJson($dataJson);
    return $data;
  }

  /*#************************************** Essential methods for other methods *************************************#*/

  private function configUpdateJson($read, array $dataUpdate){

    foreach($dataUpdate as $attr => $value){ // level => 0

      if(is_array($value)){

        foreach ($value as $attr1 => $value1){ // level => 1

          if(is_array($value1)){

            foreach ($value1 as $attr2 => $value2){ // level => 2

              if(is_array($value2)){

                foreach ($value2 as $attr3 => $value3){ // level => 3

                  if(is_array($value3)){

                    foreach ($value3 as $attr4 => $value4){ // level => 4

                      if(is_array($value4)){

                        foreach ($value4 as $attr5 => $value5){ // level => 5

                          if(is_array($value5)){

                          } else{


                            if(is_string($attr5)){

                              $read->$attr->$attr1->$attr2->$attr3->$attr4->$attr5 = $value5;

                            } else{

                              $arr = $read->$attr->$attr1->$attr2->$attr3->$attr4;
                              $arr[$attr5] = $value5;
                              $read->$attr->$attr1->$attr2->$attr3->$attr4 = $arr;

                            }

                          }

                        }

                      } else{

                        if(is_string($attr4)){

                          $read->$attr->$attr1->$attr2->$attr3->$attr4 = $value4;

                        } else{

                          $arr = $read->$read->$attr->$attr1->$attr2->$attr3;
                          $arr[$attr4] = $value4;
                          $read->$attr->$attr1->$attr2->$attr3 = $arr;

                        }

                      }

                    }

                  } else{

                    if(is_string($attr3)){

                      $read->$attr->$attr1->$attr2->$attr3 = $value3;

                    } else{

                      $arr = $read->$attr->$attr1->$attr2;
                      $arr[$attr3] = $value3;
                      $read->$attr->$attr1->$attr2 = $arr;

                    }

                  }

                }

              } else{

                if(is_string($attr2)){

                  $read->$attr->$attr1->$attr2 = $value2;

                } else{

                  $arr = $read->$attr->$attr1;
                  $arr[$attr2] = $value2;
                  $read->$attr->$attr1 = $arr;

                }

              }

            }

          } else{

            if(is_string($attr1)){

              $read->$attr->$attr1 = $value1;

            } else{

              $arr = $read->$attr;
              $arr[$attr1] = $value1;
              $read->$attr = $arr;

            }

          }

        }

      } else {

        $read->$attr = $value;

      }

    }

    return $read;

  }

  private function writeUpdateJson($newDataJson){

    $fileName = $this->FileName;
    $routeFolder = $this->RouteFolder;
    $file = fopen($routeFolder.$fileName, 'w+');
    fwrite($file,$newDataJson);
    fclose($file);

  }

  private function configCreateJson($dataJson){

    $routeFolder = $this->RouteFolder;
    $fileName = $this->FileName;


    $createFile = fopen($routeFolder.$fileName,'w');
    fwrite($createFile,$dataJson);
    fclose($createFile);

  }

}