const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "34.101.229.68",
  user: "root",
  database: "safefood",
  password: "bob123",
});

const newRecipientIdHandler = async () => {
  const query =
    "SELECT id_penerima FROM recipients ORDER BY id_penerima DESC LIMIT 1;";
  const rows = await connection.query(query);
  let nextIdNumber = 1;
  if (rows.length > 0) {
    const lastId = rows[0].id_penerima;
    const lastNumber = parseInt(lastId.substring(1));
    nextIdNumber = lastNumber + 1;
  }
  return `T${nextIdNumber}`;
};

const newDonorIdHandler = async () => {
  const query =
    "SELECT id_penyumbang FROM donors ORDER BY id_donor DESC LIMIT 1;";
  const rows = await connection.query(query);
  let nextIdNumber = 1;
  if (rows.length > 0) {
    const lastId = rows[0].id_penyumbang;
    const lastNumber = parseInt(lastId.substring(1));
    nextIdNumber = lastNumber + 1;
  }
  return `D${nextIdNumber}`;
};

const registerRecipientHandler = async (request, h) => {
  try {
    const {
      nama_penerima,
      lokasi_lat_penerima,
      lokasi_lon_penerima,
      makanan_dibutuhkan,
      jumlah_dibutuhkan,
      kondisi_makanan_diterima,
      is_halal_receiver,
      is_for_child_receiver,
      is_for_elderly_receiver,
      is_alergan_free,
      status_penerima,
      frekuensi_penerima,
      alamat_penerima,
      kontak_penerima,
      email_penerima,
      tentang_penerima,
      foto_profil_penerima,
      username_penerima,
      password_penerima,
    } = request.payload;

    const id_penerima = await newRecipientIdHandler();
    const role = "recipient";

    if (
      !nama_penerima ||
      typeof lokasi_lat_penerima !== "number" ||
      typeof lokasi_lon_penerima !== "number" ||
      !makanan_dibutuhkan ||
      !jumlah_dibutuhkan ||
      !kondisi_makanan_diterima ||
      !alamat_penerima ||
      !kontak_penerima ||
      !email_penerima ||
      !username_penerima ||
      !password_penerima ||
      is_halal_receiver === undefined ||
      is_for_child_receiver === undefined ||
      is_for_elderly_receiver === undefined ||
      is_alergan_free === undefined ||
      !status_penerima ||
      !frekuensi_penerima
    ) {
      const response = h.response({
        status: "fail",
        message: "Recipient must filled the form",
      });
      response.code(400);
      return response;
    }

    const queryRecipient =
      "INSERT INTO recipients (id_penerima, nama_penerima, lokasi_lat_penerima, lokasi_lon_penerima, makanan_dibutuhkan, jumlah_dibutuhkan, kondisi_makanan_diterima, is_halal_receiver, is_for_child_receiver, is_for_elderly_receiver, is_alergan_free, status_penerima, frekuensi_penerima, alamat_penerima, kontak_penerima, email_penerima, tentang_penerima, foto_profil_penerima, username_penerima, password_penerima, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    await connection.query(queryRecipient, [
      id_penerima,
      nama_penerima,
      lokasi_lat_penerima,
      lokasi_lon_penerima,
      makanan_dibutuhkan,
      jumlah_dibutuhkan,
      kondisi_makanan_diterima,
      is_halal_receiver,
      is_for_child_receiver,
      is_for_elderly_receiver,
      is_alergan_free,
      status_penerima,
      frekuensi_penerima,
      alamat_penerima,
      kontak_penerima,
      email_penerima,
      tentang_penerima,
      foto_profil_penerima,
      username_penerima,
      password_penerima,
      role,
    ]);
    const response = h.response({
      status: "success",
      message: "Recipient created successfully",
      id: id_penerima,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "fail",
      message: "User failed to register",
    });
    response.code(500);
    return response;
  }
};
// end register user handler

