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
        let validation = new validateAdminKadraPerson();
        
        $("#main").change(function () {
            readURL(this);
        });

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

            mainPhotoToBase().then(function (base64File) {
                data.mainPhotoBase = base64File;
                data.cropScale = imgScale(base64File);

                    core.makeXhr({
                        method: $(e.target).find('.save-form').attr('method'),
                        url: 'api/admin/person',
                        params: data
                    }).then((e) => {
//                        if (e.response) {
//                            var errors = JSON.parse(e.response);
//                            console.log(errors);
//
//                            for (var key in errors) {
//                                // skip loop if the property is from prototype
//                                if (!errors.hasOwnProperty(key))
//                                    continue;
//
//                                var obj = errors[key];
//                                for (var prop in obj) {
//                                    // skip loop if the property is from prototype
//                                    if (!obj.hasOwnProperty(prop))
//                                        continue;
//
//                                    // your code
////                                    console.log(key, obj['value']);
//
////                                    console.log(prop);
////                                    if (prop != 'value') {
////                                        core.executeFunctionByName(`validators.${prop}`, key, obj['value'], 5);
////                                    }
////                                    executeFunctionByName(`validators.${prop}`, key, obj['value']);
//
//                                    validators.isEmpty(key, obj['value']);
//                                    validators.minLength(key, obj['value'], 5);
////                                    console.log(key);
////                                    console.log(obj['value']);
////                                    alert(prop + " = " + obj[prop]);
//                                }
//                            }
//                        }

                        core.changeUrl(window.location.origin + window.location.pathname);
                        window.location.reload(true);
                    });
//                core.makeXhr({
//                    method: $(e.target).find('.save-form').attr('method'),
//                    url: 'api/admin/person',
//                    params: data
//                }).then(() => {
//                        core.changeUrl(window.location.origin + window.location.pathname);
//                        window.location.reload(true);
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
                aspectRatio: 1 / 1.75,
                setSelect: [0, 100, 0, 0]
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
;

