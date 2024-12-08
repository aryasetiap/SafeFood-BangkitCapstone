import firebase_admin
from firebase_admin import credentials, firestore

# Inisialisasi Firebase
cred = credentials.Certificate("machine_learning/API/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Ambil referensi ke Firestore
db = firestore.client()

# Data penerima
data_penerima = [
    {
        "id_penerima": "penerima_1",
        "jumlah_dibutuhkan": 10,
        "frekuensi_menerima": 2,
        "is_halal_receiver": True,
        "lokasi_lat_penerima": -6.175,
        "lokasi_lon_penerima": 106.828
    },
    {
        "id_penerima": "penerima_2",
        "jumlah_dibutuhkan": 5,
        "frekuensi_menerima": 1,
        "is_halal_receiver": False,
        "lokasi_lat_penerima": -6.180,
        "lokasi_lon_penerima": 106.835
    }
]

# Data makanan
data_makanan = [
    {
        "jumlah_disumbangkan": 5,
        "is_halal_makanan": True,
        "makanan_disumbangkan": "makanan",
        "kondisi_makanan": "layak_konsumsi",
        "lokasi_lat_makanan": -6.180,
        "lokasi_lon_makanan": 106.835
    },
    {
        "jumlah_disumbangkan": 3,
        "is_halal_makanan": False,
        "makanan_disumbangkan": "minuman",
        "kondisi_makanan": "hampir_kadaluarsa",
        "lokasi_lat_makanan": -6.190,
        "lokasi_lon_makanan": 106.840
    }
]

# Menambahkan data ke Firebase Firestore
for penerima in data_penerima:
    db.collection("DataPenerima").add(penerima)

for makanan in data_makanan:
    db.collection("DataMakanan").add(makanan)

print("Data berhasil ditambahkan!")
