const accordionsJS = () => {
  const accordions = document.querySelectorAll('.ds-accordion');

  accordions.forEach(accordion => {
    const accordionBtn = accordion.querySelector('.ds-accordion__summary-wrapper');

    const toggleAccordion = () => {
      if (accordion.classList.contains('ds-is--open')) {
        accordion.classList.remove('ds-is--open');
        accordionBtn.setAttribute('aria-expanded', false);
      } else {
        accordion.classList.add('ds-is--open');
        accordionBtn.setAttribute('aria-expanded', true);
      }
    };

    accordionBtn.addEventListener('click', toggleAccordion);
  });
};

export default accordionsJS;
