const { savePredictions } = require("./mysql_utils");
const { preprocessData } = require("./data_utils");
const { loadModel }  = require('./model_utils');
const { predictWithModel } = require('./handler')
const { connection } = require("./handler"); // Koneksi MySQL
const { response } = require("express");
// const handler = require("./handler"); // Import handler.js

// Muat model AI saat server dimulai
<<<<<<<< HEAD:cloud/src/main.js
========
let model;

>>>>>>>> 62715fad9ed18da6008791a245cf17ebeb4c84ef:cloud/backup/main.js
const initializeModel = async () => {
  try {
    model = await loadModel();
    console.log("Model AI berhasil dimuat.");
  } catch (error) {
    console.error("Gagal memuat model AI:", error);
    process.exit(1); // Keluar jika model gagal dimuat
  }
};

// Pastikan handler.js dapat menggunakan model yang dimuat
// handler.initializeModel(model);

// Fungsi prediksi dari handler.js

const process_data = async (req, res) => {
  try {
    // Ambil data dari database
    const recipients = await connection.query("SELECT * FROM recipients");
    const makanan = await connection.query("SELECT * FROM data_makanan");

    // Preprocess data
    const [idRecipientList, encodedData] = preprocessData(recipients, makanan);

    // Prediksi menggunakan model dari handler.js
<<<<<<<< HEAD:cloud/src/main.js
    const predictions = predictWithModel(encodedData);
========
    const predictions = await handler.getPredictionsFromModel(encodedData);
>>>>>>>> 62715fad9ed18da6008791a245cf17ebeb4c84ef:cloud/backup/main.js

    // Gabungkan hasil prediksi
    const combinedResults = idRecipientList.map((id, index) => ({
      id_penerima: id,
      matching_score: predictions[index],
    }));
    const sortedResults = combinedResults.sort(
      (a, b) => b.matching_score - a.matching_score
    );
    console.log(sortedResults);
    // Simpan hasil ke database
    await savePredictions(sortedResults);

    res.status(200).json({
      status: "success",
      sorted_results: sortedResults,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
<<<<<<<< HEAD:cloud/src/main.js
};

module.exports = { process_data, initializeModel };
========
});
>>>>>>>> 62715fad9ed18da6008791a245cf17ebeb4c84ef:cloud/backup/main.js