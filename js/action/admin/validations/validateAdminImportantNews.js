class validateAdminImportantNews{
//    this = $(this)[0];
    
    constructor() {
        $(document).find('section[id="content"]').find('input[name="date"]').focusout(function () {
            validators.isDate(this.name, this.value);
            validators.isEmpty(this.name, this.value);
            validators.minLength(this.name, this.value, 10);
            validators.maxLength(this.name, this.value, 10);
        });

        $(document).find('section[id="content"]').find('input[name="content"]').focusout(function () {
            validators.capitalize(this.name, this.value);
            validators.isEmpty(this.name, this.value);
            validators.minLength(this.name, this.value);
            validators.maxLength(this.name, this.value, 80);
        });

    }
}