const registerDonorHandler = async (request, h) => {
  try {
    const {
      nama_penyumbang,
      lokasi_lat_penyumbang,
      lokasi_lon_penyumbang,
      alamat_penyumbang,
      kontak_penyumbang,
      email_penyumbang,
      tentang_penyumbang,
      foto_profil_penyumbang,
      username_penyumbang,
      password_penyumbang,
    } = request.payload;

    const id_penyumbang = await newDonorIdHandler();
    const role = "donor";

    if (
      !nama_penyumbang ||
      !lokasi_lat_penyumbang ||
      !lokasi_lon_penyumbang ||
      !alamat_penyumbang ||
      !kontak_penyumbang ||
      !email_penyumbang ||
      !username_penyumbang ||
      !password_penyumbang
    ) {
      const response = h.response({
        status: "fail",
        message: "Please fill in all fields",
      });
      response.code(400);
      return response;
    }

    const queryDonor =
      "INSERT INTO users (id_penyumbang, nama_penyumbang, lokasi_lat_penyumbang, lokasi_lon_penyumbang, alamat_penyumbang, kontak_penyumbang, email_penyumbang, tentang_penyumbang, foto_profil_penyumbang, username_penyumbang, password_penyumbang, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    await connection.query(queryDonor, [
      id_penyumbang,
      nama_penyumbang,
      lokasi_lat_penyumbang,
      lokasi_lon_penyumbang,
      alamat_penyumbang,
      kontak_penyumbang,
      email_penyumbang,
      tentang_penyumbang,
      foto_profil_penyumbang,
      username_penyumbang,
      password_penyumbang,
      role,
    ]);
    const response = h.response({
      status: "success",
      message: "Donor added successfully",
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Server error",
    });
    response.code(500);
    return response;
  }
};

const getAllRecipientsHandler = async (request, h) => {
  try {
    const [rows] = connection.query("SELECT * FROM recipients;");
    const response = h.response({
      status: "success",
      data: { recipients: rows },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Failed to get all recipients",
    });
    response.code(500);
    return response;
  }
};

const getRecipientByIdHandler = async (request, h) => {
  const { id_penerima } = request.params;

  try {
    const [rows] = connection.query(
      "SELECT * FROM recipients WHERE id_penerima = ?",
      [id_penerima]
    );
    if (rows.length === 0) {
      const response = h.response({
        status: "error",
        message: "Recipient not found",
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: "success",
      data: { recipient: rows[0] },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Failed to get recipient by id",
    });
    response.code(500);
    return response;
  }
};

const updateRecipientHandler = async (request, h) => {
  const { id_penerima } = request.params;
  const {
    nama_penerima,
    lokasi_lat_penerima,
    lokasi_lon_penerima,
    makanan_dibutuhkan,
    jumlah_dibutuhkan,
    kondisi_makanan_diterima,
    is_halal_receiver,
    is_for_child_receiver,
    is_for_elderly_receiver,
    is_alergan_free,
    status_penerima,
    frekuensi_penerima,
    alamat_penerima,
    kontak_penerima,
    email_penerima,
    tentang_penerima,
    foto_profil_penerima,
    username_penerima,
    password_penerima,
  } = request.payload;

  try {
    const [result] = connection.query(
      "UPDATE recipients SET nama_penerima = ?, lokasi_lat_penerima = ?, lokasi_lon_penerima = ?, makanan_dibutuhkan = ?, jumlah_dibutuhkan = ?, kondisi_makanan_diterima = ?, is_halal_receiver = ?, is_for_child_receiver = ?, is_for_elderly_receiver = ?, is_alergan_free = ?, status_penerima = ?, frekuensi_penerima = ?, alamat_penerima = ?, kontak_penerima = ?, email_penerima = ?, tentang_penerima = ?, foto_profil_penerima = ?, username_penerima = ?, password_penerima = ? WHERE id_penerima = ?",
      [
        nama_penerima,
        lokasi_lat_penerima,
        lokasi_lon_penerima,
        makanan_dibutuhkan,
        jumlah_dibutuhkan,
        kondisi_makanan_diterima,
        is_halal_receiver,
        is_for_child_receiver,
        is_for_elderly_receiver,
        is_alergan_free,
        status_penerima,
        frekuensi_penerima,
        alamat_penerima,
        kontak_penerima,
        email_penerima,
        tentang_penerima,
        foto_profil_penerima,
        username_penerima,
        password_penerima,
        id_penerima,
      ]
    );

    if (result.affectedRows === 0) {
      const response = h.response({
        status: "fail",
        message: "Recipient not found or no changes made",
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: "success",
      message: "Recipient updated successfully",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Recipient data update failed",
    });
    return response.code(500);
  }
};

const getAllDonorsHandler = async (request, h) => {
  try {
    const [rows] = connection.query("SELECT * FROM donors");
    const response = h.response({
      status: "success",
      data: { donors: rows },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Failed to get all donors",
    });
    response.code(500);
    return response;
  }
};

const getDonorByIdHandler = async (request, h) => {
  const { id_penyumbang } = request.params;

  try {
    const [rows] = connection.query(
      "SELECT * FROM donors WHERE id_penyumbang = ?",
      [id_penyumbang]
    );
    if (rows.length === 0) {
      const response = h.response({
        status: "error",
        message: "Donor not found",
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: "success",
      data: { donor: rows[0] },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Failed to get donor by id",
    });
    response.code(500);
    return response;
  }
};

const updateDonorHandler = async (request, h) => {
  const { id_penyumbang } = request.params;
  const {
    nama_penyumbang,
    lokasi_lat_penyumbang,
    lokasi_lon_penyumbang,
    alamat_penyumbang,
    kontak_penyumbang,
    email_penyumbang,
    tentang_penyumbang,
    foto_profil_penyumbang,
    username_penyumbang,
    password_penyumbang,
  } = request.payload;

  try {
    const [result] = connection.query(
      "UPDATE donors SET nama_penyumbang = ?, lokasi_lat_penyumbang = ?, lokasi_lon_penyumbang = ?, alamat_penyumbang = ?, kontak_penyumbang = ?, email_penyumbang = ?, tentang_penyumbang = ?, foto_profil_penyumbang = ?, username_penyumbang = ?, password_penyumbang = ? WHERE id_penyumbang = ?",
      [
        nama_penyumbang,
        lokasi_lat_penyumbang,
        lokasi_lon_penyumbang,
        alamat_penyumbang,
        kontak_penyumbang,
        email_penyumbang,
        tentang_penyumbang,
        foto_profil_penyumbang,
        username_penyumbang,
        password_penyumbang,
        id_penyumbang,
      ]
    );

    if (
      !nama_penyumbang ||
      !lokasi_lat_penyumbang ||
      !lokasi_lon_penyumbang ||
      !alamat_penyumbang ||
      !kontak_penyumbang ||
      !email_penyumbang ||
      !username_penyumbang ||
      !password_penyumbang
    ) {
      const response = h.response({
        status: "fail",
        message: "Please fill in all fields",
      });
      response.code(400);
      return response;
    }

    if (result.affectedRows === 0) {
      const response = h.response({
        status: "fail",
        message: "Donor not found or no changes made",
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: "success",
      message: "Donor data updated successfully",
    });
    return response.code(200);
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Donor data update failed",
    });
    return response.code(500);
  }
};

const deleteRecipientHandler = async (request, h) => {
  const { id_penerima } = request.params;

  try {
    const recipientData = connection.query(
      "WHERE FROM recipients WHERE id_penerima = ?",
      [id_penerima]
    );

    if (recipientData.affectedRows === 0) {
      const response = h.response({
        status: "fail",
        message: "Recipient not found",
      });
      return response.code(404);
    }

    const response = h.response({
      status: "success",
      message: "Recipient data deleted successfully",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Recipient data deletion failed",
    });
    return response.code(500);
  }
};

const deleteDonorHandler = async (request, h) => {
  const { id_penyumbang } = request.params;

  try {
    const donorData = connection.query(
      "DELETE FROM donors WHERE id_penyumbang = ?",
      [id_penyumbang]
    );
    if (donorData.affectedRows === 0) {
      const response = h.response({
        status: "fail",
        message: "Donor not found",
      });
      response.code(404);
      return response;
    }
    const response = h.response({
      status: "success",
      message: "Donor data deleted successfully",
    });
    return response.code(200);
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "error",
      message: "Donor data deletion failed",
    });
    return response.code(500);
  }
};

