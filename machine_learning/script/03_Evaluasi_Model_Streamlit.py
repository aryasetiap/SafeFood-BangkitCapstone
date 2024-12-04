import streamlit as st
import pandas as pd
import tensorflow as tf
import numpy as np

model = tf.keras.models.load_model('machine_learning/models/fix/model_safefood_best.keras')

def predict_matching_score(input_data):
    input_data = np.array(input_data)
    prediction = model.predict(input_data)
    return prediction

def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371
    return c * r

data_penerima = pd.read_csv('machine_learning/data/raw/data_penerima.csv')

st.title('Evaluasi Pencocokan Makanan Donasi')

st.header('Masukkan Makanan yang Disumbangkan')

id_penyumbang = st.text_input('ID Penyumbang')
makanan_disumbangkan = st.selectbox('Jenis Makanan Disumbangkan?', ['Makanan', 'Minuman', 'Makanan dan Minuman'])
jumlah_disumbangkan = st.number_input('Jumlah Makanan yang Disumbangkan', step=1)
lokasi_lat_penyumbang = st.number_input('Latitude Lokasi Penyumbang', format="%.16f", step=0.0000000000000001)
lokasi_lon_penyumbang = st.number_input('Longitude Lokasi Penyumbang', format="%.14f", step=0.00000000000001)
kondisi_makanan = st.selectbox('Kondisi Makanan yang Disumbangkan?', ['Layak Konsumsi', 'Hampir Kadaluarsa', 'Tidak Layak Konsumsi'])
is_halal_donor = st.selectbox('Makanan Halal?', ['Ya', 'Tidak'])
is_for_child_donor = st.selectbox('Untuk Anak?', ['Ya', 'Tidak']) 
is_for_elderly_donor = st.selectbox('Untuk Lansia?', ['Ya', 'Tidak'])
is_alergan = st.selectbox('Mengandung Alergen?', ['Ya', 'Tidak'])

if st.button('Prediksi Matching Score'):
    input_for_model = []
    id_penerima_list = []

    for _, row in data_penerima.iterrows():
        id_penerima_list.append(row['id_penerima'])
        data_row = [
            jumlah_disumbangkan,
            0 if is_halal_donor == 'Tidak' else 1,
            0 if is_for_child_donor == 'Tidak' else 1,
            0 if is_for_elderly_donor == 'Tidak' else 1,
            0 if is_alergan == 'Tidak' else 1,
            row['jumlah_dibutuhkan'],
            row['frekuensi_menerima'],
            1 if row['is_halal_receiver'] else 0,
            1 if row['is_for_child_receiver'] else 0,
            1 if row['is_for_elderly_receiver'] else 0,
            1 if row['is_alergan_free'] else 0,
            1 if makanan_disumbangkan == 'Makanan' else 0,
            1 if makanan_disumbangkan == 'Makanan dan Minuman' else 0,
            1 if makanan_disumbangkan == 'Minuman' else 0,
            1 if kondisi_makanan == 'Hampir Kadaluarsa' else 0,
            1 if kondisi_makanan == 'Layak Konsumsi' else 0,
            1 if kondisi_makanan == 'Tidak Layak Konsumsi' else 0,
            1 if row['makanan_dibutuhkan'] == 'makanan' else 0,
            1 if row['makanan_dibutuhkan'] == 'makanan_minuman' else 0,
            1 if row['makanan_dibutuhkan'] == 'minuman' else 0,
            1 if row['kondisi_makanan_diterima'] == 'hampir_kadaluarsa' else 0,
            1 if row['kondisi_makanan_diterima'] == 'layak_konsumsi' else 0,
            1 if row['kondisi_makanan_diterima'] == 'layak_konsumsi_hampir_kadaluarsa' else 0,
            1 if row['kondisi_makanan_diterima'] == 'tidak_layak konsumsi' else 0,
            1 if row['status_penerima'] == 'mendesak' else 0,
            1 if row['status_penerima'] == 'normal' else 0,
            1 if row['status_penerima'] == 'tidak mendesak' else 0,
            haversine(lokasi_lat_penyumbang, lokasi_lon_penyumbang, row['lokasi_lat_penerima'], row['lokasi_lon_penerima']),
        ]
        input_for_model.append(data_row)

    predictions = predict_matching_score(input_for_model)

    result_df = pd.DataFrame({
        'id_penerima': id_penerima_list,
        'predicted_matching_score': predictions.flatten()
    })

    result_df = result_df.sort_values(by='predicted_matching_score', ascending=False)

    st.write("Hasil Prediksi:")
    st.write(result_df)
