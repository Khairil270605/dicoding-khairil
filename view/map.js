// views/map.js - Perbaikan
import createMapTemplate from './createMapTemplate.js';
import { init } from '../leaflet.js';

export function renderMap(container) {
  // Render template peta
  console.log('Rendering template peta...');
  container.innerHTML = createMapTemplate();
  
  // Inisialisasi peta setelah DOM selesai dirender
  // Menggunakan setTimeout untuk memastikan elemen sudah benar-benar dirender
  console.log('Menunggu DOM selesai dirender...');
  setTimeout(() => {
    console.log('Menginisialisasi peta...');
    const map = init();
    
    // Tambahkan event listener untuk resize window
    window.addEventListener('resize', () => {
      if (map) {
        map.invalidateSize();
      }
    });
    
  }, 300); // Tunggu 300ms untuk memastikan DOM siap
}