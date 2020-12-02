const accordionsJS = () => {
  const accordions = document.querySelectorAll('.wmcads-accordion');

  accordions.forEach(accordion => {
    const accordionBtn = accordion.querySelector('.wmcads-accordion__summary-wrapper');

    const toggleAccordion = () => {
      if (accordion.classList.contains('wmcads-is--open')) {
        accordion.classList.remove('wmcads-is--open');
        accordionBtn.setAttribute('aria-expanded', false);
      } else {
        accordion.classList.add('wmcads-is--open');
        accordionBtn.setAttribute('aria-expanded', true);
      }
    };

    accordionBtn.addEventListener('click', toggleAccordion);
  });
};

export default accordionsJS;
