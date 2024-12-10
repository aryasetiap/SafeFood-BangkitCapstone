const {
  registerRecipientHandler,
  registerDonorHandler,
  loginUserHandler,
  getAllRecipientsHandler,
  getAllDonorsHandler,
  getRecipientByIdHandler,
  getDonorByIdHandler,
  updateRecipientHandler,
  updateDonorHandler,
  deleteRecipientHandler,
  deleteDonorHandler,
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
    path: "/recipients/{id_penerima}",
    handler: getRecipientByIdHandler,
  },
  {
    method: "GET",
    path: "/donors/{id_penyumbang}",
    handler: getDonorByIdHandler,
  },
  {
    method: "PUT",
    path: "/recipients/{id_penerima}",
    handler: updateRecipientHandler,
  },
  {
    method: "PUT",
    path: "/donors/{id_penyumbang}",
    handler: updateDonorHandler,
  },
  {
    method: "DELETE",
    path: "/recipients/{id_penerima}",
    handler: deleteRecipientHandler,
  },
  {
    method: "DELETE",
    path: "/donors/{id_penerima}",
    handler: deleteDonorHandler,
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
