<?php

class servicesBig extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

            $serviceBigPetsCats = $this->pdo->prepare("Select * from servicesBigPetsCategory");
            if ($serviceBigPetsCats->execute() === false) {
                throw new Exception();
            }
            
            $serviceBigPetsCats = $serviceBigPetsCats->fetchAll();

            
            $serviceBigPets = $this->pdo->prepare("Select * from servicesBigPets");
            if ($serviceBigPets->execute() === false) {
                throw new Exception();
            }
            
            $serviceBigPets = $serviceBigPets->fetchAll();

            die(json_encode(array("cats" => $serviceBigPetsCats, "content" => $serviceBigPets)));
        
    }

}
