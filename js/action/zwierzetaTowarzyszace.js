function actionRun() {
    showSmallServices();
}

showSmallServices = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/servicesSmall'
    }).then((result) => {
        return core.compileLayout('/action/zwierzetaTowarzyszace.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
    }).then((result2) => {
        
        $(document).find('section[id="content"]').find("li.showAdditional").on("click", (function (e) {
            var additionalDiv = $(this).children('div.additionalInfo');

            if(additionalDiv.hasClass('showAdditionalInfo')){
                additionalDiv.removeClass('showAdditionalInfo');
            } else {
                 additionalDiv.addClass('showAdditionalInfo');
            }
        }));
    });

};
