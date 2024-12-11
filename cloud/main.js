const { savePredictions } = require("./mysql_utils");
const { preprocessData } = require("./data_utils");
const { loadModel, getPredictionsFromModel } = require("./model_utils");
const { connection } = require("./handler"); // Koneksi MySQL
const handler = require("./handler"); // Import handler.js

// Muat model AI saat server dimulai
let model;
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
handler.initializeModel(model);

// Fungsi prediksi dari handler.js
app.post("/process-data", async (req, res) => {
  try {
    // Ambil data dari database
    const [recipients] = await connection.query("SELECT * FROM recipients");
    const [makanan] = await connection.query("SELECT * FROM data_makanan");

    // Preprocess data
    const [idRecipientList, encodedData] = preprocessData(recipients, makanan);

    // Prediksi menggunakan model dari handler.js
    const predictions = await handler.predictWithModel(encodedData);

    // Gabungkan hasil prediksi
    const combinedResults = idRecipientList.map((id, index) => ({
      id_penerima: id,
      matching_score: predictions[index],
    }));
    const sortedResults = combinedResults.sort(
      (a, b) => b.matching_score - a.matching_score
    );

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
});

