function actionRun() {
    if (core.getUrlParameter('contactId') == undefined) {
        showAllContacts();
    } else {
        showContactById();
    }
}

showAllContacts = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/contact'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminKontakt.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        $(document).find('section[id="content"]').find('.edit').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?contactId=' + $(e.target).closest("div.btn-group").attr('contactId'), (core.getActionUrl()));
        });

    });
};

showContactById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/contact?contactId=' + core.getUrlParameter('contactId')
    }).then((result) => {
        return core.compileLayout('/action/admin/adminKontaktSingle.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        let validate = new validateAdminContact();
        
        $('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: $(e.target).find('.save-form').attr('method'),
                url: 'api/admin/contact',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};