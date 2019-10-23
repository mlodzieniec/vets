function actionRun() {
    if (!core.getUrlParameter('personId')) {
        showAllTeamMembers();
    } else {
        showMemberById();
    }
}

showAllTeamMembers = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/person'
    }).then((result) => {
        return core.compileLayout('/action/kadra.html', $(document).find('section[id="content"]'), {persons: JSON.parse(result.response)});
    }).then((result2) => {
//        $('.loading').show();
//        core.hideLoader();

        $(document).find('section[id="content"]').find('a[personid]').on('click', (e) => {
            e.preventDefault();
            core.changeUrl(window.location.pathname + '?personId=' + $(e.target).attr('personId'), (core.getActionUrl()));
        });
    });
};

showMemberById = (id) => {
    core.makeXhr({
        method: 'GET',
        url: 'api/person?personId=' + core.getUrlParameter('personId')
    }).then((result) => {
        core.compileLayout('/action/kadraPerson.html', $(document).find('section[id="content"]'), {person: JSON.parse(result.response)});
    });
};