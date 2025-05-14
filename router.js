import { renderLogin } from './view/login.js';
import { renderRegister } from './view/register.js';
import { renderStoryList } from './view/storyList.js';
import { renderAddStory, stopCamera } from './view/addStory.js';

export function router() {
  const main = document.getElementById('main');
  const hash = window.location.hash;

  if (!hash.startsWith('#/')) return;

  stopCamera();

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      renderPage(main, hash);
    });
  } else {
    renderPage(main, hash);
  }
}

function renderPage(main, hash) {
  if (hash === '#/login') {
    renderLogin(main);
  } else if (hash === '#/register') {
    renderRegister(main);
  } else if (hash === '#/stories') {
    renderStoryList(main);
  } else if (hash === '#/add-story') {
    renderAddStory(main);
  } else {
    main.innerHTML = '<p>Halaman tidak ditemukan.</p>';
  }
}
