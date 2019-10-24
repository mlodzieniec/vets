class validateAdminContact {
    this = $(this)[0];

    constructor() {
        /*
         * Adresy
         */ 
        $(document).find('section[id="content"]').find('input[name="address1"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="address2"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="address3"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="address4"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="address5"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        /*
         * Godziny
         */ 
        $(document).find('section[id="content"]').find('input[name="open1"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="open2"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="open3"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="open4"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });

        $(document).find('section[id="content"]').find('input[name="open5"]').focusout(function () {
            validators.maxLength(this.name, this.value, 45);
        });
    }
}
