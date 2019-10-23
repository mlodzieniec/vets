function actionRun() {
    showContact();
}

showContact = (id) => {
     core.makeXhr({
        method: 'GET',
        url: 'api/contact'
    }).then((result) => {
        core.compileLayout('/action/kontakt.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    });
};
