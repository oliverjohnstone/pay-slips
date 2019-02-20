const express = require('express');
const { MongoClient } = require('mongodb');
const Storage = require('./infra/storage.js');
const { UserRepository } = require('./users/repository.js');
const { PaySlipRepository } = require('./pay-slips/repository.js');
const Crawl = require('./crawl.js');
const Router = require('./router');

const createMongoConnection = (logger, { host, db }) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(host, (err, client) => {
            if (err) return reject(err);
            logger.info(`Mongo connection to ${host} opened`);
            resolve({ client, db: client.db(db) });
        });
    });
};

const createSystem = async ({ mongo }) => {
    const logger = console;
    const { client: mongoClient, db } = await createMongoConnection(logger, mongo);
    const paySlips = new PaySlipRepository(new Storage(db, 'paySlips'));
    const users = new UserRepository(new Storage(db, 'users'));
    const crawl = new Crawl(users, paySlips);
    const router = new Router(users, paySlips);

    const app = express();
    app.use('/api/1.0', router.routes);

    return {
        run: async (port) => {
            crawl.run(30000);
            app.listen(port || 3000, () => {
                logger.info(`Server listening on localhost:${port || 3000}`);
            });
            // mongoClient.close();
        }
    };
};

module.exports = createSystem;