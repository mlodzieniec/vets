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
        url: 'api/admin/servicesSmall'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminZwierzetaTowarzyszace.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
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
            if (confirm('Czy na pewno chcesz usunąć ten nagłówek?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/servicesSmall?categoryId=' + $(e.target).closest("div.btn-group").attr('categoryId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania nagłówka przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-small-category').on('click', (e) => {
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
            if (confirm('Czy na pewno chcesz usunąć ten nagłówek?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/servicesSmall?serviceId=' + $(e.target).closest("div.btn-group").attr('serviceId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania wiadomości przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-small-service').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?serviceId=', (core.getActionUrl()));
        });

    });
};

showCategoryById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/servicesSmall?categoryId=' + core.getUrlParameter('categoryId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminZwierzetaTowarzyszaceCategory.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/servicesSmall',
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
        url: 'api/admin/servicesSmall?serviceId=' + core.getUrlParameter('serviceId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminZwierzetaTowarzyszaceService.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        CKEDITOR.config.height = 300;
        CKEDITOR.replace('editor1');

        $('form').on('submit', function (e) {
            e.preventDefault();

            CKEDITOR.instances.editor1.updateElement();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/servicesSmall',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};