// views/storyList.js
import { storyListPresenter } from '../presenter/storyListPresenter.js';

export function renderStoryList(container) {
  container.innerHTML = `
    <section class="stories-section">
      <h2>Daftar Cerita</h2>
      <div id="storiesContainer" class="story-list"></div>
      <div id="storiesLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Memuat cerita...</p>
      </div>
      <p id="storiesMessage" style="text-align: center; display: none;"></p>
    </section>
  `;

  const storiesContainer = document.getElementById('storiesContainer');
  const loadingIndicator = document.getElementById('storiesLoading');
  const message = document.getElementById('storiesMessage');

  // View object mengikuti pola MVP
  const view = {
    showStories(stories) {
      storiesContainer.innerHTML = stories.map((story) => `
        <article class="story-item">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-image">
          <div class="story-content">
            <h3 class="story-name">${story.name}</h3>
            <p class="story-desc">${story.description}</p>
            <div class="story-meta">
              <span>${new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </article>
      `).join('');
      
      storiesContainer.style.display = 'grid';
      message.style.display = 'none';
    },
    showError(errorText) {
      message.textContent = errorText;
      message.style.display = 'block';
      storiesContainer.style.display = 'none';
    },
    showEmpty(emptyText) {
      message.textContent = emptyText;
      message.style.display = 'block';
      storiesContainer.style.display = 'none';
    },
    showLoading(isLoading) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
  };

  // Inisialisasi presenter dengan view
  storyListPresenter(view);
}