from firebase_admin import firestore

db = firestore.client()

def save_predictions(sorted_results):
    """Simpan hasil prediksi ke koleksi Firestore."""
    predictions_ref = db.collection('HasilPrediksi')
    for result in sorted_results:
        predictions_ref.add(result)
