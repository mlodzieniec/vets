class validateAdminBigPets {
    this = $(this)[0];

    constructor() {
        if (typeof core.getUrlParameter('categoryId') !== 'undefined') {
            $(document).find('section[id="content"]').find('input[name="name"]').focusout(function () {
                validators.capitalize(this.name, this.value);
                validators.isEmpty(this.name, this.value);
                validators.minLength(this.name, this.value);
                validators.maxLength(this.name, this.value);
            });
        }

        if (typeof core.getUrlParameter('serviceId') !== 'undefined') {
            $(document).find('section[id="content"]').find('input[name="content"]').focusout(function () {
                validators.capitalize(this.name, this.value);
                validators.isEmpty(this.name, this.value);
                validators.minLength(this.name, this.value);
                validators.maxLength(this.name, this.value, 200);
            });
        }
    }
}
