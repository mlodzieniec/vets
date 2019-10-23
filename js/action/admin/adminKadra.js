function actionRun() {
    if (core.getUrlParameter('personId') == undefined) {
        showAllMembers();
    } else {
        showMemberById();
    }
}
var croppedImage = {};
showAllMembers = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/person'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminKadra.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        $(document).find('section[id="content"]').find('.edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?personId=' + $(e.target).closest("div.btn-group").attr('personId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie osób przy pomocy przycisku na liście osób w administracji
         */
        $(document).find('section[id="content"]').find('.delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę osobę?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/person?personId=' + $(e.target).closest("div.btn-group").attr('personId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania osoby przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-person').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?personId=', (core.getActionUrl()));
        });
    });
};

showMemberById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/person?personId=' + core.getUrlParameter('personId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminKadraPerson.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        $("#main").change(function () {
            readURL(this);
        });
//        $("#thumbnail").change(function () {
//            readURL2(this);
//        });

        $('form').on('submit', function (e) {
            e.preventDefault();

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

//            function thumbnailPhotoToBase() {
//                const file2 = document.querySelector('#thumbnail').files[0];
//                if (typeof file2 !== 'undefined') {
//                    data.thumbnailPhotoName = file2.name;
//                    data.thumbnailPhotoType = file2.type;
//                    var base64File2 = toBase64(file2);
//
//                    return base64File2;
//                } else {
//                    return Promise.resolve('');
//
//                }
//            }

            mainPhotoToBase().then(function (base64File) {
                data.mainPhotoBase = base64File;
                data.cropScale = imgScale(base64File);

//                thumbnailPhotoToBase().then(function (base64File2) {
//                    data.thumbnailPhotoBase = base64File2;
//                    data.cropScale = imgScale(base64File2);

                core.makeXhr({
                    method: $(e.target).find('.save-form').attr('method'),
                    url: 'api/admin/person',
                    params: data
                }).then(() => {
//                        core.changeUrl(window.location.origin + window.location.pathname);
//                        window.location.reload(true);
                });

//                });
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
                aspectRatio: 1 / 1.75
            });
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//function readURL2(input) {
//    if (input.files && input.files[0]) {
//        var reader = new FileReader();
//
//        reader.onload = function (e) {
//            $('#thumbnailPhoto').attr('src', e.target.result);
//
//            $('#thumbnailPhoto').on('load', function () {
//                $('#thumbnailPhoto').Jcrop({
//                    onSelect: imageCoords,
//                    aspectRatio: 1 / 1
//                });
//            });
//        };
//
//        reader.readAsDataURL(input.files[0]);
//    }
//}

/*
 * Funkcja zwraca wymiary obrazka na podstawie zakodowanego zdjecia w base64
 */
function imgScale(base64file) {
    var image = new Image();
    image.src = base64file;

    var width = 200;
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
;