const { connection } = require("./handler"); // Mengimpor koneksi dari handler.jsO


// Fungsi untuk menyimpan hasil prediksi ke database MySQL
const savePredictions = async (sortedResults) => {
  try {
    const query = "INSERT INTO predictions (id_penerima, matching_score) VALUES ?";
    const values = sortedResults.map(result => [result.id_penerima, result.matching_score]);

    connection.execute(query, [values]);
    console.log("Predictions saved to database.");
  } catch (error) {
    console.error("Failed to save predictions:", error);
    throw new Error("Database error while saving predictions.");
  }
};

module.exports = { savePredictions };
