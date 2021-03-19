const boardMembersJS = () => {
  // get all the 'trigger' elements on the page
  const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));

  // listen to click events that occuor
  // only on our triggers
  window.addEventListener(
    'click',
    ev => {
      const elm = ev.target;
      if (triggers.includes(elm)) {
        ev.preventDefault();
        const selector = elm.getAttribute('data-target');
        collapse(selector, 'toggle');
        if (elm.getAttribute('aria-expanded') === 'false') {
          elm.setAttribute('aria-expanded', 'true');
        } else {
          elm.setAttribute('aria-expanded', 'false');
        }
      }
    },
    false
  );

  // map commands to the classList methods
  const fnmap = {
    toggle: 'toggle',
    show: 'add',
    hide: 'remove'
  };
  const collapse = (selector, cmd) => {
    const targets = Array.from(document.querySelectorAll(selector));
    targets.forEach(target => {
      target.classList[fnmap[cmd]]('show');
    });
  };

  const tabs = document.querySelectorAll('ul.wmcads-board-members-tab-labels > li');
  const panelQuestions = document.querySelectorAll('.wmcads-board-members-panel-question');

  const onTabClick = e => {
    e.preventDefault();

    tabs.forEach(tab => {
      tab.classList.remove('active');
    });

    const clickedTab = e.currentTarget;
    clickedTab.classList.add('active');

    const tabsPanel = document.querySelectorAll('.wmcads-board-members-single-panel');

    tabsPanel.forEach(panel => {
      panel.classList.remove('active');
    });

    const anchorRef = e.target;
    const activePanelId = anchorRef.getAttribute('href');
    const activePanel = document.querySelector(activePanelId);

    activePanel.classList.add('active');
  };

  const onQuestionClick = e => {
    e.preventDefault();

    tabs.forEach(tab => {
      tab.classList.remove('active');
    });

    tabs[1].classList.add('active');

    const tabsPanel = document.querySelectorAll('.wmcads-board-members-single-panel');
    const tab2 = document.querySelector('#tab-2');

    tabsPanel.forEach(panel => {
      panel.classList.remove('active');
    });

    tab2.classList.add('active');

    const tabQuestion = document.querySelectorAll('.wmcads-board-members-panel-content');

    tabQuestion.forEach(question => {
      question.classList.remove('active');
    });

    const questionAnchor = e.target;
    const activeQuestion = questionAnchor.getAttribute('href');
    const AnswerPanel = document.querySelector(activeQuestion);

    AnswerPanel.classList.add('active');
  };

  for (const tab of tabs) {
    tab.addEventListener('click', onTabClick);
  }

  for (const question of panelQuestions) {
    question.addEventListener('click', onQuestionClick);
  }
};

export default boardMembersJS;