const loginUserHandler = (request, h) => {
  const { email, password } = request.payload;

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    const response = h.response({
      status: "fail",
      message: "Invalid email or password",
    });
    response.code(401);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Login Successful",
    data: { id: user.userId, role: user.role },
  });
  response.code(200);
  return response;
};

const createDonationsHandler = async (request, h) => {
  const {
    foodType,
    quantityFood,
    conditionFood,
    latitude,
    longitude,
    childFood,
    elderlyFood,
    allergenFood,
  } = request.payload;

  const donationId = newDonation.length + 1;

  if (role !== "donor") {
    const response = h.response({
      status: "fail",
      message: "Invalid role. Role must be donor",
    });
    response.code(403);
    return response;
  }

  if (!foodType) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon pilih jenis makanan",
    });
    response.code(400);
    return response;
  }

  if (!conditionFood) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon pilih kondisi makan",
    });
    response.code(400);
    return response;
  }

  if (!quantityFood) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon isi jumlah makanan",
    });
    response.code(400);
    return response;
  }

  if (!location) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon isi lokasi",
    });
    response.code(400);
    return response;
  }

  const newDonation = {
    donationId,
    foodType,
    quantityFood,
    location: {
      latitude: latitude,
      longitude: longitude,
    },
    conditionFood,
    childFood,
    elderlyFood,
    allergenFood,
  };

  try {
    await addDonation(newDonation);
    const response = h.response({
      status: "success",
      message: "Donasi berhasil ditambahkan",
      data: newDonation,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi",
    });
    response.code(500);
    return response;
  }
};

module.exports = {
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
};
