# Untuk memuat model tensorflow dan melakukan prediksi
import tensorflow as tf

# memuat model
model = tf.keras.models.load_model('D:/2. SCHOOL/2. Kuliah S1/Bangkit Academy/fix/SafeFood-BangkitCapstone/machine_learning/models/1734006751.h5')
if model is None:
    raise Exception('Model tidak ditemukan')
else:
    print('Model berhasil dimuat')

# melakukan prediksi
def predict(inputModel):
    prediction = model.predict(inputModel)
    return prediction