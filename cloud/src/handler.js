const Bcrypt = require("bcrypt");
const mysql = require("mysql");
const authorizeUser = require("./authentications");
const jwt = require("jsonwebtoken");
const http = require("http");
let model;

const connection = mysql.createConnection({
  host: "localhost",
  user: "zain",
  database: "safefood",
  password: "zain",
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

const initializeModel = (loadedModel) => {
  model = loadedModel;
};

const predictWithModel = async (encodedData) => {
  if (!model) {
    throw new Error("Model belum dimuat. Pastikan server memuat model sebelum memproses prediksi.");
  }

  try {
    const tf = require("@tensorflow/tfjs-node");
    const inputTensor = tf.tensor(encodedData);
    const predictions = model.predict(inputTensor);
    return predictions.array(); // Hasil prediksi sebagai array
  } catch (error) {
    console.error("Error during prediction:", error);
    throw new Error("Gagal melakukan prediksi dengan model AI.");
  }
};

const fetchAddressFromGoogleMaps = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    const apiKey = "AIzaSyB22I3G0_XORCGf3KRbo_Sgaf6YLSrdj84";
    const url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
};

const newRecipientIdHandler = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_penerima FROM recipients ORDER BY id_penerima DESC LIMIT 1;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        const lastId = results.length ? results[0].id_penerima : "T1";
        const number = parseInt(lastId.substring(1));
        const newId = `T${number + 1}`;
        resolve(newId);
      }
    );
  });
};

const newDonorIdHandler = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_penyumbang FROM donors ORDER BY id_donor DESC LIMIT 1;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        const lastId = results.length ? results[0].id_penerima : "D1";
        const number = parseInt(lastId.substring(1));
        const newId = `D${number + 1}`;
        resolve(newId);
      }
    );
  });
};

const hashPass = async (password) => {
  const salt = 5;
  try {
    return await Bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Error Hashing Password: ", error);
    throw error;
  }
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
      password,
    } = request.payload;

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
      !password ||
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

    const id_penerima = await newRecipientIdHandler();
    const role = "recipient";
    const password_penerima = await hashPass(password);

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
      password,
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
      !password
    ) {
      const response = h.response({
        status: "fail",
        message: "Please fill in all fields",
      });
      response.code(400);
      return response;
    }

    const password_penyumbang = await hashPass(password);
    const queryDonor =
      "INSERT INTO donors (id_penyumbang, nama_penyumbang, lokasi_lat_penyumbang, lokasi_lon_penyumbang, alamat_penyumbang, kontak_penyumbang, email_penyumbang, tentang_penyumbang, foto_profil_penyumbang, username_penyumbang, password_penyumbang, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
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

const getAllRecipientsHandler = async () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM recipients", (error, results) => {
      if (error) {
        reject({
          message: "Query Failed",
          code: 500,
          error: error,
        });
      } else if (results.length === 0) {
        reject({
          message: "No Recipients found",
          code: 404,
        });
      } else {
        resolve(results);
      }
    });
  });
};

const getRecipientByIdHandler = async (request, h) => {
  const { id_penerima } = request.params;

  try {
    const [rows] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM recipients WHERE id_penerima = ?",
        [id_penerima],
        (error, results) => {
          if (error) {
            reject({
              message: "Failed to get recipient by id",
              code: 500,
              error: error,
            });
          } else if (results.length === 0) {
            reject({
              message: "Recipient not found",
              code: 404,
            });
          } else {
            resolve(results);
          }
        }
      );
    });

    return h
      .response({
        status: "success",
        data: { recipient: rows },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(error.code);
  }
};

