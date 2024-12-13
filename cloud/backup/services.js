// const tf = require("@tensorflow/tfjs-node");
// const fs = require("fs").promises;

// class PredictService {
//   async predictScore(filePath) {
//     const modelPath = "file://model/model.json";
//     const model = await tf.loadLayersModel(modelPath);

//     const jsonData = await fs.readFile(filePath, "utf8");
//     const inputData = JSON.parse(jsonData);

//     const tensor = tf
//       .tensor(inputData)
//       .resizeNearestNeighbor([224, 224])
//       .expandDims()
//       .toFloat();

//     const predict = await model.predict(tensor);
//     const score = await predict.data();

//     return score;
//   }
// }

// modeule.exports = PredictService;
