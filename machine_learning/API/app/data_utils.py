import numpy as np

def haversine(lat1, lon1, lat2, lon2):
    """Menghitung jarak antara dua titik koordinat menggunakan rumus Haversine."""
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371  # Radius bumi dalam kilometer
    return c * r

def preprocess_data(data_penerima, data_makanan):
    """Mengolah data penerima dan makanan menjadi fitur yang ter-encode."""
    processed_data = []
    id_penerima_list = []

    for penerima in data_penerima:
        id_penerima_list.append(penerima['id_penerima'])
        for makanan in data_makanan:
            feature = [
                makanan['jumlah_disumbangkan'],
                1 if makanan['is_halal_makanan'] else 0,
                1 if makanan['is_for_child_makanan'] else 0,
                1 if makanan['is_for_elderly_makanan'] else 0,
                1 if makanan['is_alergan_makanan'] else 0,
                penerima['jumlah_dibutuhkan'],
                penerima['frekuensi_menerima'],
                1 if penerima['is_halal_receiver'] else 0,
                1 if penerima['is_for_child_receiver'] else 0,
                1 if penerima['is_for_elderly_receiver'] else 0,
                1 if penerima['is_alergan_free'] else 0,
                1 if makanan['makanan_disumbangkan'] == 'makanan' else 0,
                1 if makanan['makanan_disumbangkan'] == 'makanan_minuman' else 0,
                1 if makanan['makanan_disumbangkan'] == 'minuman' else 0,
                1 if makanan['kondisi_makanan'] == 'hampir_kadaluarsa' else 0,
                1 if makanan['kondisi_makanan'] == 'layak_konsumsi' else 0,
                1 if makanan['kondisi_makanan'] == 'tidak_layak_konsumsi' else 0,
                1 if penerima['makanan_dibutuhkan'] == 'makanan' else 0,
                1 if penerima['makanan_dibutuhkan'] == 'makanan_minuman' else 0,
                1 if penerima['makanan_dibutuhkan'] == 'minuman' else 0,
                1 if penerima['kondisi_makanan_diterima'] == 'hampir_kadaluarsa' else 0,
                1 if penerima['kondisi_makanan_diterima'] == 'layak_konsumsi' else 0,
                1 if penerima['kondisi_makanan_diterima'] == 'layak_konsumsi_hampir_kadaluarsa' else 0,
                1 if penerima['kondisi_makanan_diterima'] == 'tidak_layak_konsumsi' else 0,
                1 if penerima['status_penerima'] == 'mendesak' else 0,
                1 if penerima['status_penerima'] == 'normal' else 0,
                1 if penerima['status_penerima'] == 'tidak_mendesak' else 0,
                haversine(
                    penerima['lokasi_lat_penerima'], penerima['lokasi_lon_penerima'],
                    makanan['lokasi_lat_makanan'], makanan['lokasi_lon_makanan']
                )
            ]
            processed_data.append(feature)
    return id_penerima_list, processed_data
