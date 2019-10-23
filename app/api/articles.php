<?php

class articles extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        if (isset($_GET['articleId'])) {
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
            
            $articleGallery = $this->pdo->prepare("
                SELECT upload.* from `articleJoinUpload` as aju
                LEFT JOIN upload on upload.`id` = aju.`uploadId`
                where aju.`articleId` = '" . $_GET['articleId'] . "'");
 
            if ($articleGallery->execute() === false) {
                throw new Exception();
            };

            $articleGallery = $articleGallery->fetchAll();  
            
            die(json_encode(array("singleArticle" => $singleArticle, "articleGallery" => $articleGallery)));

//            die(json_encode($singleArticleStatement[0]));
        } else {
            $articleListStatement = $this->pdo->prepare(""
                    . "Select article.*, upload.filename, SUBSTRING(articleCategory.filter, 2, LENGTH(articleCategory.filter)) as filter "
                    . "from article "
                    . "LEFT JOIN upload ON article.mainUploadId = upload.id "
                    . "LEFT JOIN articleCategory on article.category = articleCategory.id order by date DESC");

            if ($articleListStatement->execute() === false) {
                throw new Exception();
            };

            $articleListStatement = $articleListStatement->fetchAll();

            $articleCategories = $this->pdo->prepare(""
                    . "Select articleCategory.*, count(article.id) as countedArticle "
                    . "from articleCategory "
                    . "Left join article on articleCategory.id = article.`category` "
                    . "group by articleCategory.id");

            if ($articleCategories->execute() === false) {
                throw new Exception();
            };

            $articleCategories = $articleCategories->fetchAll();

            die(json_encode(array("articles" => $articleListStatement, "cats" => $articleCategories)));
        }
    }

}


