function actionRun() {
    showGallery();
}

showGallery = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/gallery'
    }).then((result) => {
        return core.compileLayout('/action/galeria.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then((result) => {
        $('.loading').show();
        core.hideLoader();

        core.addJs("js/plugins.js");
        core.addJs("js/functions.js");
//        SEMICOLON.documentOnLoad.init();
        core.addJs("js/simple-lightbox.min.js");

        $('.gallery a').simpleLightbox();

        $(".filter-button").click(function () {

            var value = $(this).attr('data-filter');

            if (value == "*") {
                $('.filter').find('img').removeClass('hideGalleryPhoto');
            } else {
                $(".filter").not('.' + value).find('img').addClass("hideGalleryPhoto");
                $('.filter').filter('.' + value).find('img').removeClass('hideGalleryPhoto');
            }

            if ($(".filter-button").removeClass("active")) {
                $(this).removeClass("active");
            }

            $(this).addClass("active");
        });


    });
};
