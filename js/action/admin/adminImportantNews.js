function actionRun() {
    if (core.getUrlParameter('newsId') == undefined) {
        showAllNews();
    } else {
        showNewsId();
    }
}

showAllNews = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/importantNews'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminImportantNews.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        $(document).find('section[id="content"]').find('.edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?newsId=' + $(e.target).closest("div.btn-group").attr('newsId'), (core.getActionUrl()));
        });


        /*
         *  Usuwanie wiadomości przy pomocy przycisku na liście wiadomości w administracji
         */
        $(document).find('section[id="content"]').find('.delete').on('click', (e) => {
            e.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć tę wiadomość?')) {
                core.makeXhr({
                    method: 'DELETE',
                    url: 'api/admin/importantNews?newsId=' + $(e.target).closest("div.btn-group").attr('newsId')
                }).then(() => {
                    window.location.reload(true);
                });
            }
        });

        /*
         *  Przejście do dodawania wiadomości przy pomocy przycisku w górnej części administracji
         */
        $(document).find('section[id="content"]').find('.add-news').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?newsId=', (core.getActionUrl()));
        });
    });
};

showNewsId = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/importantNews?newsId=' + core.getUrlParameter('newsId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminImportantNewsNews.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        $("#datepicker").datepicker({format: 'yyyy-mm-dd'});
        
        let validation = new validateAdminImportantNews();

        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/importantNews',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};