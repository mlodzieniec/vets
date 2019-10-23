<?php

class articles extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        if (isset($_GET['articleId']) && isset($_GET['uploadId'])) {
            $upload = $this->pdo->prepare("SELECT * from upload where upload.id = '" . $_GET['uploadId'] . "'");

            if ($upload->execute() === false) {
                throw new Exception();
            };

            $upload = $upload->fetch();

            die(json_encode(array("upload" => $upload, 'articleId' => $_GET['articleId'])));
        } else if (isset($_GET['articleId'])) {
            /*
             * Pobieranie pojedynczego artykulu wraz z przypisanymi zdjęciami
             */
            $singleArticle = $this->pdo->prepare("select 
            a.*,
            upload.`filename` as mainImage  
            from article as a
            left JOIN upload on upload.id = a.mainUploadId
            where a.id = '" . $_GET['articleId'] . "'");

            if ($singleArticle->execute() === false) {
                throw new Exception();
            };

            $singleArticle = $singleArticle->fetch();

            /*
             * Pobieranie dołączonych zdjęc do artykułu
             */
            $articleGallery = $this->pdo->prepare("
                SELECT upload.* from `articleJoinUpload` as aju
                LEFT JOIN upload on upload.`id` = aju.`uploadId`
                where aju.`articleId` = '" . $_GET['articleId'] . "'");

            if ($articleGallery->execute() === false) {
                throw new Exception();
            };

            $articleGallery = $articleGallery->fetchAll();

            /*
             * Pobieranie kategorii do selektora
             */
            $categories = $this->pdo->prepare("Select * from articleCategory");

            if ($categories->execute() === false) {
                throw new Exception();
            };

            $categories = $categories->fetchAll();

            die(json_encode(array("singleArticle" => $singleArticle, "articleGallery" => $articleGallery, 'cats' => $categories)));
        } else if (isset($_GET['categoryId'])) {
            /*
             * Pobieranie pojedynczej kategorii filtrowania w "poradach dla zwierząt"
             */
            $category = $this->pdo->prepare("Select * from articleCategory where id = '" . $_GET['categoryId'] . "'");


            if ($category->execute() === false) {
                throw new Exception();
            };

            $category = $category->fetchAll();

            if (!empty($category[0])) {
                die(json_encode($category[0]));
            } else {
                die(json_encode($category));
            }
        } else {
            $categories = $this->pdo->prepare("Select * from articleCategory");

            if ($categories->execute() === false) {
                throw new Exception();
            };

            $categories = $categories->fetchAll();

            $articles = $this->pdo->prepare(""
                    . "Select article.*, upload.filename, SUBSTRING(articleCategory.filter, 2, LENGTH(articleCategory.filter)) as filter, articleCategory.name as categoryName "
                    . "from article "
                    . "LEFT JOIN upload ON article.mainUploadId = upload.id "
                    . "LEFT JOIN articleCategory on article.category = articleCategory.id order by date DESC");

            if ($articles->execute() === false) {
                throw new Exception();
            }

            $articles = $articles->fetchAll();

            die(json_encode(array('cats' => $categories, 'articles' => $articles)));
        }
    }

    public function putMethod($data) {
        if (!empty($data)) {
            if ($data['type'] == 'category') {
                $categoryPutStatement = $this->pdo->prepare(
                        "INSERT INTO articleCategory (name, filter) VALUES (?,?)");

                if ($categoryPutStatement->execute([$data['name'], $data['filter']]) === false) {
                    throw new Exception();
                }
            } else if ($data['type'] == 'article') {
                if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                    parent::base64_to_jpeg($data['mainPhotoBase'],
                            $_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $data['mainPhotoName']);
                }

                $data['newUploadId'] = null;
                if (isset($data['mainPhotoName'])) {
                    $data['newUploadId'] = $this->insertMainUpload($data['mainPhotoName'], $data['oldUploadId'],
                            $data['oldUploadName'], $data);
                }


                $articlePutStatement = $this->pdo->prepare(
                        "INSERT INTO article (title, subtitle, mainUploadId, content, category, date) VALUES (?,?,?,?,?,?)");

                if ($articlePutStatement->execute(
                                [
                                    $data['title'],
                                    $data['subtitle'],
                                    $data['newUploadId'],
                                    $data['content'],
                                    $data['category'],
                                    $data['date'],
                                ]
                        ) === false) {
                    throw new Exception();
                }
            } else if ($data['type'] == 'upload') {
                if ($data['articleId'] !== '') {
                    if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                        parent::base64_to_jpeg($data['mainPhotoBase'],
                                $_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $data['mainPhotoName']);
                    }

                    $data['uploadId'] = null;
                    if (isset($data['mainPhotoName'])) {
                        $data['uploadId'] = $this->insertToUpload($data['mainPhotoName'], $data['title'],
                                $data['subtitle']);
                    }

                    $articleJoinPutStatement = $this->pdo->prepare(
                            "INSERT INTO articleJoinUpload (articleId, uploadId) VALUES (?,?)");

                    if ($articleJoinPutStatement->execute(
                                    [
                                        $data['articleId'],
                                        $data['uploadId'],
                                    ]
                            ) === false) {
                        throw new Exception();
                    }
                }
            }
        }
    }

    public function postMethod($data) {
        if ($data && $data['type'] == 'category') {
            if (!empty($data['categoryId'])) {
                $categoryUpdateStatement = $this->pdo->prepare(
                        "UPDATE articleCategory SET name=?, filter=? where id=?");

                if ($categoryUpdateStatement->execute(
                                [
                                    $data['name'],
                                    $data['filter'],
                                    $data['categoryId']
                                ]
                        ) === false) {
                    throw new Exception();
                }
            }
        } else if ($data && $data['type'] == 'article' && !empty($data['articleId'])) {
            if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                parent::base64_to_jpeg($data['mainPhotoBase'],
                        $_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $data['mainPhotoName']);
            }

            $data['newUploadId'] = $data['oldUploadId'];
            if (isset($data['mainPhotoName'])) {
                $data['newUploadId'] = $this->insertMainUpload($data['mainPhotoName'], $data['oldUploadId'],
                        $data['oldUploadName'], $data);
            }

            $articleUpdateStatement = $this->pdo->prepare(
                    "UPDATE article SET title=?, subtitle=?, mainUploadId=?, content=?, category=?, date=? where id=?");

            if ($articleUpdateStatement->execute([
                        $data['title'],
                        $data['subtitle'],
                        $data['newUploadId'],
                        $data['content'],
                        $data['category'],
                        $data['date'],
                        $data['articleId']
                    ]) === false) {
                throw new Exception();
            }
        } else if ($data && $data['type'] == 'upload' && !empty($data['uploadId'])) {
            if ((isset($data['mainPhotoType'])) && ($data['mainPhotoType'] == 'image/jpeg' || $data['mainPhotoType'] == 'image/png')) {
                $this->base64_to_jpeg($data['mainPhotoBase'],
                        $_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $data['mainPhotoName']);
            }

            $data['filename'] = $data['oldMain'];
            if (isset($data['mainPhotoName'])) {
                $data['filename'] = $this->uploadFileExist($data['mainPhotoName']);
            }

            $uploadUpdateStatement = $this->pdo->prepare(
                    "UPDATE upload SET filename=?, title=?, subtitle=? where id=?");

            if ($uploadUpdateStatement->execute([
                        $data['filename'],
                        $data['title'],
                        $data['subtitle'],
                        $data['uploadId']
                    ]) === false) {
                throw new Exception();
            }
        }
    }

    public function deleteMethod() {
        if (isset($_GET['categoryId'])) {
            $categoryDeleteStatement = $this->pdo->prepare("Delete from articleCategory where id = '" . $_GET['categoryId'] . "'");

            if ($categoryDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
        if (isset($_GET['articleId'])) {
            $articleDeleteStatement = $this->pdo->prepare("Delete from article where id = '" . $_GET['articleId'] . "'");

            if ($articleDeleteStatement->execute() === false) {
                throw new Exception();
            }

            $articleJoinDeleteStatement = $this->pdo->prepare("Delete from articleJoinUpload where articleId = '" . $_GET['articleId'] . "'");

            if ($articleJoinDeleteStatement->execute() === false) {
                throw new Exception();
            }
        }
        if (isset($_GET['uploadId'])) {
            $uploadDelete = $this->pdo->prepare("Delete from upload where id = '" . $_GET['uploadId'] . "'");

            if ($uploadDelete->execute() === false) {
                throw new Exception();
            }

            $articleJoinUploadDelete = $this->pdo->prepare("Delete from articleJoinUpload where uploadId = '" . $_GET['uploadId'] . "'");

            if ($articleJoinUploadDelete->execute() === false) {
                throw new Exception();
            }
        }
    }

    public function insertMainUpload($photoName, $oldUploadId, $oldUploadName) {
        if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/uploads/upload//" . $photoName)) {
            $filePath = '/uploads/upload/' . $photoName;

            $insertUploadStatement = $this->pdo->prepare(
                    "INSERT INTO upload (filename) VALUES (?)");

            if ($insertUploadStatement->execute([$filePath]) === false) {
                throw new Exception();
            }

            $newUploadId = $this->pdo->lastInsertId();

//            $imageInUse = $this->pdo->prepare("SELECT upload.* from `articleJoinUpload` as aju
//                LEFT JOIN upload on upload.`id` = aju.`uploadId` where upload.filename = '${oldUploadName}' limit 1");
//
//            if ($imageInUse->execute() === false) {
//                throw new Exception();
//            }
//
//            $imageInUse = $imageInUse->fetch();
//
//            if ((file_exists($_SERVER['DOCUMENT_ROOT'] . $oldUploadName) && (!$imageInUse))) {
//                unlink($_SERVER['DOCUMENT_ROOT'] . $oldUploadName);
//            }

            return $newUploadId;
        }
    }

    public function insertToUpload($photoName, $title, $subtitle) {
        if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $photoName)) {
            $filePath = '/uploads/upload/' . $photoName;

            $insertUploadStatement = $this->pdo->prepare(
                    "INSERT INTO upload (filename, title, subtitle) VALUES (?,?,?)");

            if ($insertUploadStatement->execute([$filePath, $title, $subtitle]) === false) {
                throw new Exception();
            }

            $newUploadId = $this->pdo->lastInsertId();

//            $imageInUse = $this->pdo->prepare("SELECT upload.* from `articleJoinUpload` as aju
//                LEFT JOIN upload on upload.`id` = aju.`uploadId` where upload.filename = '${oldUploadName}' limit 1");
//
//            if ($imageInUse->execute() === false) {
//                throw new Exception();
//            }
//
//            $imageInUse = $imageInUse->fetch();
//
//            if ((file_exists($_SERVER['DOCUMENT_ROOT'] . $oldUploadName) && (!$imageInUse))) {
//                unlink($_SERVER['DOCUMENT_ROOT'] . $oldUploadName);
//            }

            return $newUploadId;
        }
    }

    public function uploadFileExist($photoName) {
        $filePath = '';

        if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/uploads/upload/" . $photoName)) {
            $filePath = '/uploads/upload/' . $photoName;
        }

        return $filePath;
    }

}
