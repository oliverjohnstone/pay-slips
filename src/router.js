const messages = require('./protobuf/service_pb.js');
const services = require('./protobuf/service_grpc_pb.js');

const responseMiddleware = handler => async (call, cb) => {
    try {
        cb(null, await handler(call.request));
    } catch (e) {
        cb(e);
    }
};

const loggingMiddleware = (logger, handler) => async (...args) => {
    logger.info('Handling request for: ...');
    try {
        const response = await handler(...args);
        logger.info('Request complete for: ...');
        return response;
    } catch (e) {
        logger.error('Request errored: ...', e);
        throw e;
    }
};

class Router {
    constructor(users, payslips, server, logger) {
        this._users = users;
        this._payslips = payslips;

        server.addService(services.PaySlipsService, {
            getPaySlips: responseMiddleware(loggingMiddleware(logger, this.getSlips.bind(this)))
        });
    }

    async getSlips(request) {
        // const { id } = req.params;
        const slips = await this._payslips.find({ user: '5c6dcd9d827aad815ee95b2e' }).toArray();
        const collection = new messages.PaySlipCollection();
        collection.setSlipsList(slips.map(s => {
            const slip = new messages.PaySlip();
            slip.setId(s._id);
            slip.setNationalinsurancenumber(s.nationalInsuranceNumber);
            slip.setTaxcode(s.taxCode);
            slip.setPaidby(s.paidBy);
            slip.setPaydate(s.payDate);
            slip.setPayperiod(s.payPeriod);
            slip.setEmployersnicontributions(s.employersNIContributions);
            slip.setEmployerspensioncontributionsthisperiod(s.employersPensionContributionsThisPeriod);
            slip.setTaxreference(s.taxReference);
            slip.setTaxdistrict(s.taxDistrict);
            slip.setSalary(s.salary);
            slip.setNet(s.net);
            slip.setUser(s.user);
            return slip;
        }));
        return collection;
    }
}

module.exports = Router;
