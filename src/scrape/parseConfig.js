const Process = require('./process.js');

class ConfigValue {
    constructor(name, regex) {
        this.name = name;
        this.regex = new RegExp(regex);
        this.postProcess = null;
    }

    parseToPennies() {
        this.postProcess = Process.money;
        return this;
    }

    parseToInteger() {
        this.postProcess = Process.int;
        return this;
    }

    parseToPaymentMethod() {
        this.postProcess = Process.paymentMethod;
        return this;
    }

    parseToDate(format) {
        this.postProcess = Process.date.bind(null, format);
        return this;
    }
}

class ParseConfig {
    static NationalInsuranceNumber(regex) {
        return new ConfigValue('nationalInsuranceNumber', regex);
    }

    static TaxCode(regex) {
        return new ConfigValue('taxCode', regex);
    }

    static paidBy(regex) {
        return new ConfigValue('paidBy', regex);
    }

    static payDate(regex) {
        return new ConfigValue('payDate', regex);
    }

    static payPeriod(regex) {
        return new ConfigValue('payPeriod', regex);
    }

    static employersNIContributions(regex) {
        return new ConfigValue('employersNIContributions', regex);
    }

    static employersPensionContributionsThisPeriod(regex) {
        return new ConfigValue(
            'employersPensionContributionsThisPeriod',
            regex
        );
    }

    static taxReference(regex) {
        return new ConfigValue('taxReference', regex);
    }

    static taxDistrict(regex) {
        return new ConfigValue('taxDistrict', regex);
    }
}

module.exports = ParseConfig;