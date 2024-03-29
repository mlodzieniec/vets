<?php

class person extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        $personStatement = [];
        if (isset($_GET['personId'])) {
            $personVetsStatement = $this->pdo->prepare("Select * from person where id = '" . $_GET['personId'] . "'");
            if ($personVetsStatement->execute() === false) {
                throw new Exception();
            };
            $personVetsStatement = $personVetsStatement->fetchAll();

            if (!empty($personVetsStatement[0])) {
                die(json_encode($personVetsStatement[0]));
            } else {
                die(json_encode($personVetsStatement));
            }
        } else {
            $personStatement = $this->pdo->prepare("Select * from person");
            if ($personStatement->execute() === false) {
                throw new Exception();
            };
            $personStatement = $personStatement->fetchAll();

            die(json_encode($personStatement));
        }
    }

    public function putMethod($data) {
        if ($data) {
            if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                $src = $_SERVER['DOCUMENT_ROOT'] . "/uploads/person/" . $data['mainPhotoName'];


                parent::base64_to_jpeg($data['mainPhotoBase'], $_SERVER['DOCUMENT_ROOT'] . "/uploads/person/" . $data['mainPhotoName']);

                parent::cropImage($src, $data['mainPhotoName'], $data['mainPhotoType'], $data['cropScale'], $data['cropX'], $data['cropY'], $data['cropW'], $data['cropH']);
            }

            $data['personNormalImage'] = '';
            if (isset($data['mainPhotoName'])) {
                $data['personNormalImage'] = parent::pathToUploadIfExists($directory = 'person', $data['mainPhotoName']);
            }

            $personPutStatement = $this->pdo->prepare(
                    "INSERT INTO person (firstName, middleName, lastName, type, title, specialization, interests, personInfo, mondayHours, tuesdayhours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours, personNormalImage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

            if ($personPutStatement->execute([
                        $data['firstName'],
                        $data['middleName'],
                        $data['lastName'],
                        $data['type'],
                        $data['title'],
                        $data['specialization'],
                        $data['interests'],
                        $data['personInfo'],
                        $data['mondayHours'],
                        $data['tuesdayHours'],
                        $data['wednesdayHours'],
                        $data['thursdayHours'],
                        $data['fridayHours'],
                        $data['saturdayHours'],
                        $data['sundayHours'],
                        $data['personNormalImage'],
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function postMethod($data) {
//        $errors = $this->validate($data);
//
//        if(!empty($errors)) {
//            die(json_encode($errors));
//        } 
//        

        if ($data && !empty($data['personId'])) {
            if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                $src = $_SERVER['DOCUMENT_ROOT'] . "/uploads/person/" . $data['mainPhotoName'];

                parent::base64_to_jpeg($data['mainPhotoBase'], $_SERVER['DOCUMENT_ROOT'] . "/uploads/person//" . $data['mainPhotoName']);

                parent::cropImage($src, $data['mainPhotoName'], $data['mainPhotoType'], $data['cropScale'], $data['cropX'], $data['cropY'], $data['cropW'], $data['cropH']);
            }

            if (isset($data['mainPhotoName'])) {
                $columnToUpdate = 'personNormalImage';
                $this->updatePhoto($data['mainPhotoName'], $data['personId'], $data['oldMain'], $columnToUpdate);
            }

            $personUpdateStatement = $this->pdo->prepare(
                    "UPDATE person SET firstName=?, middleName=?, lastName=?, "
                    . "type=?, title=?, specialization=?, interests=?, personInfo=?, "
                    . "mondayHours=?, tuesdayHours=?, wednesdayHours=?, "
                    . "thursdayHours=?, fridayHours=?, saturdayHours=?, sundayHours=? "
                    . "where id=?");

            if ($personUpdateStatement->execute([
                        $data['firstName'],
                        $data['middleName'],
                        $data['lastName'],
                        $data['type'],
                        $data['title'],
                        $data['specialization'],
                        $data['interests'],
                        $data['personInfo'],
                        $data['mondayHours'],
                        $data['tuesdayHours'],
                        $data['wednesdayHours'],
                        $data['thursdayHours'],
                        $data['fridayHours'],
                        $data['saturdayHours'],
                        $data['sundayHours'],
                        $data['personId']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function deleteMethod() {
        if (isset($_GET['personId'])) {
            $personDeleteStatement = $this->pdo->prepare("Delete from person where id = '" . $_GET['personId'] . "'");

            if ($personDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
    }

    public function updatePhoto($photoName, $personId, $oldPhoto, $columnToUpdate) {
        if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/uploads/person/" . $photoName)) {
            $filePath = '/uploads/person/' . $photoName;

            $personUpdateStatement = $this->pdo->prepare(
                    "UPDATE person SET ${columnToUpdate}=? where id=?");

            if ($personUpdateStatement->execute([$filePath, $personId]) === false) {
                throw new Exception();
            }

//            $imageInUse = $this->pdo->prepare("Select * from person where personNormalImage = '${oldPhoto}' OR personThumbnailImage = '${oldPhoto}' limit 1");
//
//            if ($imageInUse->execute() === false) {
//                throw new Exception();
//            }
//
//            $imageInUse = $imageInUse->fetch();
//
//            if ((file_exists($_SERVER['DOCUMENT_ROOT'] . $oldPhoto) && (!$imageInUse))) {
//                unlink($_SERVER['DOCUMENT_ROOT'] . $oldPhoto);
//            }
        }
    }

    public function validate($data) {
        $errors = [];


        if (isset($data['firstName'])) {
            if (parent::isEmpty('firstName', $data['firstName'])) {
                $errors['firstName']['isEmpty'] = true;
                $errors['firstName']['value'] = $data['firstName'];
            }

            if (parent::minLength('firstName', $data['firstName'], 5)) {
                $errors['firstName']['minLength'] = true;
                $errors['firstName']['value'] = $data['firstName'];
            }
        }



        return $errors;
    }

}
