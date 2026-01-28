const cardsJs = () => {
  // This script checks the width of each content card and makes its button full width if below 500px
  const cards = Array.from(document.querySelectorAll('.ds-content-card'));
  if (!cards.length) return;

  const buttons = cards.map(card => card.querySelector('.ds-btn'));

  function cardButtonWidth() {
    cards.forEach((container, i) => {
      const button = buttons[i];
      if (!container || !button) return;
      if (container.offsetWidth < 500) {
        button.classList.add('ds-full-width');
      } else {
        button.classList.remove('ds-full-width');
      }
    });
  }

  window.addEventListener('resize', cardButtonWidth);
  cardButtonWidth();
};

export default cardsJs;
