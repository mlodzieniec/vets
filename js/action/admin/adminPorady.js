function actionRun() {
    if (core.getUrlParameter('categoryId') == undefined && core.getUrlParameter('articleId') == undefined) {
        showAll();
    } else if (core.getUrlParameter('articleId') != undefined && core.getUrlParameter('uploadId') != undefined) {
        showUploadById();
    } else if (core.getUrlParameter('categoryId') != undefined) {
        showCategoryById();
    } else if (core.getUrlParameter('articleId') != undefined) {
        showArticleById();
    }
}

var croppedImage = {};

showAll = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/articles'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminPorady.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {

        /*
         * 
         * KATEGORIE
         * 
         */

        $(document).find('section[id="content"]').find('.category-edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?categoryId=' + $(e.target).closest("div.btn-group").attr('categoryId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie nagłówka przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.category-delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/articles?categoryId=' + $(e.target).closest("div.btn-group").attr('categoryId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania nagłówka przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-article-category').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?categoryId=', (core.getActionUrl()));
        });

        /*
         * 
         * ARTYKUŁY
         * 
         */

        $(document).find('section[id="content"]').find('.article-edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?articleId=' + $(e.target).closest("div.btn-group").attr('articleId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie wiadomości przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.article-delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/articles?articleId=' + $(e.target).closest("div.btn-group").attr('articleId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania wiadomości przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-article').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?articleId=', (core.getActionUrl()));
        });
    });
};

showCategoryById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/articles?categoryId=' + core.getUrlParameter('categoryId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminPoradyCategory.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminPorady();

        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/articles',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};

showArticleById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/articles?articleId=' + core.getUrlParameter('articleId')
    }).then((result) => {
        return Promise.all([
            core.compileLayout('/action/admin/adminPoradyArticle.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)}),
            Promise.resolve(JSON.parse(result.response))
        ]);
    }).then(([content, data]) => {
        let validate = new validateAdminPorady();

        $("#datepicker").datepicker({format: 'yyyy-mm-dd'});

        CKEDITOR.config.height = 300;
        CKEDITOR.replace('editor1');

        $("#main").change(function () {
            readURL(this);
        });

        /*
         * ZDJĘCIA
         */

        $(document).find('section[id="content"]').find('.upload-edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + window.location.search + '&uploadId=' + $(e.target).closest("div.btn-group").attr('uploadId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie wiadomości przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.upload-delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/articles?uploadId=' + $(e.target).closest("div.btn-group").attr('uploadId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania wiadomości przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-upload').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + window.location.search + '&uploadId=', (core.getActionUrl()));
        });

        $('form').on('submit', function (e) {
            e.preventDefault();

            CKEDITOR.instances.editor1.updateElement();

            var $form = $('form');
            var data = core.getFormData($form);

            $.extend(data, croppedImage);

            const toBase64 = file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });


            function mainPhotoToBase() {
                const file = document.querySelector('#main').files[0];
                if (typeof file !== 'undefined') {
                    data.mainPhotoName = file.name;
                    data.mainPhotoType = file.type;
                    var base64File = toBase64(file);

                    return base64File;
                } else {
                    return Promise.resolve('');

                }
            }

            mainPhotoToBase().then(function (base64File) {
                data.mainPhotoBase = base64File;
                data.cropScale = imgScale(base64File);

                core.makeXhr({
                    method: $(e.target).find('.save-form').attr('method'),
                    url: 'api/admin/articles',
                    params: data
                }).then(() => {
                    core.changeUrl(window.location.origin + window.location.pathname);
                    window.location.reload(true);
                });
            });

        });
    });
};

showUploadById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/articles?articleId=' + core.getUrlParameter('articleId') + '&uploadId=' + core.getUrlParameter('uploadId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminUpload.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminPorady();

        function readURL2(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#mainPhoto').attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }

        $("#main").change(function () {
            readURL(this);
        });

        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            const toBase64 = file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });


            function mainPhotoToBase() {
                const file = document.querySelector('#main').files[0];
                if (typeof file !== 'undefined') {
                    data.mainPhotoName = file.name;
                    data.mainPhotoType = file.type;
                    var base64File = toBase64(file);

                    return base64File;
                } else {
                    return Promise.resolve('');

                }
            }

            mainPhotoToBase().then(function (base64File) {
                data.mainPhotoBase = base64File;

                core.makeXhr({
                    method: $(e.target).find('.save-form').attr('method'),
                    url: 'api/admin/articles',
                    params: data
                }).then(() => {
                    core.changeUrl(window.location.origin + window.location.pathname);
                    window.location.reload(true);
                });
            });
        });
    });
};

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#mainPhoto').attr('src', e.target.result);
            $('#mainPhoto').Jcrop({
                onSelect: imageCoords,
                aspectRatio: 3 / 2,
                setSelect: [0, 100, 100, 0]
            });
        };

        reader.readAsDataURL(input.files[0]);
    }
}

/*
 * Funkcja zwraca wymiary obrazka na podstawie zakodowanego zdjecia w base64
 */
function imgScale(base64file) {
    var image = new Image();
    image.src = base64file;

    var width = $(document).find('#mainPhoto').width();
    var imgW = image.naturalWidth || image.width;

    var scale = imgW / width;

    return scale;
}

function imageCoords(c) {
    croppedImage.cropX = c.x;
    croppedImage.cropY = c.y;
    croppedImage.cropW = c.w;
    croppedImage.cropH = c.h;
}

