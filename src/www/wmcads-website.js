import * as Sentry from '@sentry/browser';
import * as polyfills from './assets/vendor/js/polyfills/polyfills';
import colorPalettes from './pages/styles/colour-palettes/_color-palettes';
import aToZContentStyleGuide from './pages/styles/a-to-z-content-style-guide/_a-to-z-content-style-guide';
import cookies from '../wmcads/patterns/cookies/_example';
import headerJs from '../wmcads/patterns/header/_example';
import footerJs from '../wmcads/patterns/footer/_example';
import accordionsJS from '../wmcads/components/accordion/_example';
import searchFilterJs from '../wmcads/patterns/search/search-filter/_example';

import {
  componentExample,
  componentExampleScript,
  componentExampleIframe
} from './_partials/component-example';

const isInIframe = window.frameElement && window.frameElement.nodeName === 'IFRAME'; // check if we are in an iframe
// If not in iframe and we are in prod, then run sentry
if (!isInIframe && process.env.NODE_ENV === 'production')
  Sentry.init({
    dsn: 'https://e86f5320a3e347f4831704b9009e3b6b@o489652.ingest.sentry.io/5552219'
  });

const icons = () => {
  // Ajax SVG in, SVGS are referenced in app (Icon component)
  const ajax = new XMLHttpRequest();
  ajax.open('GET', '$*cdn/img/wmcads-icons.min.svg', true);
  ajax.send();
  ajax.onload = () => {
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  };
};

window.addEventListener(
  'DOMContentLoaded',
  (polyfills,
  icons(),
  aToZContentStyleGuide(),
  colorPalettes(),
  headerJs(),
  footerJs(),
  accordionsJS(),
  cookies(),
  searchFilterJs(),
  componentExampleIframe(),
  componentExampleScript(),
  componentExample)
);
