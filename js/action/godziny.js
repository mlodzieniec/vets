function actionRun() {
//    if (!core.getUrlParameter('personId')) {
        showHours();
//    } else {
//        showMemberById();
//    }
}

showHours = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/person'
    }).then((result) => {
        return core.compileLayout('/action/godziny.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    });
//            .then((result2) => {
//        $(document).find('section[id="content"]').find('a[personid]').on('click', (e) => {
//            e.preventDefault();
//            core.changeUrl(window.location.pathname + '?personId=' + $(e.target).attr('personId'), (core.getActionUrl()));
//        });
//    });
};

//showMemberById = (id) => {
//    core.makeXhr({
//        method: 'GET',
//        url: 'api/person?personId=' + core.getUrlParameter('personId')
//    }).then((result) => {
//        core.compileLayout('/action/kadraPerson.html', $(document).find('section[id="content"]'), {person: JSON.parse(result.response)});
//    });
//};