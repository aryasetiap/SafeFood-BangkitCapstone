from fastapi import FastAPI
from app.firebase_utils import save_predictions
from app.model_utils import get_predictions_from_model
from app.data_utils import preprocess_data
from firebase_admin import firestore

db = firestore.client()
app = FastAPI()

@app.get("/process-data")
async def process_data():
    try:
        # Ambil data dari Firebase
        penerima_ref = db.collection('DataPenerima')
        penerima_docs = penerima_ref.stream()
        data_penerima = [doc.to_dict() for doc in penerima_docs]

        makanan_ref = db.collection('DataMakanan')
        makanan_docs = makanan_ref.stream()
        data_makanan = [doc.to_dict() for doc in makanan_docs]

        # Preprocess data
        id_penerima_list, encoded_data = preprocess_data(data_penerima, data_makanan)

        # Prediksi menggunakan model
        predictions = get_predictions_from_model(encoded_data)

        # Gabungkan hasil prediksi
        combined_results = [
            {"id_penerima": id_penerima_list[i], "matching_score": predictions[i]}
            for i in range(len(predictions))
        ]
        sorted_results = sorted(combined_results, key=lambda x: x["matching_score"], reverse=True)

        # Simpan hasil ke Firebase
        save_predictions(sorted_results)

        return {"status": "success", "sorted_results": sorted_results}
    except Exception as e:
        return {"status": "error", "message": str(e)}
