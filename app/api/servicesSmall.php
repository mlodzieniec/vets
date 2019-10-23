<?php

class servicesSmall extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

            $serviceSmallPetsCats = $this->pdo->prepare("Select * from servicesSmallPetsCategory");
            if ($serviceSmallPetsCats->execute() === false) {
                throw new Exception();
            }
            
            $serviceSmallPetsCats = $serviceSmallPetsCats->fetchAll();

            
            $serviceSmallPets = $this->pdo->prepare("Select * from servicesSmallPets");
            if ($serviceSmallPets->execute() === false) {
                throw new Exception();
            }
            
            $serviceSmallPets = $serviceSmallPets->fetchAll();

            die(json_encode(array("cats" => $serviceSmallPetsCats, "content" => $serviceSmallPets)));
        
    }

}
