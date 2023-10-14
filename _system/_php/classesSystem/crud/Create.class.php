<?php
/**
 * Classe Create => Responsável por cria um novo registro no banco de dados.
 *
 * @copyright (c) 2016, Web_Development
 */
namespace classesSystem\crud;
use classesSystem\crud\Transaction;

class Create {
    /** Dados refêrentes a inserção de dados no banco */
    private $Table;
    private $Columns;
    private $Values;

    /** Armazena a instrução para a inserção */
    private $Create;

    /** Array com os binds */
    private $Places;

    /** Armazena o número de registros criados */
    private $Result;

    /** Armazena o número do último id inserido */
    private $LastId;

    /** Armazena dados de conexão */
    private $Connection;

    private $errorCode;
    /**
     * @param string $table   = nome da tabela
     * @param array $columns  = array com os nomes das colunas
     * @param array $values   = array com os valores das respectivas colunas
     */
    public function __construct($table, array $columns, array $values){
        $this->Table   = (string) $table;
        $this->Columns = $columns;
        $this->Values  = $values;
        $this->execute();
    }

    /** Realiza a conexão com o banco de dados e inicia um transação. */
    private function connect(){
        $this->Connection = Transaction::open();
        $this->Connection = Transaction::get();
    }

    /** Retorna o número de registro criados. */
    public function rowCount(){
        return $this->Result;
    }

    /** Retorna o id do último registro inserido. */
    public function getLastId(){
        return $this->LastId;
    }

    public function errorInfo(){

      return $this->Create->errorInfo();
    }

    public function errorCode(){

      return $this->errorCode;
    }

    /** Monta a sintax e prepara a desclaração para inserção de dados. */
    private function setSyntax(){ 
        $columns = array_values($this->Columns);
        $values  = array_values($this->Values);
        count($columns) === count($values) ? true : exit;
        
        $result = [];
        for ($i = 0; $i < count($columns); $i++) {
            $result[$columns[$i]] = $values[$i];
        }
        
        $this->Places = $result;
        $column = implode(',',array_keys($result));
        $binds = ':'.implode(',:',array_keys($result));
        $this->Create = "INSERT INTO {$this->Table} ({$column}) VALUES ({$binds})";
        $this->Create = $this->Connection->prepare($this->Create);
       }

    /** Realiza ao conexão e trata de possível erros. */
    private function execute(){        
        try{
            $this->connect();
            $this->setSyntax();
            $this->Create->execute($this->Places);
            $this->Result = $this->Create->rowCount();
            $this->LastId = $this->Connection->lastInsertId();
            $this->errorCode = $this->Connection->errorCode();
            Transaction::close();
        }catch(\PDOException $e) {
            echo '<b>Erro:</b> '.$e.getLine();
            Transaction::rollback();
            exit();
        }       
    }    
}
