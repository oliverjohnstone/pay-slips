const grpc = require('grpc');

const messages = require('../src/protobuf/service_pb.js');
const services = require('../src/protobuf/service_grpc_pb.js');

const client = new services.PaySlipsClient('localhost:3000', grpc.credentials.createInsecure());
const request = new messages.GetPaySlipsRequest();

client.getPaySlips(request, (err, resp) => {
    console.log(resp.getSlipsList());
});
