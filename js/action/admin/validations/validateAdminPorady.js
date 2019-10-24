class validateAdminPorady {
    this = $(this)[0];

    constructor() {
        if (typeof core.getUrlParameter('categoryId') !== 'undefined') {
            $(document).find('section[id="content"]').find('input[name="name"]').focusout(function () {
                validators.capitalize(this.name, this.value);
                validators.isEmpty(this.name, this.value);
                validators.minLength(this.name, this.value, 3);
                validators.maxLength(this.name, this.value, 50);
            });
        }

        if (typeof core.getUrlParameter('articleId') !== 'undefined' && typeof core.getUrlParameter('uploadId') === 'undefined') {
            $(document).find('section[id="content"]').find('input[name="date"]').focusout(function () {
                validators.isDate(this.name, this.value);
                validators.isEmpty(this.name, this.value);
                validators.minLength(this.name, this.value, 10);
                validators.maxLength(this.name, this.value, 10);
            });

            $(document).find('section[id="content"]').find('input[name="title"]').focusout(function () {
                validators.capitalize(this.name, this.value);
                validators.isEmpty(this.name, this.value);
                validators.minLength(this.name, this.value);
                validators.maxLength(this.name, this.value);
            });

            $(document).find('section[id="content"]').find('input[name="category"]').focusout(function () {
                validators.isEmpty(this.name, this.value);
            });
        }

        if (typeof core.getUrlParameter('uploadId') !== 'undefined') {
            $(document).find('section[id="content"]').find('input[name="title"]').focusout(function () {
                validators.capitalize(this.name, this.value);
                validators.isEmpty(this.name, this.value);
                validators.minLength(this.name, this.value);
                validators.maxLength(this.name, this.value);
            });
        }
    }
}
