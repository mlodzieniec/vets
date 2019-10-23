<?php

class about extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json'); //because we know what content we want print
        $aboutContent = $this->pdo->prepare("Select * from about limit 1");

        if ($aboutContent->execute() === false) {
            throw new Exception();
        };

        $aboutContent = $aboutContent->fetch();

        $aboutGallery = $this->pdo->prepare("
            SELECT upload.* from `aboutJoinUpload` as aju
            LEFT JOIN upload on upload.`id` = aju.`uploadId`
            "
        );

        if ($aboutGallery->execute() === false) {
            throw new Exception();
        };

        $aboutGallery = $aboutGallery->fetchAll();

        die(json_encode(array("aboutContent" => $aboutContent, "uploads" => $aboutGallery)));
    }

    public function postMethod($data) {
        if ($data && $data['type'] == 'about' && !empty($data['aboutId'])) {
            $personUpdateStatement = $this->pdo->prepare("UPDATE about SET content=? where id=?");

            if ($personUpdateStatement->execute([$data['content'], $data['aboutId']] ) === false) {
                throw new Exception();
            }
        }
    }

}
