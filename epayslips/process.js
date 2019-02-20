const Process = require('../src/scrape/process.js');

const appendSalaryAndNetPay = (mapped, table) => ({
    ...mapped,
    salary: Process.money(table[table.indexOf('Salary') + 1]),
    net: Process.money(table[table.indexOf('NET PAY>>>') + 1])
});

module.exports = {
    appendSalaryAndNetPay
};