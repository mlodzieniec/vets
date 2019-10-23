function actionRun() {
    showBigServices();
}

showBigServices = () => {
    core.makeXhr({
        method: 'GET',
        url: 'api/servicesBig'
    }).then((result) => {
        return core.compileLayout('/action/zwierzetaGospodarskie.html', $(document).find('section[id="content"]'), {data: JSON.parse(result.response)});
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