<?php
/**
 * Classe Connection => Responsável por fazer a conexão com o banco de dados.
 *
 * @copyright (c) 2016, Web_Development
 */
namespace classesSystem\crud;

final class Connection {
    /** Dados para conexão com o banco de dados */
    private static $Host;
    private static $User;
    private static $Pass;
    private static $DB;

    /** Armazena a conexão */
    private static $Conn = null;

    /** Previne contra póssiveis instanciamentos da classe, não os permitindo. */
    private function __construct() {}

    /** Abre conexão com o banco de dados */
    public static function openConnection(){

      self::$Host = $GLOBALS['systemConfig']['database']['host'];
      self::$User = $GLOBALS['systemConfig']['database']['user'];
      self::$Pass = $GLOBALS['systemConfig']['database']['password'];
      self::$DB = $GLOBALS['systemConfig']['database']['db'];

      try {
          $dsn = "mysql:host=" . self::$Host . ";dbname=" . self::$DB;
          $option = [\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES UTF8'];
          self::$Conn = new \PDO($dsn, self::$User, self::$Pass, $option);
          return self::$Conn;
      } catch (\PDOException $e) {
          echo "Erro na conexão com o banco de dados.";
          exit();
      }
    }
}
