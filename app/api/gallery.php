<?php

class gallery extends mainApi {

//    public $templateUpload1 = '<div class="slide" data-thumb-alt="" style="width: 100%; float: left; margin-right: -100%; position: relative; opacity: 0; display: block; z-index: 1;"><a href="#"><img src="/uploads/gallery/[[FILENAME1]]" alt="photo" draggable="false"></a></div>';
//    public $templateUpload2 = '<a href="/uploads/gallery/[[FILENAME2]]" class="left-icon" data-lightbox="gallery-item"><i class="fas fa-layer-group"></i></a>';

    public function getMethod() {
        header('Content-Type: application/json'); //because we know what content we want print
        $galleries = $this->pdo->prepare("Select * from gallery");

        if ($galleries->execute() === false) {
            throw new Exception();
        };

        $galleries = $galleries->fetchAll();


        $uploads = $this->pdo->prepare("Select u.*, g.filterName from upload as u JOIN gallery as g ON g.id = u.galleryId");
        if ($uploads->execute() === false) {
            throw new Exception();
        };

        $uploads = $uploads->fetchAll();

//        $galleries = $this->pdo->prepare("
//            select 
//            g.*,
//            (SELECT GROUP_CONCAT(filter SEPARATOR ',') FROM galleryCategory LEFT JOIN galleryJoinCategory ON galleryJoinCategory.`categoryId`=galleryCategory.id WHERE galleryJoinCategory.`galleryId`=g.id) as categories, 
//            (SELECT GROUP_CONCAT(filename SEPARATOR ',') FROM upload LEFT JOIN galleryJoinUpload ON galleryJoinUpload.`uploadId`=upload.id WHERE galleryJoinUpload.galleryId=g.id) as uploads  
//            from gallery as g
//            group By g.id
//            "
//        );
//
//        if ($galleries->execute() === false) {
//            throw new Exception();
//        };
//
//        $galleries = $galleries->fetchAll();

        die(json_encode(array("galleries" => $galleries, 'uploads' => $uploads))); //, "elements" => $galleries
    }

}
