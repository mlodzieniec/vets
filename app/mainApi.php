<?php

include_once ('functions.php');

class mainApi extends functions {

    private $host    = ''; //adres serwera
    private $user    = '';     //nazwa uzytkownika
    private $pass    = '';   // haslo uzytkownika do bazy
    private $db      = ''; // nazwa bazy danych
    private $charset = '';
    private $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    public $pdo;

    public function __construct() {
        $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";
        
        try {
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $this->options);
        } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int) $e->getCode());
        }
    }
}
