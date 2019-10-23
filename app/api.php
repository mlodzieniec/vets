<?php

include_once('mainApi.php');
include_once('functions.php');

class api extends functions {

    public $pathUrl = "";

    public function __construct() {
        $this->pathUrl = $_SERVER['REQUEST_URI'];
        if (strpos($this->pathUrl, '?') !== false) {
            $this->pathUrl = substr($this->pathUrl, 0, strpos($this->pathUrl, "?"));
        }
        $afterExplode = explode('/', $this->pathUrl);
        $className    = end($afterExplode);
        $string       = 'app' . $this->pathUrl . ".php";
        if (!file_exists($string)) {
            http_response_code(404);
            die();
        }
        include_once($string);
        $class = (new $className);

        switch ($_SERVER["REQUEST_METHOD"]) {
            case 'GET':
                $class->getMethod();
                break;
            case 'POST':
                $data = $_POST;
                $class->postMethod($data);
                break;
            case 'PUT':
                $data = $this->getPutData();
                $class->putMethod($data);
                break;
            case 'DELETE':
                $class->deleteMethod();
                break;
            default:
                http_response_code(500);
                die();
                break;
        }
    }

    /*
     * Pobieranie danych RAW z metody PUT
     */
    public function getPutData() {
        $postdata         = file_get_contents("php://input");
        $data             = urldecode($postdata);
        $data = str_replace('&nbsp;', ' ', $data);
        $convert_to_array = explode('&', $data);

        for ($i = 0; $i < count($convert_to_array); $i++) {
            $key_value                 = explode('=', $convert_to_array[$i]);
            $end_array[$key_value [0]] = $key_value [1];
        }
        
        return $end_array;
    }

}

$api = new api();
