import * as polyfills from './assets/vendor/js/polyfills/polyfills';
import headerJs from '../wmcads/patterns/header-v2/_example';
import footerJs from '../wmcads/patterns/footer/_example';
import accordionsJS from '../wmcads/components/accordion/_example';
import boardMembersJS from '../wmcads/patterns/board-members/_example';
import searchFilterJs from '../wmcads/patterns/search/search-filter/_example';
import htmlCleanup from './assets/js/htmlCleanup';

const icons = () => {
  // Ajax SVG in, SVGS are referenced in app (Icon component)
  const ajax = new XMLHttpRequest();
  ajax.open(
    'GET',
    'https://cloudcdn.wmca.org.uk/wmcaassets/ds/1.5.4.7/img/wmcads-icons.min.svg',
    true
  );
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
  headerJs(),
  footerJs(),
  accordionsJS(),
  boardMembersJS(),
  searchFilterJs(),
  htmlCleanup())
);
