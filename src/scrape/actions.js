const puppeteer = require('puppeteer');
const tbltojson = require('tabletojson');
const { flattenTable } = require('./utils.js');

class ScrapeActions {
    constructor(commands, debug = false) {
        this.commands = commands;
        this.page = null;
        this.debug = debug;
    }

    close() {
        return this.browser.close();
    }

    async parseTable({ tableId, values, screenshot = false, postProcess = null }) {
        if (screenshot) {
            const tbl = await this.page.$(tableId);
            await tbl.screenshot({ path: 'test.png' });
        }
        const str = await this.page.$eval(tableId, tbl => tbl.innerHTML);
        const json = tbltojson.convert(str);
        const flattenedTable = flattenTable(json);
        const mapped = this._mapTable(flattenedTable, values);
        const processFn = this._loadPostProcessFunction(postProcess);
        return processFn(mapped, flattenedTable);
    }

    _loadPostProcessFunction(postProcess) {
        return postProcess || (value => value);
    }

    _mapTable(flattenedTable, values) {

        const defaultObj = values.reduce((acc, { name }) => ({ ...acc, [name]: false }), {});

        return values.reduce((acc, config) => {
            const processFn = this._loadPostProcessFunction(config.postProcess);
            const found = flattenedTable.find(i => {
                const result = config.regex.exec(i);
                return result && result.length > 1;
            });

            if (found) {
                const [ value ] = config.regex.exec(found).slice(1);
                return { ...acc, [config.name]: processFn(value) };
            }
            return acc;
        }, defaultObj);
    }

    async run() {
        const config = this.debug ? { headless: false } : {};
        this.browser = await puppeteer.launch(config);
        this.page = await this.createPage();

        let command = this.commands.next();
        while (command !== null) {
            await this[command.name](...command.args);
            command = this.commands.next();
        }
    }

    createPage() {
        return this.browser.newPage();
    }

    goTo(url) {
        return this.page.goto(url);
    }

    enterText(id, text) {
        return this.page.type(id, text);
    }

    clickAndWaitFor(id) {
        return Promise.all([
            this.page.waitForNavigation(),
            this.page.click(id)
        ]);
    }
}

module.exports = ScrapeActions;