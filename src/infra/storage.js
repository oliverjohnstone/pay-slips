class Storage {
    constructor(db, collection) {
        this._collection = db.collection(collection);
    }

    save(document) {
        return this._collection.save(document);
    }

    find(query) {
        return this._collection.find(query);
    }

    read(id) {
        return this._collection.findOne({ _id: id });
    }

    count(query) {
        return this._collection.count(query);
    }
}

module.exports = Storage;