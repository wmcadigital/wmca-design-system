const pageContents = () => {
  const contents = document.querySelector('.wmcads-dynamic-page-contents');

  if (contents != null) {
    const headings = document.querySelectorAll('main h2');

    headings.forEach(heading => {
      const str = heading.innerHTML;
      const linkStr = str.toLowerCase().replaceAll(' ', '-');
      const link = `#${linkStr}`;

      // add id to all the h2
      heading.setAttribute('id', linkStr);

      // function to decode htmlentities
      function decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
      }
      // function to add a link to the page contents
      function createMenuItem() {
        const li = document.createElement('a');
        li.textContent = decodeHtml(str);
        li.setAttribute('href', link);
        return li;
      }

      // get the page contents
      const menu = document.querySelector('.wmcads-page-contents');
      // add page contents link
      menu.appendChild(createMenuItem());
    });
  }
};

export default pageContents;
