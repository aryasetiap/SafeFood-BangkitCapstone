const tf = require('@tensorflow/tfjs-node');

let model;

// Fungsi untuk memuat model dari file lokal
async function loadModel() {
  try {
    const model = await tf.loadLayersModel('file://cloud/src/models/model.json');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error; // Re-throw the error for handling in `process_data`
  }
}

// Fungsi untuk mendapatkan prediksi dari model
const getPredictionsFromModel = async (encodedData) => {
  try {
    if (!model) {
      loadModel(); // Pastikan model dimuat sebelum digunakan
    }

    const inputTensor = tf.tensor(encodedData); // Buat tensor dari data yang di-encode
    const predictions = model.predict(inputTensor);
    const predictionArray = predictions.array(); // Konversi hasil prediksi menjadi array
    return predictionArray;
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Model prediction error.");
  }
};

module.exports = { getPredictionsFromModel, loadModel };
