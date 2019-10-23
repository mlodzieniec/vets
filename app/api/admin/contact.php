<?php

class contact extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json'); //because we know what content we want print

        $contactStatement = [];
        if (isset($_GET['contactId'])) {
            $contactSingleStatement = $this->pdo->prepare("Select * from contact where id = '" . $_GET['contactId'] . "'");
            if ($contactSingleStatement->execute() === false) {
                throw new Exception();
            };
            $contactSingleStatement = $contactSingleStatement->fetchAll();

            if (!empty($contactSingleStatement[0])) {
                die(json_encode($contactSingleStatement[0]));
            } else {
                die(json_encode($contactSingleStatement));
            }
        } else {
            $contactStatement = $this->pdo->prepare("Select * from contact");
            if ($contactStatement->execute() === false) {
                throw new Exception();
            };
            $contactStatement = $contactStatement->fetchAll();

            die(json_encode($contactStatement));
        }
    }

    public function postMethod($data) {
        if ($data && !empty($data['contactId'])) {
            $contactUpdateStatement = $this->pdo->prepare(
                    "UPDATE contact SET address1=?, address2=?, address3=?, address4=?, address5=?, open1=?, open2=?, open3=?, open4=?, open5=? where id=?");

            if ($contactUpdateStatement->execute([
                        $data['address1'],
                        $data['address2'],
                        $data['address3'],
                        $data['address4'],
                        $data['address5'],
                        $data['open1'],
                        $data['open2'],
                        $data['open3'],
                        $data['open4'],
                        $data['open5'],
                        $data['contactId']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

}
