<?php
/**
 * Classe Transacrion => Respónsavel por executar uma transação com o banco de dados.
 * 
 * @copyright (c) 2016, Web_Development
 */

namespace classesSystem\crud;

final class Transaction {
    /** Armazena a conexão ativa */
    private static $Conn; 
    
    /** Previne possiveis instâcias, não permitindo o acesso através de objetos. */
    private function __construct(){}
    
    /** Abre transação com o banco de dados. */    
    public static function open(){
        /** Verifica se já existe conexão ativa. */
        if(empty(self::$Conn)){
            # Inicia conexão com o banco de dados
            self::$Conn = Connection::openConnection();
            # Inicia transação com o banco de dados
            self::$Conn->beginTransaction();
        }        
    }
    
    /** Retorna a conexão ativa. */
    public static function get(){
        return self::$Conn;
    }
    
    /** Desfaz alterações no banco. */
    public static function rollback() {
        # Verifica se a conexão ativa
        if(self::$Conn){
            # Desfaz alterações
            self::$Conn->rollback();
            # Fecha conexão
            self::$Conn = null;            
        }
    }
    
    /** Fecha a transação e aplica as alterações */    
    public static function close(){
        # Verifica se a conexão ativa
        if(self::$Conn){
            # Aplica alterações
            self::$Conn->commit();
            # Fecha conexão
            self::$Conn = null;
        }        
    }    
}
