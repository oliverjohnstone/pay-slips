const appendSalaryAndNetPay = (mapped, table) => ({
    ...mapped,
    salary: table[table.indexOf('Salary') + 1],
    net: table[table.indexOf('NET PAY>>>') + 1]
});

module.exports = {
    appendSalaryAndNetPay
};