class UserRepository {
    constructor(storage) {
        this._storage = storage;
    }

    find(query) {
        return this._storage.find(query);
    }
}

module.exports = {
    UserRepository
};
