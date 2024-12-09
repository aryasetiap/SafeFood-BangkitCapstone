const {
  registerRecipientHandler,
  registerDonorHandler,
  loginUserHandler,
  getAllRecipientsHandler,
  getAllDonorsHandler,
  getDonorByIdHandler,
  getRecipientByIdHandler,
  createDonationsHandler,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/recipients",
    handler: registerRecipientHandler,
  },
  {
    method: "POST",
    path: "/donors",
    handler: registerDonorHandler,
  },
  {
    method: "GET",
    path: "/recipients",
    handler: getAllRecipientsHandler,
  },
  {
    method: "GET",
    path: "/donors",
    handler: getAllDonorsHandler,
  },
  {
    method: "GET",
    path: "/recipients/{recipientId}",
    handler: getRecipientByIdHandler,
  },
  {
    method: "GET",
    path: "/donors/{donorId}",
    handler: getDonorByIdHandler,
  },
  {
    method: "POST",
    path: "/login",
    handler: loginUserHandler,
  },
  {
    method: "POST",
    path: "/donations",
    handler: createDonationsHandler,
  },
];

module.exports = routes;
