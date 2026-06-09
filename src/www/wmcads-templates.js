import pageContents from './pages/templates/campaign-two-columns/campaign-template';
import search from './pages/templates/search/search-template';

window.addEventListener('DOMContentLoaded', () => {
  try {
    pageContents();
    search();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error during DOMContentLoaded initialisation in wmcads-templates:', e);
  }
});
