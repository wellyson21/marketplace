<?php
/**
 * Classe Delete => Responsável por excluir registro(s) do banco de dados.
 *
 * @copyright (c) 2016, Web_Development
 */

namespace classesSystem\crud;
use classesSystem\crud\Transaction;


class Delete {
    /** Dados refêrentes a atualização no banco */
    private $Table;
    private $Critery;
    
    /** Sintax para alteração de dados */
    private $Delete;
    
    /** Armazena o número de registros excluidos */
    private $Result;
    
    /** Armazena dados de conexão */
    private $Connection;

    private $errorCode;

    /** 
     * @param string $table   = nome da tabela
     * @param string $critery = criterio de atualização
     */ 
    public function __construct($table, $critery){
        $this->Table   = (string) $table;
        $this->Critery = (string) $critery;
        $this->execute();
    }

    /** Realiza a conexão com o banco de dados e inicia um transação. */
    private function connect(){
        $this->Connection = Transaction::open();
        $this->Connection = Transaction::get();
    }    
    
    /** Retorna o número de resgistro deletados */
    public function rowCount(){
        return $this->Result;
    }

    public function errorInfo(){

      return $this->Create->errorInfo();
    }

    public function errorCode(){

      return $this->errorCode;
    }
    
    /** Monta a sintax e prepara a desclaração para alteração de dados. */
    private function setSyntax(){ 
        $this->Delete = "DELETE FROM {$this->Table} WHERE {$this->Critery}";
        $this->Delete = $this->Connection->prepare($this->Delete);       
    }
    
    /** Realiza ao conexão e trata de possível erros */
    private function execute(){
        try{
            $this->connect();
            $this->setSyntax();
            $this->Delete->execute();
            $this->Result = $this->Delete->rowCount();
            $this->errorCode = $this->Connection->errorCode();
            Transaction::close();
        } catch (Exception $e) {
            echo '<b>Erro:</b> '.$e.getLine();
            Transaction::rollback();
            exit();
        }
    }
    
}
