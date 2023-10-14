<?php
/**
 * Created by PhpStorm.
 * User: KENPACHI
 * Date: 18/08/2017
 * Time: 09:27
 */

namespace classesSystem\crud;
use classesSystem\crud\Connection;

class Query{

  private $connection;
  private $query;
  private $rouwCount;
  private $error_info;
  private $error_code;
  private $result;

  public function __construct($query){

    $this->query = $query;

    $this->exec_query();
  }

  private function connect(){

    $this->connection = Connection::openConnection();

  }

  private function exec_query(){

    $this->connect();

    $query = $this->connection->query($this->query);
    $this->result = $query->fetchAll(\PDO::FETCH_ASSOC);
    $this->rouwCount = $query->rowCount();
    $this->error_info = $query->errorInfo();
    $this->error_code = $query->errorCode();

  }

  public function errorInfo(){

    return $this->error_info;
  }

  public function errorCode(){

    return $this->error_code;
  }

  public function getRowCount(){

    return $this->rouwCount;
  }

  public function getResult(){

    return $this->result;
  }


}