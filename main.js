if (document.startViewTransition) {
    document.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
  
        await document.startViewTransition(async () => {
          window.location.hash = href;
          await renderPage(); // fungsi untuk render halaman berdasarkan hash
        });
      });
    });
  }
  