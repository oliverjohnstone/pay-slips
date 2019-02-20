class PaySlipRepository {
    constructor(storage) {
        this._storage = storage;
    }

    save(paySlip) {
        return this._storage.save(paySlip);
    }

    async exists(paySlip) {
        const count = await this._storage.count({ payDate: paySlip.payDate });
        return count > 0;
    }

    find(query) {
        return this._storage.find(query);
    }
}

module.exports = {
    PaySlipRepository
};
