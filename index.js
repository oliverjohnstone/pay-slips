const Scrape = require('./src/scrape/index.js');
const scrapeConfig = require('./epayslips/config.js');
const replacementTokens = require('./config.json');
const debug = true;

(async () => {
    const scrape = new Scrape(scrapeConfig, replacementTokens, debug);
    const config = await scrape.getParsedValues();
    console.log(config);
})();