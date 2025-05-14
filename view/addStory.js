// views/addStory.js
import { addStoryPresenter } from '../presenter/addStoryPresenter.js';

export function renderAddStory(container) {
  container.innerHTML = `
    <section class="add-story-section">
      <h2>Tambah Cerita</h2>
      <form id="addStoryForm">
        <label for="description">Deskripsi</label>
        <textarea id="description" required></textarea>

        <div class="input-option-tabs">
          <button type="button" id="uploadBtn" class="option-tab active">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
            </svg>
            Upload
          </button>
          <button type="button" id="cameraBtn" class="option-tab">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
            </svg>
            Kamera
          </button>
        </div>

        <div id="uploadSection" class="input-section">
          <div class="file-input-container">
            <label for="photo" class="file-input-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
              </svg>
              Pilih Foto
            </label>
            <input type="file" id="photo" class="file-input" accept="image/*" />
            <p class="file-name" id="fileName">Belum ada file dipilih</p>
          </div>
        </div>

        <div id="cameraSection" class="input-section" style="display: none;">
          <div class="camera-container">
            <video id="cameraPreview" autoplay playsinline style="width: 100%; border-radius: 8px;"></video>
            <div class="camera-buttons">
              <button type="button" id="captureBtn" class="camera-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7.5" stroke="currentColor" stroke-width="1" fill="none"/>
                  <circle cx="8" cy="8" r="6" fill="currentColor"/>
                </svg>
              </button>
              <button type="button" id="switchCameraBtn" class="camera-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-5.904-2.854a.5.5 0 1 1 .707.708L6.707 9.95h2.768a.5.5 0 1 1 0 1H5.5a.5.5 0 0 1-.5-.5V6.475a.5.5 0 1 1 1 0v2.768l4.096-4.097z"/>
                </svg>
              </button>
            </div>
          </div>
          <canvas id="photoCanvas" style="display: none;"></canvas>
        </div>

        <div class="image-preview">
          <img id="imagePreview" alt="Preview" style="display: none;" />
        </div>
        
        <!-- Tambahkan checkbox untuk lokasi -->
        <div class="location-checkbox">
          <input type="checkbox" id="useLocation" />
          <label for="useLocation">Tambahkan lokasi saat ini</label>
        </div>
        
        <!-- Container untuk peta -->
        <div id="mapContainer" style="display: none;">
          <div id="map" style="height: 300px; margin-top: 16px; border-radius: 8px;"></div>
          <p class="map-info">Klik pada peta untuk memilih lokasi atau gunakan lokasi saat ini</p>
          <div class="location-details">
            <input type="hidden" id="latitude" name="lat" />
            <input type="hidden" id="longitude" name="lon" />
            <p id="selectedLocation">Lokasi belum dipilih</p>
          </div>
        </div>

        <button type="submit">Kirim Cerita</button>
      </form>
      <p id="addMessage"></p>
      <div id="addStoryLoading" class="loading-spinner" style="display: none;"></div>
    </section>
  `;

  const form = document.getElementById('addStoryForm');
  const message = document.getElementById('addMessage');
  const loadingIndicator = document.getElementById('addStoryLoading');
  const photoInput = document.getElementById('photo');
  const fileNameDisplay = document.getElementById('fileName');
  const imagePreview = document.getElementById('imagePreview');
  const useLocationCheckbox = document.getElementById('useLocation');
  const mapContainer = document.getElementById('mapContainer');
  
  // Elemen untuk fitur kamera
  const uploadBtn = document.getElementById('uploadBtn');
  const cameraBtn = document.getElementById('cameraBtn');
  const uploadSection = document.getElementById('uploadSection');
  const cameraSection = document.getElementById('cameraSection');
  const cameraPreview = document.getElementById('cameraPreview');
  const captureBtn = document.getElementById('captureBtn');
  const switchCameraBtn = document.getElementById('switchCameraBtn');
  const photoCanvas = document.getElementById('photoCanvas');
  
  // Variable untuk menyimpan stream kamera dan track media
  let stream = null;
  let currentFacingMode = 'environment'; // 'environment' untuk kamera belakang, 'user' untuk kamera depan
  let photoBlob = null;
  
  // Event listener untuk tab upload dan kamera
  uploadBtn.addEventListener('click', () => {
    uploadBtn.classList.add('active');
    cameraBtn.classList.remove('active');
    uploadSection.style.display = 'block';
    cameraSection.style.display = 'none';
    stopCamera();
  });
  
  cameraBtn.addEventListener('click', () => {
    cameraBtn.classList.add('active');
    uploadBtn.classList.remove('active');
    uploadSection.style.display = 'none';
    cameraSection.style.display = 'block';
    startCamera();
  });
  
  // Fungsi untuk memulai kamera
  async function startCamera() {
    try {
      // Hentikan stream sebelumnya jika ada
      stopCamera();
      
      // Cek apakah perangkat mendukung fitur kamera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera');
      }
      
      // Konfigurasi kamera
      const constraints = {
        video: {
          facingMode: currentFacingMode
        },
        audio: false
      };
      
      // Minta akses kamera
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Tampilkan video stream di preview
      cameraPreview.srcObject = stream;
      
      console.log('Kamera berhasil diaktifkan dengan mode:', currentFacingMode);
    } catch (error) {
      console.error('Error saat mengakses kamera:', error);
      message.textContent = `Gagal mengakses kamera: ${error.message}`;
    }
  }
  
  // Fungsi untuk menghentikan kamera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
      cameraPreview.srcObject = null;
      console.log('Kamera dimatikan');
    }
  }
  
  // Fungsi untuk mengganti kamera (depan/belakang)
  switchCameraBtn.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    startCamera();
  });
  
  // Fungsi untuk mengambil foto
  captureBtn.addEventListener('click', () => {
    if (!stream) {
      message.textContent = 'Kamera tidak aktif';
      return;
    }
    
    // Siapkan canvas untuk mengambil gambar
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = cameraPreview.videoWidth;
    photoCanvas.height = cameraPreview.videoHeight;
    
    // Gambar video ke canvas
    context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
    
    // Konversi canvas ke gambar
    photoCanvas.toBlob((blob) => {
      photoBlob = blob;
      
      // Tampilkan preview gambar
      const imageUrl = URL.createObjectURL(blob);
      imagePreview.src = imageUrl;
      imagePreview.style.display = 'block';
      
      // Update teks file
      fileNameDisplay.textContent = 'Foto dari kamera';
      
      // Matikan kamera setelah mengambil foto
      stopCamera();
      
      // Kembali ke mode upload untuk menampilkan preview
      uploadBtn.click();
    }, 'image/jpeg', 0.8);
  });

  // Tambahkan event listener untuk preview gambar dari upload
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      
      // Reset photoBlob karena sekarang menggunakan file upload
      photoBlob = null;
      
      // Tampilkan preview gambar
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      fileNameDisplay.textContent = 'Belum ada file dipilih';
      imagePreview.style.display = 'none';
    }
  });
  
  // Event listener untuk checkbox lokasi
  useLocationCheckbox.addEventListener('change', function() {
    if (this.checked) {
      mapContainer.style.display = 'block';
      initMap();
    } else {
      mapContainer.style.display = 'none';
      // Reset nilai lokasi
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';
      document.getElementById('selectedLocation').textContent = 'Lokasi belum dipilih';
    }
  });

  // View object mengikuti pola MVP
  const view = {
    onSubmit(callback) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = form.description.value;
        const photo = photoBlob || form.photo.files[0]; // Gunakan foto dari kamera jika ada
        const lat = form.lat ? form.lat.value : null;
        const lon = form.lon ? form.lon.value : null;

        if (!photo) {
          message.textContent = 'Silakan pilih foto atau ambil foto dengan kamera';
          return;
        }

        const formData = new FormData();
        formData.append('description', description);
        
        // Untuk foto dari kamera, tambahkan dengan nama file yang sesuai
        if (photoBlob) {
          formData.append('photo', photoBlob, 'camera_photo.jpg');
        } else {
          formData.append('photo', photo);
        }
        
        // Tambahkan data lokasi jika ada
        if (lat && lon) {
          formData.append('lat', lat);
          formData.append('lon', lon);
        }

        callback(formData);
      });
    },
    showMessage(text) {
      message.textContent = text;
    },
    showLoading(isLoading) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
      form.querySelector('button').disabled = isLoading;
    },
    resetForm() {
      form.reset();
      imagePreview.style.display = 'none';
      fileNameDisplay.textContent = 'Belum ada file dipilih';
      photoBlob = null;
      if (useLocationCheckbox.checked) {
        useLocationCheckbox.checked = false;
        mapContainer.style.display = 'none';
      }
    }
  };

  // Fungsi untuk menginisialisasi peta
  function initMap() {
    // Pastikan elemen peta ada
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemen map tidak ditemukan');
      return;
    }
    
    // Pastikan library Leaflet tersedia
    if (typeof L === 'undefined') {
      console.error('Leaflet library tidak tersedia');
      return;
    }
    
    console.log('Inisialisasi peta...');
    
    // Inisialisasi peta dengan posisi default
    const map = L.map('map').setView([-7.8011943, 110.3649177], 13);
    
    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // Marker untuk lokasi yang dipilih
    let marker;
    
    // Event handler ketika peta diklik
    map.on('click', function(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      // Hapus marker sebelumnya jika ada
      if (marker) {
        map.removeLayer(marker);
      }
      
      // Tambahkan marker baru
      marker = L.marker([lat, lng]).addTo(map);
      
      // Update nilai input hidden
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;
      document.getElementById('selectedLocation').textContent = `Lokasi dipilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    });
    
    // Fungsi untuk mendapatkan lokasi saat ini
    function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Pindahkan peta ke lokasi saat ini
            map.setView([lat, lng], 15);
            
            // Hapus marker sebelumnya jika ada
            if (marker) {
              map.removeLayer(marker);
            }
            
            // Tambahkan marker baru
            marker = L.marker([lat, lng]).addTo(map);
            
            // Update nilai input hidden
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
            document.getElementById('selectedLocation').textContent = `Lokasi saat ini: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          },
          function(error) {
            console.error('Error mendapatkan lokasi:', error);
            alert('Tidak dapat mendapatkan lokasi Anda. ' + error.message);
          }
        );
      } else {
        alert('Geolocation tidak didukung oleh browser ini.');
      }
    }
    
    // Tambahkan tombol untuk mendapatkan lokasi saat ini
    const locationButton = L.control({ position: 'topleft' });
    locationButton.onAdd = function() {
      const div = L.DomUtil.create('div', 'location-button');
      div.innerHTML = '<button type="button" class="get-location-btn">Gunakan Lokasi Saat Ini</button>';
      div.firstChild.addEventListener('click', getCurrentLocation);
      return div;
    };
    locationButton.addTo(map);
    
    // Force refresh peta
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }

  // Inisialisasi presenter dengan view
  addStoryPresenter(view);
}

export function stopCamera() {
  // Berhenti menggunakan kamera jika pengguna meninggalkan halaman
  const cameraPreview = document.getElementById('cameraPreview');
  if (cameraPreview && cameraPreview.srcObject) {
    const stream = cameraPreview.srcObject;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => {
      track.stop();
    });
    
    cameraPreview.srcObject = null;
    console.log('Kamera dimatikan saat navigasi');
  }
}