const updateRecipientHandler = async (request, h) => {
  const { id_penerima } = request.params;
  const updatedData = request.payload;

  try {
    const currentData = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM recipients WHERE id_penerima = ?",
        [id_penerima],
        (error, results) => {
          if (error) {
            reject({
              message: "Recipient data update failed",
              code: 500,
              error: error,
            });
          } else if (results.length === 0) {
            reject({
              message: "Recipient not found",
              code: 404,
            });
          } else {
            resolve(results[0]);
          }
        }
      );
    });

    const mergedData = { ...currentData, ...updatedData };

    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE recipients SET nama_penerima = ?, lokasi_lat_penerima = ?, lokasi_lon_penerima = ?, makanan_dibutuhkan = ?, jumlah_dibutuhkan = ?, kondisi_makanan_diterima = ?, is_halal_receiver = ?, is_for_child_receiver = ?, is_for_elderly_receiver = ?, is_alergan_free = ?, status_penerima = ?, frekuensi_penerima = ?, alamat_penerima = ?, kontak_penerima = ?, email_penerima = ?, tentang_penerima = ?, foto_profil_penerima = ?, username_penerima = ?, password_penerima = ? WHERE id_penerima = ?",
        [
          mergedData.nama_penerima,
          mergedData.lokasi_lat_penerima,
          mergedData.lokasi_lon_penerima,
          mergedData.makanan_dibutuhkan,
          mergedData.jumlah_dibutuhkan,
          mergedData.kondisi_makanan_diterima,
          mergedData.is_halal_receiver,
          mergedData.is_for_child_receiver,
          mergedData.is_for_elderly_receiver,
          mergedData.is_alergan_free,
          mergedData.status_penerima,
          mergedData.frekuensi_penerima,
          mergedData.alamat_penerima,
          mergedData.kontak_penerima,
          mergedData.email_penerima,
          mergedData.tentang_penerima,
          mergedData.foto_profil_penerima,
          mergedData.username_penerima,
          mergedData.password_penerima,
          id_penerima,
        ],
        (error, results) => {
          if (error) {
            reject({
              message: "Update Failed",
              code: 500,
              error: error,
            });
          } else if (results.affectedRows === 0) {
            reject({
              message: "No changes have been made",
              code: 404,
            });
          } else {
            resolve(results);
          }
        }
      );
    });

    return h
      .response({
        status: "success",
        message: "Recipient updated successfully",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(error.code || 500);
  }
};

const getAllDonorsHandler = async () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM donors", (error, results) => {
      if (error) {
        reject({
          message: "Query Failed",
          code: 500,
          error: error,
        });
      } else if (results.length === 0) {
        reject({
          message: "No Recipients found",
          code: 404,
        });
      } else {
        resolve(results);
      }
    });
  });
};

const getDonorByIdHandler = async (request, h) => {
  const { id_penyumbang } = request.params;

  try {
    const [rows] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM donors WHERE id_penyumbang = ?",
        [id_penyumbang],
        (error, results) => {
          if (error) {
            reject({
              message: "Failed to get donor by id",
              code: 500,
              error: error,
            });
          } else if (results.length === 0) {
            reject({
              message: "Donor not found",
              code: 404,
            });
          } else {
            resolve(results);
          }
        }
      );
    });

    return h
      .response({
        status: "success",
        data: { donor: rows },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(error.code);
  }
};

const updateDonorHandler = async (request, h) => {
  const { id_penyumbang } = request.params;
  const updatedData = request.payload;

  try {
    const currentData = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM donors WHERE id_penyumbang = ?",
        [id_penyumbang],
        (error, results) => {
          if (error) {
            reject({
              message: "Donor data update failed",
              code: 500,
              error: error,
            });
          } else if (results.length === 0) {
            reject({
              message: "Donor not found",
              code: 404,
            });
          } else {
            resolve(results[0]);
          }
        }
      );
    });

    const mergedData = { ...currentData, ...mergedData };

    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE donors SET nama_penyumbang = ?, lokasi_lat_penyumbang = ?, lokasi_lon_penyumbang = ?, alamat_penyumbang = ?, kontak_penyumbang = ?, email_penyumbang = ?, tentang_penyumbang = ?, foto_profil_penyumbang = ?, username_penyumbang = ?, password_penyumbang = ? WHERE id_penyumbang = ?",
        [
          mergedData.nama_penyumbang,
          mergedData.lokasi_lat_penyumbang,
          mergedData.lokasi_lon_penyumbang,
          mergedData.alamat_penyumbang,
          mergedData.kontak_penyumbang,
          mergedData.email_penyumbang,
          mergedData.tentang_penyumbang,
          mergedData.foto_profil_penyumbang,
          mergedData.username_penyumbang,
          mergedData.password_penyumbang,
          id_penyumbang,
        ],
        (error, results) => {
          if (error) {
            reject({
              message: "Donor data update failed",
              code: 500,
              error: error,
            });
          } else if (results.affectedRows === 0) {
            reject({
              message: "No changes have been made",
              code: 404,
            });
          } else {
            resolve(results);
          }
        }
      );
    });

    return h
      .response({
        status: "success",
        message: "Recipient updated successfully",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(error.code || 500);
  }
};

