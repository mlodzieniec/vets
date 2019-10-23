<?php

class servicesSmall extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        $personStatement = [];
        if (isset($_GET['categoryId'])) {
            /*
             * Pobieranie pojedynczej kategorii
             */
            $servicesSmallCategoryStatement = $this->pdo->prepare("Select * from servicesSmallPetsCategory where id = '" . $_GET['categoryId'] . "'");
            if ($servicesSmallCategoryStatement->execute() === false) {
                throw new Exception();
            }

            $servicesSmallCategoryStatement = $servicesSmallCategoryStatement->fetchAll();

            if (!empty($servicesSmallCategoryStatement[0])) {
                die(json_encode($servicesSmallCategoryStatement[0]));
            } else {
                die(json_encode($servicesSmallCategoryStatement));
            }
        } else if (isset($_GET['serviceId'])) {
            /*
             * Pobieranie pojedynczej pozycji 
             */
            $servicesSmallStatement = $this->pdo->prepare("Select * from servicesSmallPets where id = '" . $_GET['serviceId'] . "'");
            if ($servicesSmallStatement->execute() === false) {
                throw new Exception();
            }

            $servicesSmallStatement = $servicesSmallStatement->fetchAll();

            /*
             * Pobieranie kategorii do selektora
             */
            $categories = $this->pdo->prepare("Select * from servicesSmallPetsCategory");
            if ($categories->execute() === false) {
                throw new Exception();
            }
            $categories = $categories->fetchAll();


            if (!empty($servicesSmallStatement[0])) {
                die(json_encode(array('services' => $servicesSmallStatement[0], 'categories' => $categories)));
            } else {
                die(json_encode(array('services' => $servicesSmallStatement, 'categories' => $categories)));
            }
        } else {
            /*
             * pobieranie kategorii i ich poszczególnych pozycji
             */
            $servicesSmallPetsCategoriesStatement = $this->pdo->prepare("Select * from servicesSmallPetsCategory");
            if ($servicesSmallPetsCategoriesStatement->execute() === false) {
                throw new Exception();
            }
            $servicesSmallPetsCategoriesStatement = $servicesSmallPetsCategoriesStatement->fetchAll();

            $servicesSmallPetsStatement = $this->pdo->prepare("Select serv.*, cat.name from servicesSmallPets as serv LEFT JOIN servicesSmallPetsCategory as cat on cat.id = serv.servicesSmallPetsCategoryId ");
            if ($servicesSmallPetsStatement->execute() === false) {
                throw new Exception();
            }
            $servicesSmallPetsStatement = $servicesSmallPetsStatement->fetchAll();

            die(json_encode(array('categories' => $servicesSmallPetsCategoriesStatement, 'services' => $servicesSmallPetsStatement)));
        }
    }

    public function putMethod($data) {
        if ($data && $data['type'] == 'category') {
            $categoryPutStatement = $this->pdo->prepare(
                    "INSERT INTO servicesSmallPetsCategory (name, animationQueue) VALUES (?,?)");

            if ($categoryPutStatement->execute([
                        $data['name'],
                        $data['animationQueue']
                    ]) === false) {
                throw new Exception();
            }
        } else if ($data && $data['type'] == 'service') {
            $servicePutStatement = $this->pdo->prepare(
                    "INSERT INTO servicesSmallPets (servicesSmallPetsCategoryId, content, additional) VALUES (?,?,?)");

            if ($servicePutStatement->execute([
                        $data['servicesSmallPetsCategoryId'],
                        $data['content'],
                        $data['additional']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function postMethod($data) {
        if ($data && $data['type'] == 'category' && !empty($data['categoryId'])) {
            $categoryUpdateStatement = $this->pdo->prepare(
                    "UPDATE servicesSmallPetsCategory SET name=?, animationQueue=? where id=?");

            if ($categoryUpdateStatement->execute([
                        $data['name'],
                        $data['animationQueue'],
                        $data['categoryId']
                    ]) === false) {
                throw new Exception();
            }
        } else if ($data && $data['type'] == 'service' && !empty($data['serviceId'])) {         
            $serviceUpdateStatement = $this->pdo->prepare(
                    "UPDATE servicesSmallPets SET servicesSmallPetsCategoryId=?, content=?, additional=? where id=?");

            if ($serviceUpdateStatement->execute([
                        $data['servicesSmallPetsCategoryId'],
                        $data['content'],
                        $data['additional'],
                        $data['serviceId']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function deleteMethod() {
        if (isset($_GET['categoryId'])) {
            $categoryDeleteStatement = $this->pdo->prepare("Delete from servicesSmallPetsCategory where id = '" . $_GET['categoryId'] . "'");

            if ($categoryDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
        if (isset($_GET['serviceId'])) {
            $serviceDeleteStatement = $this->pdo->prepare("Delete from servicesSmallPets where id = '" . $_GET['serviceId'] . "'");

            if ($serviceDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
    }

}
