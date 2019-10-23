function actionRun() {
    if (typeof FB !== undefined) {
        FB = undefined;
    }

    showMain();
}

showMain = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/main'
    }).then((result) => {
        return core.compileLayout('/action/main.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then((result2) => {
        $('.loading').show();
        core.hideLoader();

        core.addJs("js/plugins.js");
        core.addJs("js/functions.js");
        SEMICOLON.documentOnLoad.init();
        SEMICOLON.widget.carousel();
    });
};