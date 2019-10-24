class validateAdminGallery {
    this = $(this)[0];

    constructor() {
        $(document).find('section[id="content"]').find('input[name="name"]').focusout(function () {
            validators.capitalize(this.name, this.value);
            validators.isEmpty(this.name, this.value);
            validators.minLength(this.name, this.value, 3);
            validators.maxLength(this.name, this.value, 50);
        });


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