const deleteRecipientHandler = async (request, h) => {
  const { id_penerima } = request.params;

  try {
    const recipientData = await new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM recipients WHERE id_penerima = ?",
        [id_penerima],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

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
    const donorData = await new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM donors WHERE id_penyumbang = ?",
        [id_penyumbang],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

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

const loginUserHandler = async (request, h) => {
  const { email, password, role } = request.payload;

  if (!email || !password || !role) {
    const response = h.response({
      status: "fail",
      message: "Email and password are required",
    });
    response.code(400);
    return response;
  }

  try {
    let userResults;

    if (role === "donor") {
      userResults = await new Promise(async (resolve, reject) => {
        (await connection).query(
          "SELECT * FROM donors WHERE email_penyumbang = ?",
          [email],
          (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(results);
          }
        );
      });
    } else if (role === "recipient") {
      userResults = await new Promise(async (resolve, reject) => {
        (await connection).query(
          "SELECT * FROM recipients WHERE email_penerima = ?",
          [email],
          (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(results);
          }
        );
      });
    } else {
      const response = h.response({
        status: "fail",
        message: "Invalid role",
      });
      response.code(400);
      return response;
    }

    if (userResults.length > 0) {
      const user = userResults[0];
      const isPasswordValid =
        role === "donor"
          ? await Bcrypt.compare(password, user.password_penyumbang)
          : await Bcrypt.compare(password, user.password_penerima);
      console.log("Is Password Valid:", isPasswordValid);

      if (isPasswordValid) {
        const token = jwt.sign({ email }, authorizeUser.secret, {
          expiresIn: "7d",
        });
        return h
          .response({
            status: "success",
            message: "Login successful",
            token,
            user: {
              id: role === "donor" ? user.id_penyumbang : user.id_penerima,
              name:
                role === "donor" ? user.nama_penyumbang : user.nama_penerima,
              role,
            },
          })
          .code(200);
      }
    }

    const response = h.response({
      status: "fail",
      message: "Incorrect Email or Password",
    });
    response.code(401);
    return response;
  } catch (error) {
    console.error("Error in login Handler:", error);
    const response = h.response({
      status: "error",
      message: "Server error",
    });
    response.code(500);
    return response;
  }
};

const createDonationsHandler = async (request, h) => {
  const {
    id_donasi, // e.g., M1, M2, etc. PK for database
    id_penyumbang, // This should be obtained from the authenticated donor FK from tables donors
    id_penerima, // This should be provided in the request or obtained from context FK from tables recipients
    makanan_disumbangkan,
    jumlah_disumbangkan,
    kondisi_makanan,
    status_donasi,
    is_halal_makanan,
    is_for_child_makanan,
    is_for_elderly_makanan,
    is_alergan_makanan,
    jarak,
    waktu_donasi,
    tanggal_kadaluarsa,
    lokasi_lat_makanan,
    lokasi_lon_makanan,
    alamat_penerima,
    deskripsi_makanan,
    foto_makanan,
    penilaian_penerima, // This will be filled by the recipient later
    ulasan, // This will be filled by the recipient later
  } = request.payload;

  if (role !== "donor") {
    const response = h.response({
      status: "fail",
      message: "Invalid role. Role must be donor",
    });
    response.code(403);
    return response;
  }

  if (!makanan_disumbangkan) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon pilih jenis makanan",
    });
    response.code(400);
    return response;
  }

  if (!kondisi_makanan) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon pilih kondisi makan",
    });
    response.code(400);
    return response;
  }

  if (!jumlah_disumbangkan) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon isi jumlah makanan",
    });
    response.code(400);
    return response;
  }

  if (!lokasi_lat_makanan || !lokasi_lon_makanan) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan Donasi. Mohon isi lokasi",
    });
    response.code(400);
    return response;
  }

  const newDonation = {
    id_donasi,
    id_penyumbang,
    id_penerima,
    makanan_disumbangkan,
    jumlah_disumbangkan,
    kondisi_makanan,
    status_donasi,
    is_halal_makanan,
    is_for_child_makanan,
    is_for_elderly_makanan,
    is_alergan_makanan,
    jarak,
    waktu_donasi,
    tanggal_kadaluarsa,
    lokasi_lat_makanan,
    lokasi_lon_makanan,
    alamat_penerima,
    deskripsi_makanan,
    foto_makanan,
    penilaian_penerima, // Initially can be null or a default value
    ulasan, // Initially can be empty or null
  };

  try {
    await saveDonationToDatabase(newDonation);
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

const getAllDonationsHandler = async (request, h) => {
  try {
    const donations = await fetchAllDonationsFromDatabase();
    const response = h.response({
      status: "success",
      data: donations,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "fail",
      message: "Failed to fetch donations",
    });
    response.code(500);
    return response;
  }
};

const getDonationByIdHandler = async (request, h) => {
  const { id_donasi } = request.params;

  try {
    const donation = await fetchDonationByIdFromDatabase(id_donasi);
    if (!donation) {
      const response = h.response({
        status: "fail",
        message: "Donation not found",
      });
      response.code(404);
      return response;
    }
    const response = h.response({
      status: "success",
      message: "donation is found",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "fail",
      message: "Failed to get Donation",
    });
    response.code(500);
    return response;
  }
};

const updateDonationsHandler = async (request, h) => {
  const { id_donasi } = request.params;
  const updates = request.payload;

  try {
    const updatedDonation = await updateDonationInDatabase(id_donasi, updates);
    if (!updatedDonation) {
      const response = h.response({
        status: "fail",
        message: "Donation not found",
      });
      response.code(404);
      return response;
    }
    const response = h.response({
      status: "success",
      message: "Donation Updated",
      data: updatedDonation,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "fail",
      message: "Failed to update donation",
    });
    response.code(500);
    return response;
  }
};

const deleteDonationsHandler = async (request, h) => {
  const { id_donasi } = request.params;

  try {
    const result = await deleteDonationFromDatabase(id_donasi);
    if (!result) {
      const response = h.response({
        status: "fail",
        message: "Donation not found",
      });
      response.code(404);
      return response;
    }
    const response = h.response({
      status: "success",
      message: "Donation deleted",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: "fail",
      message: "Failed to delete donation",
    });
    response.code(500);
    return response;
  }
};

const saveDonationToDatabase = async (donation) => {
  const query = `
    INSERT INTO donations (
      id_donasi, id_penyumbang, id_penerima, makanan_disumbangkan, jumlah_disumbangkan,
      kondisi_makanan, status_donasi, is_halal_makanan, is_for_child_makanan,
      is_for_elderly_makanan, is_alergan_makanan, jarak, waktu_donasi,
      tanggal_kadaluarsa, lokasi_lat_makanan, lokasi_lon_makanan,
      alamat_penerima, deskripsi_makanan, foto_makanan, penilaian_penerima, ulasan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  await connection.query(query, [
    donation.id_donasi,
    donation.id_penyumbang,
    donation.id_penerima,
    donation.makanan_disumbangkan,
    donation.jumlah_disumbangkan,
    donation.kondisi_makanan,
    donation.status_donasi,
    donation.is_halal_makanan,
    donation.is_for_child_makanan,
    donation.is_for_elderly_makanan,
    donation.is_alergan_makanan,
    donation.jarak,
    donation.waktu_donasi,
    donation.tanggal_kadaluarsa,
    donation.lokasi_lat_makanan,
    donation.lokasi_lon_makanan,
    donation.alamat_penerima,
    donation.deskripsi_makanan,
    donation.foto_makanan,
    donation.penilaian_penerima,
    donation.ulasan,
  ]);
};

const fetchAllDonationsFromDatabase = async () => {
  const query = "SELECT * FROM donations;";
  const [rows] = await connection.query(query);
  return rows;
};

const fetchDonationByIdFromDatabase = async () => {
  const query = "SELECT * FROM donations WHERE id_donasi = ?;";
  const [rows] = await connection.query(query, [id_donasi]);
  return rows[0];
};

const updateDonationInDatabase = async (id_donasi, updates) => {
  const query = "UPDATE donations SET ? WHERE id_donasi = ?;";
  const [result] = await connection.query(query, [updates, id_donasi]);
  return result.affectedRows > 0;
};

const deleteDonationFromDatabase = async (id_donasi) => {
  const query = "DELETE FROM donations WHERE id_donasi = ?;";
  const [result] = await connection.query(query, [id_donasi]);
  return result.affectedRows > 0;
};

module.exports = {
  connection,
  initializeModel,
  predictWithModel,
  fetchAddressFromGoogleMaps,
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
  getAllDonationsHandler,
  getDonationByIdHandler,
  updateDonationsHandler,
  deleteDonationsHandler,
};
