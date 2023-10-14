<?php
/**
 * Classe Read => Responsável por lê os registro e retona-lós para listagem.
 *
 * @copyright (c) 2016, Web_Development
 */

namespace classesSystem\crud;
use classesSystem\crud\Transaction;


class Read{

    /** Dados refêrentes a consulta ao banco */
    private $Table;
    private $Columns;
    private $Critery;

    /** Sintax para consulta de dados */
    private $Select;

    /** Armazena os registros retornados */
    private $Result;
    private $rowCount;

    /** Armazena dados de conexão */
    private $Connection;

    /**
     * @param string $table   = nome da tabela
     * @param array $columns  = array com os nomes das colunas [opcional]
     * @param string $critery = criterio de consulta [opcional]
     */
    public function __construct($table, array $columns = null, $critery = null) {
        $this->Table = (string) $table;
        $this->Columns = $columns ? $columns : '*';
        $this->Critery = (string) $critery ? $critery : false;
        $this->execute();
    }

    /** Realiza a conexão com o banco de dados e inicia um transação. */
    private function connect(){
        $this->Connection = Transaction::open();
        $this->Connection = Transaction::get();
    }

    /** Retorna todos os resgistros consultados */
    public function getResult($className = null) {

        if($className){
            $this->Result = $this->Select->fetchAll(\PDO::FETCH_CLASS,$className);
        }
        else{
            $this->Result = $this->Select->fetchAll(\PDO::FETCH_ASSOC);
        }
        return $this->Result;
    }

    public function getRowCount(){
        return $this->rowCount;
    }

    /** Monta a sintax e prepara a desclaração para consulta de dados. */
    private function setSyntax() {
        if (is_array($this->Columns)) {
            $setColumns = implode(', ', $this->Columns);
        } else {
            $setColumns = $this->Columns;
        }

        if($this->Critery){
            if(explode(' ',$this->Critery)[0] === 'JOIN'){
                $critIsSet = $this->Critery;
            } else {
                $critIsSet = "WHERE {$this->Critery}";
            }
        } else {
            $critIsSet = '';
        }

        $this->Select = "SELECT {$setColumns} FROM {$this->Table} {$critIsSet}";
        $this->Select = $this->Connection->prepare($this->Select);
    }

    /** Realiza ao conexão e trata de possível erros */
    private function execute() {        
        try {
            $this->connect();
            $this->setSyntax();
            $this->Select->execute();
            $this->rowCount = $this->Select->rowCount();
            Transaction::close();
        } catch (\Exception $e) {
            echo '<b>Erro:</b> '.$e.getLine();
            Transaction::rollback();
            exit();
        }
    }

}
