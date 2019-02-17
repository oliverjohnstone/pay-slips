const moment = require('moment');

class Process {
    static money(money) {
        if (money.includes('.')) {
            return parseInt(money.replace(',', '').replace('.', ''), 10);
        } else {
            return parseInt(money.replace(',', '')) * 100;
        }
    }

    static int(number) {
        return parseInt(number, 10);
    }

    static paymentMethod(method) {
        return method.toUpperCase();
    }

    static date(format, date) {
        return moment(date, format).toISOString();
    }
}

module.exports = Process;