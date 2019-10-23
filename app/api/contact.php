<?php

class contact extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json'); //because we know what content we want print
        $contactStatement = $this->pdo->prepare("Select * from contact");

        if ($contactStatement->execute() === false) {
            throw new Exception();
        };

        $contactStatement = $contactStatement->fetchAll();
        
        die(json_encode($contactStatement));
    }

}
