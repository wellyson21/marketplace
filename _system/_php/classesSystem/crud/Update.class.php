<?php
/**
 * Classe Update => Reponsável por realizar alterações em registros no banco de dados.
 *
 * @copyright (c) 2016, Web_Development
 */

namespace classesSystem\crud;
use classesSystem\crud\Transaction;


class Update {
    /** Dados refêrentes a atualização no banco */
    private $Table;
    private $Columns;
    private $Values;
    private $Critery;
    
    /** Sintax para alteração de dados */
    private $Update;
    
    /** Array com os binds */
    private $Places;
    
    /** Armazena o número de registros atualizados */
    private $result;
    
    /** Armazena dados de conexão */
    private $Connection;

    /** Armazana informações de erro ***/
    private $erroInfo;

    private $errorCode;

    /** 
     * @param string $table   = nome da tabela
     * @param array $columns  = array com os nomes das colunas
     * @param array $values   = array com os valores das respectivas colunas
     * @param string $critery = criterio de atualização
     */ 
    public function __construct($table, array $columns, array $values, $critery){
        $this->Table   = (string) $table;
        $this->Columns = $columns;
        $this->Values  = $values;
        $this->Critery = (string) $critery;
        $this->execute();
    }
    
    /** Realiza a conexão com o banco de dados e inicia um transação. */
    private function connect(){
        $this->Connection = Transaction::open();
        $this->Connection = Transaction::get();
    }  
    
    /** Retorna o número de resgistro atualizados */
    public function rowCount(){
        return $this->result;
    }

    public function errorInfo(){
      return $this->Update->errorInfo();
    }

    public function errorCode(){
      return $this->Update->errorCode();
    }

    /** Monta a sintax e prepara a desclaração para alteração de dados. */
    private function setSyntax(){ 
        $columns = array_values($this->Columns);
        $values  = array_values($this->Values);

        $setColumns = [];
        $setBinds = [];
        for ($i = 0; $i < count($columns); $i++) {
            $setColumns[] = $columns[$i].' = :'.$columns[$i];
            $setBinds[$columns[$i]] = $values[$i];
        }  
        
        $setColumns = implode(', ',$setColumns);
        $this->Places = $setBinds;
        
        $this->Update = "UPDATE {$this->Table} SET {$setColumns} WHERE {$this->Critery}";
        $this->Update = $this->Connection->prepare($this->Update);
    }
    
    /** Realiza ao conexão e trata de possível erros. */
    private function execute(){        
        try{
            $this->connect();
            $this->setSyntax();
            $this->Update->execute($this->Places);
            $this->result = $this->Update->rowCount();
            $this->errorCode = $this->Connection->errorCode();
          Transaction::close();
        } catch (\Exception $e) {
            echo '<b>Erro:</b> '.$e.getLine();
            Transaction::rollback();
            exit();
        }
    }
    
}
