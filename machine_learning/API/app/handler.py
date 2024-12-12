import logging
import os

import mysql.connector
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import metrics

from app.db.database import get_connection

# Menghitung jarak antara dua titik koordinat
def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371
    return float(c * r)

# Fungsi untuk mengeksekusi query
def execute_query(query, params=None):
    connection = get_connection()
    if connection is None:
        return {"error": "Unable to connect to the database."}
    cursor = connection.cursor()
    try:
        cursor.execute(query, params)
        results = cursor.fetchall()  # Mengambil semua hasil query
        connection.commit()
        return results  # Mengembalikan hasil query
    except mysql.connector.Error as err:
        logging.error(f"Query execution failed: {err}")
        return {"error": f"Query execution failed: {err}"}
    finally:
        cursor.close()
        connection.close()

# Fungsi untuk memuat model
def load_model():
    model_path='app/model_safefood_best.h5'
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model tidak ditemukan di path: {model_path}")
    try:
        model = tf.keras.models.load_model(model_path, custom_objects={'mse': metrics.MeanSquaredError()})
        print("Model berhasil dimuat.")
        return model
    except Exception as e:
        raise Exception(f"Gagal memuat model: {str(e)}")
    
# Fungsi untuk mengambil data dari tabel
def fetch_data_from_table(table_name, last_row=False):
    if last_row:
        query = f"SELECT * FROM {table_name} ORDER BY waktu_donasi DESC LIMIT 1"
    else:
        query = f"SELECT * FROM {table_name}"
    results = execute_query(query)
    if isinstance(results, dict) and "error" in results:
        print(results["error"])
        return []  # Kembalikan list kosong jika ada error
    return results  # Kembalikan hasil query

# Fungsi untuk memproses data
def preprocess_data():
    list_recipients = fetch_data_from_table('recipients')
    food_donation = fetch_data_from_table('donations', True)
    
    input_for_model = []
    id_penerima_list = []
    distance_list = []
        
    for recipient in list_recipients:
        id_penerima_list.append(recipient[0])
        distance = haversine(food_donation[0][13], food_donation[0][14], recipient[2], recipient[3])
        data_row = [
            food_donation[0][4],
            1 if food_donation[0][6] else 0,
            1 if food_donation[0][7] else 0,
            1 if food_donation[0][8] else 0,
            1 if food_donation[0][9] else 0,
            recipient[5],
            recipient[12],
            1 if recipient[7] else 0,
            1 if recipient[8] else 0,
            1 if recipient[9] else 0,
            1 if recipient[10] else 0,
            1 if food_donation[0][3] == "makanan" else 0,
            1 if food_donation[0][3] == "makanan_minuman" else 0,
            1 if food_donation[0][3] == "minuman" else 0,
            1 if food_donation[0][5] == "hampir_kadaluarsa" else 0,
            1 if food_donation[0][5] == "layak_konsumsi" else 0,
            1 if food_donation[0][5] == "tidak_layak_konsumsi" else 0,
            1 if recipient[4] == "makanan" else 0,
            1 if recipient[4] == "makanan_minuman" else 0,
            1 if recipient[4] == "minuman" else 0,
            1 if recipient[6] == "hampir_kadaluarsa" else 0,
            1 if recipient[6] == "layak_konsumsi" else 0,
            1 if recipient[6] == "layak_konsumsi_hampir_kadaluarsa" else 0,
            1 if recipient[6] == "tidak_layak_konsumsi" else 0,
            1 if recipient[11] == "mendesak" else 0,
            1 if recipient[11] == "normal" else 0,
            1 if recipient[11] == "tidak_mendesak" else 0,
            distance,
        ]
        input_for_model.append(data_row)
        distance_list.append(distance)
    
    input_for_model = np.array(input_for_model)

    return id_penerima_list, distance_list, input_for_model

# Fungsi untuk melakukan prediksi
def predict():
    model = load_model()
    id_penerima_list, distance_list, input_for_model = preprocess_data()
    
    predictions = model.predict(input_for_model)
    
    result_df = pd.DataFrame({
        'id_penerima': id_penerima_list,
        'distance': distance_list,
        'predicted_matching_score': predictions.flatten()
    })
    result_df = result_df.sort_values(by='predicted_matching_score', ascending=False)
    
    print(result_df)
    return result_df

def save_results_to_database(results_df, table_name):
    connection = get_connection()
    if connection is None:
        return {"error": "Unable to connect to the database."}
    
    cursor = connection.cursor()
    try:
        for index, row in results_df.iterrows():
            query = f"""
            INSERT INTO {table_name} (id_penerima, jarak, matching_score)
            VALUES (%s, %s, %s)
            """
            cursor.execute(query, (row['id_penerima'], row['distance'], row['predicted_matching_score']))
        connection.commit()  # Commit changes
        print("Results successfully saved to the database.")
    except mysql.connector.Error as err:
        logging.error(f"Failed to insert data: {err}")
    finally:
        cursor.close()
        connection.close()