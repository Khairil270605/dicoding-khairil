import L from 'leaflet';

const MapPresenter = {
  init() {
    this._renderMap();
  },

  _renderMap() {
    const map = L.map('map').setView([-7.8011943, 110.3649177], 13);

    const light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
    });

    const satellite = L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    const baseMaps = {
      "Light": light,
      "Dark": dark,
      "Satellite": satellite
    };

    L.control.layers(baseMaps).addTo(map);
  },
};

export default MapPresenter;
