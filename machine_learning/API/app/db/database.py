import mysql.connector
import logging
from mysql.connector import pooling

# Konfigurasi koneksi MySQL
db_config = {
    'host': '34.128.98.202',
    'user': 'root',
    'password': 'safefood123',
    'database': 'safefood',
    'raise_on_warnings': True
}

# Membuat koneksi pool (menyediakan multiple koneksi ke database)
connection_pool = pooling.MySQLConnectionPool(
    pool_name="safefood_pool",
    pool_size=5,
    **db_config
)

# Mendapatkan koneksi dari pool
def get_connection():
    try:
        connection = connection_pool.get_connection()
        if connection.is_connected():
            return connection
    except mysql.connector.Error as err:
        logging.error(f"Error getting connection: {err}")
        return None

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

# Fungsi untuk mengambil data dari tabel
def fetch_data_from_table(table_name, last_row=False):
    if last_row:
        query = f"SELECT * FROM {table_name} ORDER BY id_donasi DESC LIMIT 1"  # Ganti 'created_at' dengan kolom yang sesuai
    else:
        query = f"SELECT * FROM {table_name}"
    
    results = execute_query(query)
    if isinstance(results, dict) and "error" in results:
        print(results["error"])
    else:
        print(results)
