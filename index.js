const createSystem = require('./src/system.js');

(async () => {
    const system = await createSystem({
        mongo: { host: 'mongodb://localhost:27017', db: 'pay-slips' }
    });
    await system.run();
})();