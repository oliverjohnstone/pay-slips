const puppeteer = require('puppeteer');
const tbltojson = require('tabletojson');
const { host, username, password } = require('./config.json');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(host);

    await page.type('#txtEeID', username);
    await page.type('#txtPIN', password);

    await clickWithWait(page, '#ibtnLogon');
    await clickWithWait(page, '#ctl27_quickmenu_linkpayslip');

    const tbl = await page.$('#payslip');

    await tbl.screenshot({ path: 'test.png' });

    const str = await page.$eval('#payslip', tbl => tbl.innerHTML);

    const json = tbltojson.convert(str);

    const toFind = {
        NILetter: /NI Letter & No: (.*)/,
        TaxCode: /Tax Code: (.*)/,
        PayBy: /Pay By: (.*)/,
        Date: /Date: (.*)/,
        Period: /Period: (\d*)/,
        ersNICTP: /^Ers NIC TP: (.*)$/,
        ersPensionTP: /^Ers Pension TP: (.*)$/,
        taxRef: /^Tax Reference: (.*)$/,
        taxDistrict: /Tax District: (.*)/,
    };

    const flatten = json.reduce((acc, row) => {
        Object.values(row).forEach(el => {
            Object.values(el).forEach(i => {
                acc = acc.concat(i.split('\n'));
            });
        });
        return acc;
    }, []).map(i => i.replace(/\t/g, '').trim()).filter(Boolean);

    const mapped = Object.keys(toFind).reduce((acc, key) => {
        const found = flatten.find(i => {
            const result = toFind[key].exec(i);
            return result && result.length > 1;
        });

        if (found) {
            const [ captcha ] = toFind[key].exec(found).slice(1);
            return { ...acc, [key]: captcha };
        }
        return acc;
    }, Object.keys(toFind).reduce((acc, k) => ({ ...acc, [k]: false }), {}));

    const salaryId = flatten.indexOf('Salary') + 1;
    const netPay = flatten.indexOf('NET PAY>>>') + 1;

    console.log({...mapped, salary: flatten[salaryId], net: flatten[netPay]});

    await browser.close();
})();

const clickWithWait = (page, tag) => Promise.all([ page.waitForNavigation(), page.click(tag) ]);