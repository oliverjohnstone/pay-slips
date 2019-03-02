// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protobuf_service_pb = require('../protobuf/service_pb.js');

function serialize_payslips_GetPaySlipsRequest(arg) {
  if (!(arg instanceof protobuf_service_pb.GetPaySlipsRequest)) {
    throw new Error('Expected argument of type payslips.GetPaySlipsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_payslips_GetPaySlipsRequest(buffer_arg) {
  return protobuf_service_pb.GetPaySlipsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_payslips_PaySlipCollection(arg) {
  if (!(arg instanceof protobuf_service_pb.PaySlipCollection)) {
    throw new Error('Expected argument of type payslips.PaySlipCollection');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_payslips_PaySlipCollection(buffer_arg) {
  return protobuf_service_pb.PaySlipCollection.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaySlipsService = exports.PaySlipsService = {
  getPaySlips: {
    path: '/payslips.PaySlips/GetPaySlips',
    requestStream: false,
    responseStream: false,
    requestType: protobuf_service_pb.GetPaySlipsRequest,
    responseType: protobuf_service_pb.PaySlipCollection,
    requestSerialize: serialize_payslips_GetPaySlipsRequest,
    requestDeserialize: deserialize_payslips_GetPaySlipsRequest,
    responseSerialize: serialize_payslips_PaySlipCollection,
    responseDeserialize: deserialize_payslips_PaySlipCollection,
  },
};

exports.PaySlipsClient = grpc.makeGenericClientConstructor(PaySlipsService);
