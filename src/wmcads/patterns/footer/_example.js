const footerJs = () => {
  const collapseMenus = document.querySelectorAll('.wmcads-collapse-heading');
  let eventListenersAdded = false;

  const handleMobileFooter = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 768 && !eventListenersAdded) {
      eventListenersAdded = true; // Stop multiple event listeners being added as collapse functionality forces 'resize' call on window.

      collapseMenus.forEach(collapseToggle => {
        let toggleActive = false;
        const panel = document.getElementById(collapseToggle.getAttribute('aria-controls'));

        const handleToggle = () => {
          if (toggleActive) {
            collapseToggle.setAttribute('aria-expanded', 'true');
            panel.style.maxHeight = `${panel.scrollHeight}px`;
          } else {
            collapseToggle.setAttribute('aria-expanded', 'false');
            panel.style.maxHeight = null;
          }
        };

        handleToggle();

        collapseToggle.addEventListener('click', () => {
          toggleActive = !toggleActive;
          handleToggle();
        });

        // if tab is used automaticaly open collapse headings
        const handleKeydown = (e, key) => {
          e.stopPropagation();
          if (key === 9) {
            const collapseToggleButton = document.querySelectorAll('.wmcads-collapse-heading');
            const handleToggleButton = () => {
              collapseToggleButton[0].setAttribute('aria-expanded', 'true');
              collapseToggleButton[1].setAttribute('aria-expanded', 'true');
              panel.style.maxHeight = `${panel.scrollHeight}px`;
            };

            handleToggleButton();
          }
        };

        // if tab is used open menu
        const collapseButton = document.querySelectorAll('.wmcads-footer__collapse-button');

        for (const i of collapseButton) {
          i.addEventListener('keydown', e => {
            handleKeydown(e, e.keyCode);
          });
        }
      });
    }
  };
  // init mobile nav function
  handleMobileFooter();
  window.addEventListener('resize', handleMobileFooter);
};

export default footerJs;
