const haversine = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
};

const preprocessData = (dataPenerima, dataMakanan) => {
  const processedData = [];
  const idPenerimaList = [];

  dataPenerima.forEach((penerima) => {
    idPenerimaList.push(penerima.id_penerima);
    dataMakanan.forEach((makanan) => {
      const feature = [
        makanan.jumlah_disumbangkan,
        makanan.is_halal_makanan ? 1 : 0,
        makanan.is_for_child_makanan ? 1 : 0,
        makanan.is_for_elderly_makanan ? 1 : 0,
        makanan.is_alergan_makanan ? 1 : 0,
        penerima.jumlah_dibutuhkan,
        penerima.frekuensi_penerima,
        penerima.is_halal_receiver ? 1 : 0,
        penerima.is_for_child_receiver ? 1 : 0,
        penerima.is_for_elderly_receiver ? 1 : 0,
        penerima.is_alergan_free ? 1 : 0,
        makanan.makanan_disumbangkan === "makanan" ? 1 : 0,
        makanan.makanan_disumbangkan === "makanan_minuman" ? 1 : 0,
        makanan.makanan_disumbangkan === "minuman" ? 1 : 0,
        makanan.kondisi_makanan === "hampir_kadaluarsa" ? 1 : 0,
        makanan.kondisi_makanan === "layak_konsumsi" ? 1 : 0,
        makanan.kondisi_makanan === "tidak_layak_konsumsi" ? 1 : 0,
        penerima.makanan_dibutuhkan === "makanan" ? 1 : 0,
        penerima.makanan_dibutuhkan === "makanan_minuman" ? 1 : 0,
        penerima.makanan_dibutuhkan === "minuman" ? 1 : 0,
        penerima.kondisi_makanan_diterima === "hampir_kadaluarsa" ? 1 : 0,
        penerima.kondisi_makanan_diterima === "layak_konsumsi" ? 1 : 0,
        penerima.kondisi_makanan_diterima === "tidak_layak_konsumsi" ? 1 : 0,
        penerima.status_penerima === "mendesak" ? 1 : 0,
        penerima.status_penerima === "normal" ? 1 : 0,
        penerima.status_penerima === "tidak_mendesak" ? 1 : 0,
        haversine(
          penerima.lokasi_lat_penerima,
          penerima.lokasi_lon_penerima,
          makanan.lokasi_lat_makanan,
          makanan.lokasi_lon_makanan
        ),
      ];
      processedData.push(feature);
    });
  });

  return [idPenerimaList, processedData];
};

module.exports = { preprocessData };
