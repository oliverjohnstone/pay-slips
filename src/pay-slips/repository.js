const {PaySlip} = require('../protobuf/service_pb.js');

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

    async find(query) {
        const results = await this._storage.find(query).toArray();
        return results.map(result => {
            const slip = new PaySlip();
            slip.setId(result._id);
            slip.setNationalinsurancenumber(result.nationalInsuranceNumber);
            slip.setTaxcode(result.taxCode);
            slip.setPaidby(result.paidBy);
            slip.setPaydate(result.payDate);
            slip.setPayperiod(result.payPeriod);
            slip.setEmployersnicontributions(result.employersNIContributions);
            slip.setEmployerspensioncontributionsthisperiod(result.employersPensionContributionsThisPeriod);
            slip.setTaxreference(result.taxReference);
            slip.setTaxdistrict(result.taxDistrict);
            slip.setSalary(result.salary);
            slip.setNet(result.net);
            slip.setUser(result.user);
            return slip;
        });
    }
}

module.exports = {
    PaySlipRepository
};
