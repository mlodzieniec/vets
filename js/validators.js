class Validators {
    constructor() {
        this.validationErrors = {};
    }

    /**
     * Sprawdzenie czy pole do uzupełnienia jest puste.
     * 
     * @param {string} name         Nazwa inputa, który jest walidowany
     * @param {string} value        Wartość którą, poddajemy walidacji w formie 
     * @param {string} message      Komunikat błędu - opcjonalnie
     * @returns {undefined}
     */
    isEmpty(name, value, message = null) {
        var text = message !== null ? message : 'Wartość nie może pozostać pusta';

        if (validate.isEmpty(value)) {
            if ($(document).find(`div[item-name="${name}"]`).children('p.isEmpty').length < 1) {
                $(document).find(`div[item-name="${name}"]`).append(`<p class="crucial isEmpty">${text}</p>`);
            }
        } else {
            $(document).find(`div[item-name="${name}"] > p.crucial`).remove();
    }
    }

    /**
     * Sprawdzenie czy pole do uzupełnienia posiada minimalną ilość znaków.
     * 
     * @param {string} name         Nazwa inputa, który jest walidowany
     * @param {string} value        Wartość którą, poddajemy walidacji w formie 
     * @param {int} amount          Minimalna ilość znaków - opcjonalnie. Domyślna wartość 3.
     * @param {string} message      Komunikat błędu - opcjonalnie
     * @returns {undefined}
     */
    minLength(name, value, amount = 3, message = null) {
        var text = message !== null ? message : `Wpisana wartość jest zbyt krótka - minimalna ilość znaków to <b>${amount}</b>`;

        if (value.length < amount) {
            if ($(document).find(`div[item-name="${name}"]`).children('p.tooShort').length < 1) {
                $(document).find(`div[item-name="${name}"]`).append(`<p class="crucial tooShort">${text}</p>`);
            }
        } else {
            $(document).find(`div[item-name="${name}"] > p.tooShort`).remove();
    }
    }

    /**
     * Sprawdzenie czy pole do uzupełnienia nie przekracza maksymalnej ilości znaków.
     * 
     * @param {string} name         Nazwa inputa, który jest walidowany
     * @param {string} value        Wartość którą, poddajemy walidacji w formie 
     * @param {int} amount          Dopuszczalna maksymalna ilość znaków - opcjonalnie. Domyślna wartość 50.
     * @param {string} message      Komunikat błędu - opcjonalnie 
     * @returns {undefined}
     */
    maxLength(name, value, amount = 50, message = null) {
        var text = message !== null ? message : `Wpisana wartość jest zbyt długa - maksymalna ilość znaków to <b>${amount}</b>`;

        if (value.length > amount) {
            if ($(document).find(`div[item-name="${name}"]`).children('p.tooLong').length < 1) {
                $(document).find(`div[item-name="${name}"]`).append(`<p class="crucial tooLong">${text}</p>`);
            }
        } else {
            $(document).find(`div[item-name="${name}"] > p.tooLong`).remove();
    }
    }

    /**
     * Sprawdzenie czy podana wartośc jest datą.
     * 
     * @param {string} name         Nazwa pola atrybutu item-name do sprawdzenia
     * @param {string} value        Wartość, którą poddajemy walidacji
     * @param {string} message      Komunikat błędu - opcjonalnie 
     * @returns {undefined}
     */
    isDate(name, value, message = null) {
        var text = message !== null ? message : `Wpisano nieprawidłową wartość daty - prawidłowa wartośc to np. <b>1999-01-01</b>`;

        if (!validate.isDate(value)) {
            if ($(document).find(`div[item-name="${name}"]`).children('p.notDate').length < 1) {
                $(document).find(`div[item-name="${name}"]`).append(`<p class="crucial notDate">${text}</p>`);
            }
        } else {
            $(document).find(`div[item-name="${name}"] > p.notDate`).remove();
    }
    }

    /**
     * Zmiana pierwszej litery na wielką.
     * 
     * @param {string} name         Nazwa pola, w którym chcemy zmienić wartość
     * @param {string} value        Wartość, której chcemy zmienić pierwszą literę na wielką
     * @returns {undefined}
     */
    capitalize(name, value) {
        if (value) {
            var capitalized = validate.capitalize(value);
            console.log(capitalized);
            $(document).find(`div[item-name="${name}"]`).children(`input[name="${name}"]`).val(capitalized);
        }
    }

    errors() {
        return this.validationErrors;
    }

}