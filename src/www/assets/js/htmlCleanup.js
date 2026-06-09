const htmlCleanup = () => {
  /**
   * Removes empty attributes from all elements in the DOM.
   * An attribute is considered empty if its value is an empty string.
   */
  function removeEmptyHtmlAttributes(root = document) {
    const elements = root.querySelectorAll('*');
    elements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.value === '') {
          el.removeAttribute(attr.name);
        }
      });
    });
  }

  /**
   * Removes empty <p> elements from the DOM.
   * A paragraph is considered empty if it contains only whitespace,
   * no content, only empty <strong> tags, or is only a parent of an <img>.
   * If a <p> contains only an <img> (and possibly whitespace), remove the <p> but keep the <img>.
   */
  function removeEmptyParagraphs(root = document) {
    const paragraphs = root.querySelectorAll('p');
    paragraphs.forEach(p => {
      // Remove if only whitespace and no children
      if (!p.textContent.trim() && p.children.length === 0) {
        p.remove();
        return;
      }
      // Remove if only contains empty <strong> tags (possibly with whitespace)
      if (
        p.children.length === 1 &&
        p.children[0].tagName === 'STRONG' &&
        !p.children[0].textContent.trim()
      ) {
        p.remove();
        return;
      }
      // Remove if all children are empty <strong> tags (possibly with whitespace)
      if (
        p.children.length > 0 &&
        Array.from(p.children).every(
          child => child.tagName === 'STRONG' && !child.textContent.trim()
        ) &&
        !p.textContent.replace(/<strong>.*?<\/strong>/gi, '').trim()
      ) {
        p.remove();
        return;
      }
      // If <p> contains only an <img> (and possibly whitespace), unwrap the <img>
      if (
        p.children.length === 1 &&
        p.children[0].tagName === 'IMG' &&
        !p.textContent
          .replace(/\u200B/g, '')
          .trim()
          .replace(/<img[^>]*>/gi, '')
      ) {
        p.parentNode.insertBefore(p.children[0], p);
        p.remove();
        return;
      }
      // If all children are <img> tags and no other text, unwrap all <img> tags
      if (
        p.children.length > 0 &&
        Array.from(p.children).every(child => child.tagName === 'IMG') &&
        !p.textContent
          .replace(/\u200B/g, '')
          .trim()
          .replace(/<img[^>]*>/gi, '')
      ) {
        Array.from(p.children).forEach(img => {
          p.parentNode.insertBefore(img, p);
        });
        p.remove();
      }
    });
  }

  /**
   * Removes empty heading elements (<h1>–<h6>) from the DOM.
   * A heading is considered empty if it contains only whitespace or no content.
   */
  function removeEmptyHeadings(root = document) {
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => {
      if (!h.textContent.trim() && h.children.length === 0) {
        h.remove();
      }
    });
  }

  /**
   * Removes emoji characters from all text nodes in the DOM.
   * Uses a regex to match most common emoji code points.
   */
  function removeEmojis(root = document) {
    const treeWalker = document.createTreeWalker(
      root.body || root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    // Use Unicode property escapes to match all emoji, including ✅ (U+2705)
    // This requires ES2018+ and modern browsers
    // Regex to match a wide range of emoji, including ✅ (U+2705), Dingbats, Misc Symbols, and surrogate pairs
    const emojiRegex =
      /([\u2705]|[\u2700-\u27BF]|[\u2600-\u26FF]|[\u231A-\u231B]|[\u23E9-\u23EC]|[\u23F0]|[\u23F3]|[\u25FD-\u25FE]|[\u2614-\u2615]|[\u2648-\u2653]|[\u267F]|[\u2693]|[\u26A1]|[\u26AA-\u26AB]|[\u26BD-\u26BE]|[\u26C4-\u26C5]|[\u26CE]|[\u26D4]|[\u26EA]|[\u26F2-\u26F3]|[\u26F5]|[\u26FA]|[\u26FD]|[\u2702]|[\u2708-\u2709]|[\u270A-\u270B]|[\u2728]|[\u274C]|[\u274E]|[\u2753-\u2755]|[\u2757]|[\u2795-\u2797]|[\u27B0]|[\u27BF]|[\u2B1B-\u2B1C]|[\u2B50]|[\u2B55]|[\u2934-\u2935]|[\u2B06]|[\u2B07]|[\u2B05]|[\uD83C][\uDDE6-\uDDFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDD00-\uDDFF])/g;
    let node = treeWalker.nextNode();
    for (; node !== null; node = treeWalker.nextNode()) {
      if (emojiRegex.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(emojiRegex, '');
      }
    }
  }

  /**
   * Replace non-breaking spaces (\u00A0 / &nbsp;) in all text nodes with regular spaces.
   * This helps avoid layout and trimming issues caused by NBSP characters.
   */
  function removeNbsp(root = document) {
    const treeWalker = document.createTreeWalker(
      root.body || root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node = treeWalker.nextNode();
    for (; node !== null; node = treeWalker.nextNode()) {
      if (node.nodeValue && node.nodeValue.indexOf('\u00A0') !== -1) {
        node.nodeValue = node.nodeValue.replace(/\u00A0/g, ' ');
      }
    }
  }

  // Example usage: remove from entire document
  removeNbsp();
  removeEmojis();
  removeEmptyHtmlAttributes();
  removeEmptyParagraphs();
  removeEmptyHeadings();
};

// Export the function itself so callers can decide when to run it
export default htmlCleanup;
