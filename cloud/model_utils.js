const tf = require("@tensorflow/tfjs-node");
const path = require("path");

let model;

// Fungsi untuk memuat model dari file lokal
const loadModel = async () => {
  try {
    model = await tf.loadLayersModel(`file://model/model.json`);
    console.log("Model loaded successfully.");
  } catch (error) {
    console.error("Failed to load model:", error);
    throw new Error("Model loading error.");
  }
};

// Fungsi untuk mendapatkan prediksi dari model
const getPredictionsFromModel = async (encodedData) => {
  try {
    if (!model) {
      await loadModel(); // Pastikan model dimuat sebelum digunakan
    }

    const inputTensor = tf.tensor(encodedData); // Buat tensor dari data yang di-encode
    const predictions = model.predict(inputTensor);
    const predictionArray = await predictions.array(); // Konversi hasil prediksi menjadi array
    return predictionArray;
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Model prediction error.");
  }
};

module.exports = { getPredictionsFromModel };
