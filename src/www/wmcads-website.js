import './assets/vendor/js/polyfills/polyfills';
import colorPalettes from './pages/styles/colour-palettes/_color-palettes';
import aToZContentStyleGuide from './pages/styles/a-to-z-content-style-guide/_a-to-z-content-style-guide';
import cookies from '../wmcads/patterns/cookies/_example';
import headerJs from '../wmcads/patterns/header-v2/_example';
import footerJs from '../wmcads/patterns/footer/_example';
import accordionsJS from '../wmcads/components/accordion/_example';
import boardMembersJS from '../wmcads/patterns/board-members/_example';
import searchFilterJs from '../wmcads/patterns/search/search-filter/_example';
import htmlCleanup from './assets/js/htmlCleanup';
import tableJS from '../wmcads/components/table/_example';

import {
  componentExample,
  componentExampleScript,
  componentExampleIframe
} from './_partials/component-example';

const icons = () => {
  // Ajax SVG in, SVGS are referenced in app (Icon component)
  const ajax = new XMLHttpRequest();
  ajax.open('GET', '/img/wmcads-icons.min.svg', true);
  ajax.send();
  ajax.onload = () => {
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  };
};

window.addEventListener('DOMContentLoaded', () => {
  // Ensure polyfills are imported (they may export side-effects or helpers)
  // Call initialiser functions after DOM is ready
  try {
    // Some imports may be functions that initialize immediately
    icons();
    aToZContentStyleGuide();
    colorPalettes();
    headerJs();
    footerJs();
    accordionsJS();
    boardMembersJS();
    cookies();
    searchFilterJs();
    componentExampleIframe();
    componentExampleScript();
    // htmlCleanup is a function exported from its module
    htmlCleanup();
    tableJS();
    componentExample();
  } catch (e) {
    // Log errors to help debugging in development
    // eslint-disable-next-line no-console
    console.error('Error during DOMContentLoaded initialisation:', e);
  }
});
