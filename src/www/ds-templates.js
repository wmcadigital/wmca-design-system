/* global require */

const _pageContents = require('./pages/wmca/templates/campaign-two-columns/campaign-template');
const _search = require('./pages/wmca/templates/search/search-template');

const pageContents = (_pageContents && _pageContents.default) || _pageContents;
const search = (_search && _search.default) || _search;

window.addEventListener('DOMContentLoaded', () => {
  if (typeof pageContents === 'function') pageContents();
  if (typeof search === 'function') search();
});
