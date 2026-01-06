/* global require */

const _polyfills = require('./assets/vendor/js/polyfills/polyfills');
const _colorPalettes = require('./pages/wmca/styles/colour-palettes/_color-palettes');
const _aToZContentStyleGuide = require('./pages/wmca/styles/a-to-z-content-style-guide/_a-to-z-content-style-guide');
// const _cookies = require('../wmcads/patterns/cookies/_example');
const _headerJs = require('../wmcads/patterns/header-v2/_example');
const _footerJs = require('../wmcads/patterns/footer/_example');
const _accordionsJS = require('../wmcads/components/accordion/_example');
const _boardMembersJS = require('../wmcads/patterns/board-members/_example');
const _searchFilterJs = require('../wmcads/patterns/search/search-filter/_example');
const _feedbackLoopsJS = require('../wmcads/patterns/feedback-loop/_example');
const _cardsJs = require('../wmcads/components/content-card/_example');

const _partials = require('./_partials/component-example');

const polyfills = (_polyfills && _polyfills.default) || _polyfills;
const colorPalettes = (_colorPalettes && _colorPalettes.default) || _colorPalettes;
const aToZContentStyleGuide =
  (_aToZContentStyleGuide && _aToZContentStyleGuide.default) || _aToZContentStyleGuide;
const headerJs = (_headerJs && _headerJs.default) || _headerJs;
const footerJs = (_footerJs && _footerJs.default) || _footerJs;
const accordionsJS = (_accordionsJS && _accordionsJS.default) || _accordionsJS;
const boardMembersJS = (_boardMembersJS && _boardMembersJS.default) || _boardMembersJS;
const searchFilterJs = (_searchFilterJs && _searchFilterJs.default) || _searchFilterJs;
const feedbackLoopsJS = (_feedbackLoopsJS && _feedbackLoopsJS.default) || _feedbackLoopsJS;
const cardsJs = (_cardsJs && _cardsJs.default) || _cardsJs;

const componentExample =
  (_partials && _partials.componentExample) ||
  (_partials && _partials.default && _partials.default.componentExample);
const componentExampleIframe =
  (_partials && _partials.componentExampleIframe) ||
  (_partials && _partials.default && _partials.default.componentExampleIframe);

const icons = () => {
  // Ajax SVG in, SVGS are referenced in app (Icon component)
  const ajax = new XMLHttpRequest();
  ajax.open('GET', '/img/ds-icons.min.svg', true);
  ajax.send();
  ajax.onload = () => {
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  };
};

window.addEventListener('DOMContentLoaded', () => {
  if (typeof polyfills === 'function') polyfills();
  icons();
  if (typeof aToZContentStyleGuide === 'function') aToZContentStyleGuide();
  if (typeof colorPalettes === 'function') colorPalettes();
  if (typeof headerJs === 'function') headerJs();
  if (typeof footerJs === 'function') footerJs();
  if (typeof accordionsJS === 'function') accordionsJS();
  if (typeof boardMembersJS === 'function') boardMembersJS();
  // if (typeof _cookies === 'function') _cookies();
  if (typeof searchFilterJs === 'function') searchFilterJs();
  if (typeof feedbackLoopsJS === 'function') feedbackLoopsJS();
  if (typeof componentExampleIframe === 'function') componentExampleIframe();
  if (typeof cardsJs === 'function') cardsJs();
  if (typeof componentExample === 'function') componentExample();
});
