const {
    CMD,
    TOKENS
} = require('../src/scrape/commands.js');
const ParseConfig = require('../src/scrape/parseConfig.js');

module.exports = {
  actions: [
      CMD.goTo('https://my.epayslips.com/Pages/Payslips.aspx'),
      CMD.enterText('#txtEeID', TOKENS.USER_NAME),
      CMD.enterText('#txtPIN', TOKENS.PASSWORD),
      CMD.clickAndWait('#ibtnLogon'),
      CMD.clickAndWait('#ctl27_quickmenu_linkpayslip')
  ],
  parse: {
    screenshot: true,
    tableId: "#payslip",
    postProcess: require('./process.js').appendSalaryAndNetPay,
    values: [
      ParseConfig.NationalInsuranceNumber('NI Letter & No: (.*)'),
      ParseConfig.TaxCode('Tax Code: (.*)'),
      ParseConfig.paidBy('Pay By: (.*)').parseToPaymentMethod(),
      ParseConfig.payDate('Date: (.*)').parseToDate('DD/MM/YYYY'),
      ParseConfig.payPeriod('Period: (\\d*)').parseToInteger(),
      ParseConfig.employersNIContributions('^Ers NIC TP: (.*)$').parseToPennies(),
      ParseConfig.employersPensionContributionsThisPeriod('^Ers Pension TP: (.*)$').parseToPennies(),
      ParseConfig.taxReference('^Tax Reference: (.*)$'),
      ParseConfig.taxDistrict('Tax District: (.*)')
    ]
  }
}