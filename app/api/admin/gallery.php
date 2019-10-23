<?php

class gallery extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        if (isset($_GET['galleryId']) && isset($_GET['uploadId'])) {
            $upload = $this->pdo->prepare("SELECT * from upload where upload.id = '" . $_GET['uploadId'] . "'");

            if ($upload->execute() === false) {
                throw new Exception();
            };

            $upload = $upload->fetch();

            die(json_encode(array("upload" => $upload, 'galleryId' => $_GET['galleryId'])));
        } else if (isset($_GET['galleryId'])) {
            /*
             * Pobieranie pojedynczej kategorii
             */
            $getGallery = $this->pdo->prepare("Select * from gallery where id = '" . $_GET['galleryId'] . "'");
            if ($getGallery->execute() === false) {
                throw new Exception();
            }

            $getGallery = $getGallery->fetch();

            $getUploads = $this->pdo->prepare("Select * from upload where galleryId = '" . $_GET['galleryId'] . "'");
            if ($getUploads->execute() === false) {
                throw new Exception();
            }

            $getUploads = $getUploads->fetchAll();

            die(json_encode(array('gallery' => $getGallery, 'uploads' => $getUploads)));
        } else if (isset($_GET['uploadId'])) {
            /*
             * Pobieranie pojedynczej pozycji 
             */
            $getGalleryUpload = $this->pdo->prepare("Select * from upload where id = '" . $_GET['uploadId'] . "'");
            if ($getGalleryUpload->execute() === false) {
                throw new Exception();
            }

            $getGalleryUpload = $getGalleryUpload->fetchAll();

            /*
             * Pobieranie kategorii do selektora
             */
            $categories = $this->pdo->prepare("Select * from galleryCategory");
            if ($categories->execute() === false) {
                throw new Exception();
            }
            $categories = $categories->fetchAll();

            if (!empty($getGalleryUpload[0])) {
                die(json_encode(array('services' => $getGalleryUpload[0], 'categories' => $categories)));
            } else {
                die(json_encode(array('services' => $getGalleryUpload, 'categories' => $categories)));
            }
        } else {
            /*
             * pobieranie galerii
             */
            $galleries = $this->pdo->prepare("Select * from gallery");
            if ($galleries->execute() === false) {
                throw new Exception();
            }
            $galleries = $galleries->fetchAll();


            die(json_encode(array('galleries' => $galleries)));
        }
    }

    public function putMethod($data) {
        if (!empty($data)) {
            if ($data['type'] == 'gallery' && $data['name'] !== '') {

                $filterName = str_replace(' ', '', $data['name']);

                $galleryPut = $this->pdo->prepare("INSERT INTO gallery (name, filterName) VALUES (?,?)");

                if ($galleryPut->execute([$data['name'], $filterName]) === false) {
                    throw new Exception();
                }
            } else if (($data['type'] == 'upload') && (!empty($data['galleryId']))) {
                if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                    parent::base64_to_jpeg($data['mainPhotoBase'],
                            $_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $data['mainPhotoName']);
                }

                $data['filename'] = '';
                if (isset($data['mainPhotoName'])) {
                    $data['filename'] = parent::pathToUploadIfExists($directory = "upload", $data['mainPhotoName']);
                }

                $uploadPut = $this->pdo->prepare(
                        "INSERT INTO upload (filename, title, galleryId, orientation) VALUES (?,?,?,?)");

                if ($uploadPut->execute([
                            $data['filename'],
                            $data['title'],
                            $data['galleryId'],
                            $data['orientation']
                        ]) === false) {
                    throw new Exception();
                }
            }
        }
    }

    public function postMethod($data) {
        if ($data && $data['type'] == 'gallery' && !empty($data['galleryId'])) {
            $galleryUpdate = $this->pdo->prepare(
                    "UPDATE gallery SET name=? where id=?");

            if ($galleryUpdate->execute([$data['name'], $data['galleryId']]) === false) {
                throw new Exception();
            }
        } else if ($data && $data['type'] == 'upload' && !empty($data['galleryId'])) {
            if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                parent::base64_to_jpeg($data['mainPhotoBase'],
                        $_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $data['mainPhotoName']);
            }

            $data['filename'] = $data['oldMain'];
            if (isset($data['mainPhotoName'])) {
                $data['filename'] = parent::pathToUploadIfExists($directory = "upload", $data['mainPhotoName']);
            }

            $uploadUpdate = $this->pdo->prepare("UPDATE upload SET filename=?, title=? where id=?");

            if ($uploadUpdate->execute([
                        $data['filename'],
                        $data['title'],
                        $data['uploadId']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function deleteMethod() {
        if (isset($_GET['galleryId'])) {
            $galleryDelete = $this->pdo->prepare("Delete from gallery where id = '" . $_GET['galleryId'] . "'");

            if ($galleryDelete->execute() === false) {
                throw new Exception();
            }

            $galleryUploadDelete = $this->pdo->prepare("Delete from upload where galleryId = '" . $_GET['galleryId'] . "'");

            if ($galleryUploadDelete->execute() === false) {
                throw new Exception();
            }
        }
        if (isset($_GET['uploadId'])) {
            $uploadDelete = $this->pdo->prepare("Delete from upload where id = '" . $_GET['uploadId'] . "'");

            if ($uploadDelete->execute() === false) {
                throw new Exception();
            }
        }
    }

}
