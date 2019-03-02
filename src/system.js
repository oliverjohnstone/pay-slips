const { MongoClient } = require('mongodb');
const grpc = require('grpc');
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
    const server = new grpc.Server();

    new Router(users, paySlips, server, logger);

    return {
        run: async (port) => {
            // crawl.run(30000);
            server.bind(`localhost:${port || 3000}`, grpc.ServerCredentials.createInsecure());
            server.start();
            // mongoClient.close();
        }
    };
};

module.exports = createSystem;