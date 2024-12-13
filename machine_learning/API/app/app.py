from fastapi import FastAPI
from app.model_utils import get_predictions_from_model
from app.data_utils import preprocess_data
import sqlalchemy

app = FastAPI()

# Konfigurasi koneksi ke database SQL
DATABASE_URL = "mysql+pymysql://root:bob123@34.101.229.68:0000/safefood"
engine = sqlalchemy.create_engine(DATABASE_URL)

@app.get("/process-data")
async def process_data():
    try:
        # Ambil data dari SQL
        with engine.connect() as connection:
            data_penerima = connection.execute("SELECT * FROM DataPenerima").fetchall()
            data_makanan = connection.execute("SELECT * FROM DataMakanan").fetchall()

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

        # Simpan hasil ke SQL
        with engine.connect() as connection:
            for result in sorted_results:
                connection.execute(
                    "INSERT INTO HasilPrediksi (id_penerima, matching_score) VALUES (:id_penerima, :matching_score)",
                    {"id_penerima": result["id_penerima"], "matching_score": result["matching_score"]}
                )

        return {"status": "success", "sorted_results": sorted_results}
    except Exception as e:
        return {"status": "error", "message": str(e)}