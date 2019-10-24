function actionRun() {
    if (core.getUrlParameter('galleryId') == undefined && core.getUrlParameter('uploadId') == undefined) {
        showAll();
    } else if (core.getUrlParameter('galleryId') != undefined && core.getUrlParameter('uploadId') != undefined) {
        showUploadById();
    } else if (core.getUrlParameter('galleryId') != undefined) {
        showGalleryById();
    }
}

showAll = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/gallery'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminGaleria.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {

        /*
         * 
         * GALERIE
         * 
         */

        $(document).find('section[id="content"]').find('.gallery-edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?galleryId=' + $(e.target).closest("div.btn-group").attr('galleryId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie nagłówka przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.gallery-delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/gallery?galleryId=' + $(e.target).closest("div.btn-group").attr('galleryId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania nagłówka przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-gallery').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?galleryId=', (core.getActionUrl()));
        });



    });
};

showGalleryById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/gallery?galleryId=' + core.getUrlParameter('galleryId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminGaleriaEdit.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminGallery();
        /*
         * 
         * ZDJĘCIE
         * 
         */

        $(document).find('section[id="content"]').find('.upload-edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + window.location.search + '&uploadId=' + $(e.target).closest("div.btn-group").attr('uploadId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie zdjęcia przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.upload-delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/gallery?uploadId=' + $(e.target).closest("div.btn-group").attr('uploadId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania zdjęcia przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-upload').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + window.location.search + '&uploadId=', (core.getActionUrl()));
        });


        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/gallery',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};

showUploadById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/gallery?galleryId=' + core.getUrlParameter('galleryId') + '&uploadId=' + core.getUrlParameter('uploadId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminGalleryUpload.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminGallery();

        function readURL(input) {
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
                data.orientation = imageOrientation(base64File);

                core.makeXhr({
                    method: $(e.target).find('.save-form').attr('method'),
                    url: 'api/admin/gallery',
                    params: data
                }).then(() => {
                    core.changeUrl(window.location.origin + window.location.pathname);
                    window.location.reload(true);
                });
            });
        });
    });
};

/*
 * Funkcja sprawdza orientacje obrazka na podstawie zakodowanego zdjecia w base64
 */
function imageOrientation(base64file) {
    var image = new Image();
    image.src = base64file;

    var w = image.naturalWidth || image.width,
            h = image.naturalHeight || image.height;

    if ((h > w) || (h === w)) {
        return 'portrait';
    } else {
        return 'landscape';
    }

}