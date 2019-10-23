<?php

class person extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');
        
        if (isset($_GET['personId'])) {
            if (!is_numeric($_GET['personId'])) {
                throw new Exception();
            }

            $personVetsStatement = $this->pdo->prepare("Select * from person where id = '".$_GET['personId']."'");
            if ($personVetsStatement->execute() === false) {
                throw new Exception();
            };
            $personVetsStatement = $personVetsStatement->fetchAll();

            die(json_encode($personVetsStatement[0]));
        } else {
            
            $personVetsStatement = $this->pdo->prepare("Select * from person where type = 'lekarz'");
            if ($personVetsStatement->execute() === false) {
                throw new Exception();
            };
            $personVetsStatement = $personVetsStatement->fetchAll();

            $personOthersStatement = $this->pdo->prepare("Select * from person where type = 'pomocnik'");
            if ($personOthersStatement->execute() === false) {
                throw new Exception();
            };
            $personOthersStatement = $personOthersStatement->fetchAll();

            die(json_encode(array("vet" => $personVetsStatement, "other" => $personOthersStatement)));
        }
    }

}
