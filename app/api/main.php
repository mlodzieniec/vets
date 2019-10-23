<?php

class main extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json');

        $importantNewsStatement = $this->pdo->prepare("SELECT * from importantNews ORDER BY DATE DESC");

        if ($importantNewsStatement->execute() === false) {
            throw new Exception();
        };

        $importantNewsStatement = $importantNewsStatement->fetchAll();

        $latestArticleStatement = $this->pdo->prepare("SELECT article.*, upload.filename from article LEFT JOIN upload ON article.mainUploadId = upload.id ORDER BY article.id DESC LIMIT 1");

        if ($latestArticleStatement->execute() === false) {
            throw new Exception();
        };

        $latestArticleStatement = $latestArticleStatement->fetch();

        $subArticlesStatement = $this->pdo->prepare("Select article.*, upload.filename from article LEFT JOIN upload ON article.mainUploadId = upload.id WHERE article.id not in (Select MAX(id) from article) ORDER BY id DESC");

        if ($subArticlesStatement->execute() === false) {
            throw new Exception();
        };

        $subArticlesStatement = $subArticlesStatement->fetchAll();

        die(json_encode(array("importantNews" => $importantNewsStatement, "mainArticle" => $latestArticleStatement, "subArticles" => $subArticlesStatement)));
    }

}
