const ScrapeActions = require('./actions.js');
const { Commands } = require('./commands.js');

class Scrape {
    constructor(config, replacementTokens, debug = false) {
        this.config = config;
        this.commands = new Commands(config.actions, replacementTokens);
        this.actions = new ScrapeActions(this.commands, debug);
    }

    async getParsedValues() {
        await this.actions.run();
        const values = await this.actions.parseTable(this.config.parse);
        this.actions.close();
        return values;
    }
}

module.exports = Scrape;