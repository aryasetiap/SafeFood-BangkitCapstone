from fastapi import FastAPI, HTTPException
import logging
from .handler import predict, save_results_to_database

app = FastAPI()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.post("/predict/")
async def make_prediction():
    try:
        logging.info("Memulai proses prediksi...")
        
        # Melakukan Prediksi
        result_df = predict()
        
        # Menyimpan hasil prediksi ke database
        save_results_to_database(result_df, 'predictions')
        
        logging.info("Proses prediksi selesai.")
        
    except Exception as e:
        logging.error(f"Terjadi kesalahan: {e}")

# Menjalankan aplikasi
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)