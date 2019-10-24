function actionRun() {
    if (core.getUrlParameter('categoryId') == undefined && core.getUrlParameter('serviceId') == undefined) {
        showAll();
    } else if (core.getUrlParameter('categoryId') != undefined) {
        showCategoryById();
    } else if (core.getUrlParameter('serviceId') != undefined) {
        showServiceById();
    }
}

showAll = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/servicesBig'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminZwierzetaGospodarskie.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
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
                    url: 'api/admin/servicesBig?categoryId=' + $(e.target).closest("div.btn-group").attr('categoryId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania nagłówka przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-big-category').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?categoryId=', (core.getActionUrl()));
        });

        /*
         * 
         * POZYCJE
         * 
         */

        $(document).find('section[id="content"]').find('.service-edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?serviceId=' + $(e.target).closest("div.btn-group").attr('serviceId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie wiadomości przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.service-delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę pozycję?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/servicesBig?serviceId=' + $(e.target).closest("div.btn-group").attr('serviceId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania wiadomości przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-big-service').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?serviceId=', (core.getActionUrl()));
        });

    });
};

showCategoryById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/servicesBig?categoryId=' + core.getUrlParameter('categoryId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminZwierzetaGospodarskieCategory.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminBigPets();

        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/servicesBig',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};

showServiceById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/servicesBig?serviceId=' + core.getUrlParameter('serviceId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminZwierzetaGospodarskieService.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminBigPets();

        CKEDITOR.config.height = 300;
        CKEDITOR.replace('editor1');

        $('form').on('submit', function (e) {
            e.preventDefault();

            CKEDITOR.instances.editor1.updateElement();


            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/servicesBig',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};