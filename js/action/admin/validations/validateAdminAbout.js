class validateAdminKadraPerson {
    this = $(this)[0];
    
    constructor() {
        $(document).find('section[id="content"]').find('input[name="firstName"]').focusout(function () {
            validators.capitalize(this.name, this.value);
            validators.isEmpty(this.name, this.value);
            validators.minLength(this.name, this.value, 3);
            validators.maxLength(this.name, this.value, 50);
        });

        $(document).find('section[id="content"]').find('input[name="lastName"]').focusout(function () {
            validators.capitalize(this.name, this.value);
            validators.isEmpty(this.name, this.value);
            validators.minLength(this.name, this.value, 5);
            validators.maxLength(this.name, this.value, 50);
        });
        
        $(document).find('section[id="content"]').find('input[name="type"]').focusout(function () {
            validators.isEmpty(this.name, this.value);
        });
        
    }
}
