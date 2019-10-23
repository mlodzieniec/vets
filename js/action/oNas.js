function actionRun() {
    showAbout();
}

showAbout = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/about'
    }).then((result) => {
        return core.compileLayout('/action/oNas.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then((result2) => {
        core.addJs("js/plugins.js");
        core.addJs("js/functions.js");
        SEMICOLON.widget.carousel();
    });
};