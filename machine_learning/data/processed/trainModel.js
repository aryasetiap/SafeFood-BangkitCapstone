const fs = require("fs");
const csv = require("csv-parser");
const tf = require("@tensorflow/tfjs-node");

// Fungsi untuk membaca dataset CSV
async function loadCSV(filePath, dropColumns) {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Menghapus kolom yang tidak diperlukan
        const filteredRow = Object.keys(row)
          .filter((key) => !dropColumns.includes(key))
          .map((key) => parseFloat(row[key])); // Convert values to numbers
        data.push(filteredRow);
      })
      .on("end", () => {
        resolve(tf.tensor2d(data)); // Mengembalikan tensor2d untuk data fitur
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Fungsi untuk membaca label dari dataset CSV
async function loadLabels(filePath, labelColumn) {
  const labels = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Menyimpan kolom label (misalnya, 'matching_score')
        labels.push([parseFloat(row[labelColumn])]); // Convert value to number
      })
      .on("end", () => {
        resolve(tf.tensor2d(labels)); // Mengembalikan tensor2d untuk label
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Fungsi untuk membuat dan melatih model
async function createAndTrainModel(x_train, y_train, x_val, y_val) {
  const model = tf.sequential();

  // Input layer
  model.add(
    tf.layers.dense({
      units: 96,
      inputShape: [x_train.shape[1]], // Sesuaikan dengan jumlah fitur
      activation: "relu",
    })
  );

  // Dropout layer
  model.add(tf.layers.dropout({ rate: 0.2 }));

  // Output layer
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "linear",
    })
  );

  // Compile model
  model.compile({
    optimizer: tf.train.adam(0.0009686835179818646),
    loss: "meanSquaredError",
    metrics: ["mae"],
  });

  console.log("Model berhasil dibuat dan dikompilasi");

  // Melatih model
  const history = await model.fit(x_train, y_train, {
    validationData: [x_val, y_val],
    epochs: 50,
    batchSize: 32,
    callbacks: [
      tf.callbacks.earlyStopping({
        patience: 5, // Menghapus restoreBestWeights
      }),
    ],
    verbose: 1,
  });

  console.log("Model berhasil dilatih");

  return model;
}

// Fungsi untuk menyimpan model
async function saveModel(model) {
  const modelPath = "file://./model/model.json";
  await model.save(modelPath);
  console.log("Model berhasil disimpan di", modelPath);
}

// Fungsi utama untuk menjalankan pelatihan dan penyimpanan model
async function main() {
  // Membaca dan memproses dataset CSV
  const dropColumns = ["id_penyumbang", "id_penerima", "matching_score"];
  const x_train = await loadCSV("training_set.csv", dropColumns);
  const y_train = await loadLabels("training_set.csv", "matching_score");

  const x_val = await loadCSV("validation_set.csv", dropColumns);
  const y_val = await loadLabels("validation_set.csv", "matching_score");

  const x_test = await loadCSV("test_set.csv", dropColumns);
  const y_test = await loadLabels("test_set.csv", "matching_score");

  // Membuat dan melatih model
  const model = await createAndTrainModel(x_train, y_train, x_val, y_val);

  // Simpan model setelah dilatih
  await saveModel(model);

  // Mengukur kinerja model pada data test
  const result = model.evaluate(x_test, y_test);
  console.log(
    "Test Loss:",
    result[0].dataSync(),
    "Test MAE:",
    result[1].dataSync()
  );
}

main().catch(console.error);
