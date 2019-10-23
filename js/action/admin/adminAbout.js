function actionRun() {
    showAbout();
}

showAbout = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/admin/about'
    }).then((result) => {
        return core.compileLayout('/action/admin/adminAbout.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then(() => {
        CKEDITOR.config.height = 300;
        CKEDITOR.replace('editor1');

        $('form').on('submit', function (e) {
            e.preventDefault();

            CKEDITOR.instances.editor1.updateElement();

            var $form = $('form');
            var data = core.getFormData($form);

            core.makeXhr({
                method: 'POST',
                url: 'api/admin/about',
                params: data
            }).then(() => {
                core.changeUrl(window.location.origin + window.location.pathname);
                window.location.reload(true);
            });

        });
    });
};
