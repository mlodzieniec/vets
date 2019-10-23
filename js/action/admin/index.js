function actionRun() {
    showIndex();

}

showIndex = () => {
    return core.compileLayout('/action/admin/adminIndex.html', $(document).find('section[id="content"]'), {});
};
    