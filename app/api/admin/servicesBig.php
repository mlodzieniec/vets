<?php

class servicesBig extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        $personStatement = [];
        if (isset($_GET['categoryId'])) {
            /*
             * Pobieranie pojedynczej kategorii
             */
            $servicesBigCategoryStatement = $this->pdo->prepare("Select * from servicesBigPetsCategory where id = '" . $_GET['categoryId'] . "'");
            if ($servicesBigCategoryStatement->execute() === false) {
                throw new Exception();
            }

            $servicesBigCategoryStatement = $servicesBigCategoryStatement->fetchAll();

            if (!empty($servicesBigCategoryStatement[0])) {
                die(json_encode($servicesBigCategoryStatement[0]));
            } else {
                die(json_encode($servicesBigCategoryStatement));
            }
        } else if (isset($_GET['serviceId'])) {
            /*
             * Pobieranie pojedynczej pozycji 
             */
            $servicesBigStatement = $this->pdo->prepare("Select * from servicesBigPets where id = '" . $_GET['serviceId'] . "'");
            if ($servicesBigStatement->execute() === false) {
                throw new Exception();
            }

            $servicesBigStatement = $servicesBigStatement->fetchAll();

            /*
             * Pobieranie kategorii do selektora
             */
            $categories = $this->pdo->prepare("Select * from servicesBigPetsCategory");
            if ($categories->execute() === false) {
                throw new Exception();
            }
            $categories = $categories->fetchAll();


            if (!empty($servicesBigStatement[0])) {
                die(json_encode(array('services' => $servicesBigStatement[0], 'categories' => $categories)));
            } else {
                die(json_encode(array('services' => $servicesBigStatement, 'categories' => $categories)));
            }
        } else {
            /*
             * pobieranie kategorii i ich poszczególnych pozycji
             */
            $servicesBigPetsCategoryStatement = $this->pdo->prepare("Select * from servicesBigPetsCategory");
            if ($servicesBigPetsCategoryStatement->execute() === false) {
                throw new Exception();
            }
            $servicesBigPetsCategoryStatement = $servicesBigPetsCategoryStatement->fetchAll();

            $servicesBigPetsStatement = $this->pdo->prepare("Select serv.*, cat.name from servicesBigPets as serv LEFT JOIN servicesBigPetsCategory as cat on cat.id = serv.servicesBigPetsCategoryId ");
            if ($servicesBigPetsStatement->execute() === false) {
                throw new Exception();
            }
            $servicesBigPetsStatement = $servicesBigPetsStatement->fetchAll();

            die(json_encode(array('categories' => $servicesBigPetsCategoryStatement, 'services' => $servicesBigPetsStatement)));
        }
    }

    public function putMethod($data) {
        if (!empty($data)) {
            if ($data['type'] == 'category') {
                $categoryPutStatement = $this->pdo->prepare(
                        "INSERT INTO servicesBigPetsCategory (name, animationQueue) VALUES (?,?)");

                if ($categoryPutStatement->execute([
                            $data['name'],
                            $data['animationQueue']
                        ]) === false) {
                    throw new Exception();
                }
            } else if ($data['type'] == 'service') {
                $servicePutStatement = $this->pdo->prepare(
                        "INSERT INTO servicesBigPets (servicesBigPetsCategoryId, content, additional) VALUES (?,?,?)");

                if ($servicePutStatement->execute([
                            $data['servicesBigPetsCategoryId'],
                            $data['content'],
                            $data['additional']
                        ]) === false) {
                    throw new Exception();
                }
            }
        }
    }

    public function postMethod($data) {
        if ($data && $data['type'] == 'category' && !empty($data['categoryId'])) {
            $categoryUpdateStatement = $this->pdo->prepare(
                    "UPDATE servicesBigPetsCategory SET name=?, animationQueue=? where id=?");

            if ($categoryUpdateStatement->execute([
                        $data['name'],
                        $data['animationQueue'],
                        $data['categoryId']
                    ]) === false) {
                throw new Exception();
            }
        } else if ($data && $data['type'] == 'service' && !empty($data['serviceId'])) {
            $serviceUpdateStatement = $this->pdo->prepare(
                    "UPDATE servicesBigPets SET servicesBigPetsCategoryId=?, content=?, additional=? where id=?");

            if ($serviceUpdateStatement->execute([
                        $data['servicesBigPetsCategoryId'],
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
            $categoryDeleteStatement = $this->pdo->prepare("Delete from servicesBigPetsCategory where id = '" . $_GET['categoryId'] . "'");

            if ($categoryDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
        if (isset($_GET['serviceId'])) {
            $serviceDeleteStatement = $this->pdo->prepare("Delete from servicesBigPets where id = '" . $_GET['serviceId'] . "'");

            if ($serviceDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
    }

}
