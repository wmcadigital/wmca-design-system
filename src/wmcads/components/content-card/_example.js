const cardsJs = () => {
  // This script checks the width of the content card and makes buttons full width if below 500px
  const container = document.querySelector('.ds-content-card');
  if (!container) return;
  const button = container.querySelector('.ds-btn');
  if (!button) return;

  function cardButtonWidth() {
    if (container.offsetWidth < 500) {
      button.classList.add('ds-full-width');
    } else {
      button.classList.remove('ds-full-width');
    }
  }

  window.addEventListener('resize', cardButtonWidth);
  cardButtonWidth();
};

export default cardsJs;
