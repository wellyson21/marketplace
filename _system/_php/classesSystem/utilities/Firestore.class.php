<?php
/**
 * Created by PhpStorm.
 * User: lucas
 * Date: 26/06/2019
 * Time: 22:17
 */

namespace classesSystem\utilities;

use Google\Cloud\Firestore\FirestoreClient;
use League\Flysystem\Exception;

class Firestore {

  private $db;
  private $name;

  public function  __construct($collectionName,$projectId = null, $keyPath = null){

    $this->db = new FirestoreClient([
      'projectId' => $projectId ? $projectId : $GLOBALS['settingsFirestore']['projectId'],
      'keyFile' => json_decode(file_get_contents($keyPath ? $keyPath : $GLOBALS['settingsFirestore']['keyPath']), true)
    ]);


    $this->name = $collectionName;
  }


  /******************************************** Setters and Getters Methods *******************************************/

  
  public function getCollectionRef() {

    return $this->db->collection($this->name);
  }

  public function getCollection() {

    return $this->name;
  }

  public function setCollection($name) {

    $this->name = $name;
  }

  /*********************************************** Operational Methods ************************************************/
  public function getDocuments(array $arg = null) {

    $docName = isset($arg['docName']) ? $arg['docName'] : null;
    $where = isset($arg['where']) ? $arg['where'] : null;
    $snapshot = isset($arg["snapshot"]) ? $arg["snapshot"] : false;
    $documents = isset($arg["documents"]) ? $arg["documents"] : false;
    $orderBy = isset($arg["orderBy"]) ? $arg["orderBy"] : null;
    $limit = isset($arg["limit"]) ? $arg["limit"] : 0;
    $startAt = isset($arg["startAt"]) ? $arg["startAt"] : null;
    $endAt = isset($arg["endAt"]) ? $arg["endAt"] : null;

    if((!isset($docName) && !isset($where) && !isset($startAt))) {

      return $this->queryAllDocs($orderBy,$limit,$snapshot,$documents);
    } else if(isset($docName)) {

      return $this->queryWithDocName($docName,$snapshot,$documents);
    } else if(isset($where) || isset($startAt)) {

      return $this->queryWithWhere($where,$orderBy,$limit,$startAt,$endAt,$snapshot,$documents);
    }

    return [];
  }

  public function newDocument(array $data, $docName = null) {

    try {

      if(count($data)) {

        if (isset($docName)) {

          if(!$this->db->collection($this->name)->document($docName)->snapshot()->exists()) {

            $this->db->collection($this->name)->document($docName)->create($data);
            return true;
          } else {
            throw new Exception('The document already exists!');
          }
        } else {

          $this->db->collection($this->name)->add($data);
          return true;
        }
      } else {
        throw new Exception('No data to be written in the new document!');
      }
    } catch (Exception $exception) {
      return $exception->getMessage();
    }
  }

  public function updateDocument(array $data, $docName, $merge = true) {

    $this->db->collection($this->name)->document($docName)->set($data, ['merge' => $merge]);
    return true;
  }

  public function dropDocument($docName) {

    $this->db->collection($this->name)->document($docName)->delete();
    return true;
  }


  private function queryWithDocName($docName,$snapshot = false,$documents = false) {

    try {

      if($this->db->collection($this->name)->document($docName)->snapshot()->exists()) {

        if($documents){

          return $this->db->collection($this->name)->document($docName);
        }else if($snapshot){

          return $this->db->collection($this->name)->document($docName)->snapshot();
        }else{

          $sd = $this->db->collection($this->name)->document($docName)->snapshot();
          $id = explode("/",$sd->name());
          $id = trim($id[count($id) - 1]);
          $d = $sd->data();
          $d["id"] = $id;

          return $d;
        }
      } else {
        throw new Exception('Document are no exists!');
      }
    } catch(Exception $exception) {
      return $exception->getMessage();
    }
  }


  public function getBatch(){

    return $this->db->batch();
  }

  /************************************************ Auxiliary Methods *************************************************/

  private function queryAllDocs($orderBy = [],$limit = 0,$snapshot = false,$documents = false) {

    $orderBy = is_array($orderBy) ? $orderBy : [];
    $query = $this->db->collection($this->name);

    if(count($orderBy) > 0){
      foreach ($orderBy as $prop=>$value){
        $query = $query->orderBy($prop,$value);
      }
    }

    if($limit > 0){

      $query = $query->limit($limit);
    }

    if($documents){

      return $query->documents();
    }

    $query = $query->documents()->rows();

    if($snapshot){

      return $query;
    }

    $arr = [];
    if(!empty($query)) {

      foreach($query as $item) {
        $id = explode("/",$item->name());
        $id = trim($id[count($id) - 1]);
        $d = $item->data();
        $d["id"] = $id;
        $arr[] = $d;
      }
    }

    return $arr;
  }

  private function queryWithWhere($where = [],$orderBy = [],$limit = 0,$startAt = null,$endAt = null,$snapshot = false,$documents = false) {

    $where = is_array($where) ? $where : [];
    $orderBy = is_array($orderBy) ? $orderBy : [];

    try {

      $query = $this->db->collection($this->name);

      ///Setup Where
      if(count($where) > 0){
        if(isset($where[0]) && is_array($where[0])){
          foreach ($where as $data) {

            extract($data);
            if(isset($field) && isset($operator) && isset($value)) {

              $query = $query->where($field, $operator, $value);
            } else {
              throw new Exception("Error: The 'where' clause should contain 'field', 'operator' and 'value'.");
            }
          }
        }else if(count($where) === 3){
          extract($where);
          if(isset($field) && isset($operator) && isset($value)) {

            $query = $query->where($field, $operator, $value);
          } else {
            throw new Exception("Error: The 'where' clause should contain 'field', 'operator' and 'value'.");
          }
        }
      }



      if($limit > 0){

        $query = $query->limit($limit);
      }

      if(count($orderBy) > 0){
        foreach ($orderBy as $prop=>$value){

          $query = $query->orderBy($prop,$value);
        }
      }

      if($startAt != null){

        $query = $query->startAt($startAt);
      }

      if($endAt != null){

        $query = $query->endAt($endAt);
      }

      if($documents){

        return $query->documents();
      }

      ///Setup Result
      $query = $query->documents()->rows();
      $arr = [];

      if(!empty($query)) {

        if(!$snapshot){
          foreach($query as $item) {
            $id = explode("/",$item->name());
            $id = trim($id[count($id) - 1]);
            $d = $item->data();
            $d["id"] = $id;
            $arr[] = $d;
          }
        }else{

          return $query;
        }
      }

      return $arr;
    } catch (Exception $exception) {

      return $exception->getMessage();
    }
  }


}
