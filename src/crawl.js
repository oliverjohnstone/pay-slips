const interval = require('interval-promise');
const Scrape = require('./scrape/index.js');
const debug = true;

class Crawl {
    constructor(userRepository, paySlipRepository) {
        this._users = userRepository;
        this._paySlips = paySlipRepository;
        this._configs = {};
    }

    run(ms) {
        interval(this.crawl.bind(this), ms);
    }

    _ensureConfig(name) {
        if (!this._configs[name]) {
            this._configs[name] = require(`../${name}/config.js`);
        }
        return this._configs[name];
    }

    async crawl() {
        const users = await this._users.find({}).toArray();
        users.forEach(async ({ username, password, host, _id: userId }) => {
            const config = this._ensureConfig(host);
            const replacementTokens = {
                "{{USER_NAME}}": username,
                "{{PASSWORD}}": password
            };
            const scrape = new Scrape(config, replacementTokens, debug);
            const slip = await scrape.getParsedValues();
            slip.user = userId.valueOf().toHexString();
            const slipExists = await this._paySlips.exists(slip);
            if (!slipExists) {
                await this._paySlips.save(slip);
            }
        });
    }
}

module.exports = Crawl;