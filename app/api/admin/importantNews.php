<?php

class importantNews extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        $newsStatement = [];
        if (isset($_GET['newsId'])) {
            /*
             *  Pobieranie pojedynczej wiadomości
             */
            $importantNewsStatement = $this->pdo->prepare("Select * from importantNews where id = '" . $_GET['newsId'] . "'");
            if ($importantNewsStatement->execute() === false) {
                throw new Exception();
            };
            $importantNewsStatement = $importantNewsStatement->fetchAll();

            if (!empty($importantNewsStatement[0])) {
                die(json_encode($importantNewsStatement[0]));
            } else {
                die(json_encode($importantNewsStatement));
            }
        } else {
            /*
             *  Pobieranie wszystkich wiadomości
             */
            $newsStatement = $this->pdo->prepare("Select * from importantNews");
            if ($newsStatement->execute() === false) {
                throw new Exception();
            };
            $newsStatement = $newsStatement->fetchAll();

            die(json_encode($newsStatement));
        }
    }

    public function putMethod($data) {
        if ($data) {
            $newsPutStatement = $this->pdo->prepare(
                    "INSERT INTO importantNews (content, date) VALUES (?,?)");

            if ($newsPutStatement->execute([
                        $data['content'],
                        $data['date']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function postMethod($data) {
        if ($data && !empty($data['id'])) {
            $newsUpdateStatement = $this->pdo->prepare(
                    "UPDATE importantNews SET content=?, date=? where id=?");

            if ($newsUpdateStatement->execute([
                        $data['content'],
                        $data['date'],
                        $data['id']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function deleteMethod() {
        if (isset($_GET['newsId'])) {
            $newsDeleteStatement = $this->pdo->prepare("Delete from importantNews where id = '" . $_GET['newsId'] . "'");

            if ($newsDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
    }

}
