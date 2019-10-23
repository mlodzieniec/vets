function actionRun() {
    if (!core.getUrlParameter('articleId')) {
        showAllArticles();
    } else {
        if (typeof FB !== undefined) {
            FB = undefined;
        }
        
        showArticleById();
    }
}

showAllArticles = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/articles'
    }).then((result) => {
        return core.compileLayout('/action/artykuly.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then((result2) => {
        $('.loading').show();
        core.hideLoader();
        
        core.addJs("js/plugins.js");
        core.addJs("js/functions.js");
        SEMICOLON.documentOnLoad.init();
        $(document).find('section[id="content"]').find('a[articleId]').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?articleId=' + $(e.target).attr('articleId'), (core.getActionUrl()));
        });
    });
};

showArticleById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/articles?articleId=' + core.getUrlParameter('articleId')
    }).then((result) => {
        return core.compileLayout('/action/artykulyArtykul.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then((result2) => {
        core.addJs("js/plugins.js");
        core.addJs("js/functions.js");
        SEMICOLON.widget.carousel();
    })
};