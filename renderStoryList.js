export async function renderStoryList(main) {
  const token = localStorage.getItem('token');

  if (!token) {
    main.innerHTML = '<p style="color: red;">Token tidak ditemukan. Silakan login terlebih dahulu.</p>';
    return;
  }

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil data.');
    }

    const storyList = result.listStory;
    let htmlContent = '<h2>Daftar Cerita</h2>';

    storyList.forEach(story => {
      htmlContent += `
        <div class="story">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" />
          <p><strong>Lokasi:</strong> ${story.lat}, ${story.lon}</p>
        </div>
      `;
    });

    main.innerHTML = htmlContent;

  } catch (error) {
    main.innerHTML = `<p style="color: red;">Gagal memuat cerita: ${error.message}</p>`;
    console.error('Error:', error);
  }
}
