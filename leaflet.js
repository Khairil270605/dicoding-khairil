// leaflet.js - Perbaikan
function init() {
  // Cek apakah elemen map sudah ada di DOM
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('Element dengan id "map" tidak ditemukan!');
    return;
  }

  // Cek apakah Leaflet (L) sudah tersedia
  if (typeof L === 'undefined') {
    console.error('Leaflet library (L) tidak ditemukan. Pastikan Leaflet sudah dimuat.');
    return;
  }

  console.log('Inisialisasi peta...');
  
  const map = L.map('map').setView([-7.8011943, 110.3649177], 13);

  const light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
  });

  const satellite = L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  });

  const baseMaps = {
    "Light": light,
    "Dark": dark,
    "Satellite": satellite
  };

  L.control.layers(baseMaps).addTo(map);
  
  // Force refresh peta setelah beberapa saat
  // Ini membantu mengatasi masalah di mana peta tidak dirender dengan benar
  setTimeout(() => {
    console.log('Memanggil invalidateSize...');
    map.invalidateSize();
  }, 200);

  return map;
}

export { init };