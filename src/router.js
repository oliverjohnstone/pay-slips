const { Router: ExpressRouter } = require('express');

class Router {
    constructor(users, payslips) {
        this._users = users;
        this._payslips = payslips;
    }

    get routes() {
        const router = new ExpressRouter();
        router.get('/slips/:id', this.getSlips.bind(this));
        return router;
    }

    async getSlips(req, res) {
        const { id } = req.params;
        const slips = await this._payslips.find({ user: id }).toArray();
        res.json(slips);
    }
}

module.exports = Router;
