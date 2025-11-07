/* eslint-disable no-console */
const tableJS = () => {
  // Only run the table script if the document has at least one <table> element.
  // This avoids unnecessary work on pages without tables (and avoids logging there).
  if (typeof document === 'undefined' || !document.querySelector('table')) return;
  // Ensure all <table> elements have the WMCADS class for consistent styling
  try {
    const tables = Array.from(document.querySelectorAll('table'));
    tables.forEach(tbl => {
      if (!tbl.classList.contains('wmcads-table')) {
        tbl.classList.add('wmcads-table');
      }
      // Remove any inline styles to avoid conflicting presentation
      if (tbl.hasAttribute('style')) {
        tbl.removeAttribute('style');
      }
      // Remove deprecated/inline border attribute if present
      if (tbl.hasAttribute('border')) {
        tbl.removeAttribute('border');
      }
      // Remove deprecated/inline width attribute if present
      if (tbl.hasAttribute('width')) {
        tbl.removeAttribute('width');
      }
      // Mark tables that do not have a thead
      try {
        if (!tbl.querySelector('thead')) {
          tbl.classList.add('wmcads-table--without-header');
        } else {
          tbl.classList.remove('wmcads-table--without-header');
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error marking table without header:', e);
      }
      // Remove inline styles from rows and cells to avoid presentation conflicts
      try {
        const rows = Array.from(tbl.querySelectorAll('tr'));
        rows.forEach(tr => {
          if (tr.hasAttribute('style')) tr.removeAttribute('style');
          const cells = Array.from(tr.querySelectorAll('td, th'));
          cells.forEach(cell => {
            if (cell.hasAttribute('style')) cell.removeAttribute('style');
            // Remove deprecated inline width on cells as well to avoid fixed layout
            if (cell.hasAttribute('width')) cell.removeAttribute('width');
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error removing inline styles from rows/cells:', e);
      }

      // If the table lacks a thead, convert the first cell in every <tr> into a <th>
      try {
        if (!tbl.querySelector('thead')) {
          const rows = Array.from(tbl.querySelectorAll('tr'));
          const firstRow = rows[0];
          const hasBoldInFirstRow = (() => {
            if (!firstRow) return false;
            const cells = Array.from(firstRow.querySelectorAll('td, th'));
            if (cells.length === 0) return false;
            return cells.every(cell => !!cell.querySelector('b, strong'));
          })();

          // Also detect if any row already contains multiple <th> elements; if so,
          // we'll treat that row as a header row and create a <thead> around it.
          const hasMultiTh = rows.some(r => r.querySelectorAll('th').length > 1);

          // Only proceed with converting/annotating rows if the first <tr>'s cells include
          // <b>/<strong> OR if any row already contains multiple <th>s.
          if (hasBoldInFirstRow || hasMultiTh) {
            rows.forEach((row, rowIndex) => {
              // Add data-header attribute on the row (kept for compatibility)
              try {
                row.setAttribute('data-header', `Header ${rowIndex + 1}`);
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Error setting data-header attribute on row:', e);
              }

              // Check if this row uses heading elements (h1..h6) and mark it
              try {
                // Only inspect the first row for heading-like markers. If the first row
                // doesn't contain heading elements or bold/strong, we won't create a thead.
                let headings = [];
                let bolds = [];
                if (rowIndex === 0) {
                  headings = Array.from(row.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                  bolds = Array.from(row.querySelectorAll('b, strong'));
                }

                const ths = Array.from(row.querySelectorAll('th'));
                if (ths.length > 1 || (rowIndex === 0 && (headings.length || bolds.length))) {
                  // Unwrap heading and/or bold/strong elements (preserve text/inline content).
                  const toUnwrap = headings.concat(bolds);
                  toUnwrap.forEach(h => {
                    try {
                      const parent = h.parentNode;
                      if (!parent) return;
                      while (h.firstChild) {
                        parent.insertBefore(h.firstChild, h);
                      }
                      parent.removeChild(h);
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.error(
                        'Error stripping heading/strong element while keeping text:',
                        err
                      );
                    }
                  });

                  // Remove data-header attribute from the row if the table does NOT have the without-header marker
                  try {
                    if (!tbl.classList.contains('wmcads-table--without-header')) {
                      if (row.hasAttribute('data-header')) row.removeAttribute('data-header');
                    }
                  } catch (errHeaderCheck) {
                    // eslint-disable-next-line no-console
                    console.error(
                      'Error checking table class before removing data-header from row:',
                      errHeaderCheck
                    );
                  }

                  // Convert any <td> in this row to <th> and remove data-header from cells
                  const cells = Array.from(row.querySelectorAll('td, th'));
                  cells.forEach(cell => {
                    const tag = cell.tagName && cell.tagName.toLowerCase();
                    if (tag === 'td') {
                      const newTh = document.createElement('th');
                      // copy attributes except data-header so it is not transferred to the new element
                      Array.from(cell.attributes).forEach(attr => {
                        if (attr.name.toLowerCase() !== 'data-header') {
                          newTh.setAttribute(attr.name, attr.value);
                        }
                      });
                      while (cell.firstChild) newTh.appendChild(cell.firstChild);
                      row.replaceChild(newTh, cell);
                      // defensive: ensure the resulting element does not have data-header
                      if (newTh.hasAttribute('data-header')) newTh.removeAttribute('data-header');
                      // ensure each header cell has scope="col"
                      newTh.setAttribute('scope', 'col');
                    } else {
                      // it's already a <th> - remove any data-header attribute and ensure scope="col"
                      if (cell.hasAttribute('data-header')) {
                        cell.removeAttribute('data-header');
                      }
                      cell.setAttribute('scope', 'col');
                    }
                  });

                  // Wrap this row in a <thead> and insert at the start of the table
                  const thead = document.createElement('thead');
                  thead.appendChild(row);
                  if (tbl.firstChild) {
                    tbl.insertBefore(thead, tbl.firstChild);
                  } else {
                    tbl.appendChild(thead);
                  }

                  // Log creation for debugging: capture header cell text values
                  try {
                    const headerLabels = Array.from(thead.querySelectorAll('th, td')).map(h =>
                      (h.textContent || '').trim()
                    );

                    // Attempt to capture a usable line number/file reference from the stack
                    let sourceInfo = '';
                    try {
                      const err = new Error();
                      if (err.stack) {
                        const lines = err.stack.split('\n').map(l => l.trim());
                        // prefer a stack line that references a .js file with line/col info
                        const jsLine = lines.find(l => /\b\.js:\d+:\d+\b/.test(l)) || lines[1];
                        if (jsLine) {
                          const m = jsLine.match(/(\/?[^():\s]+\.js):(\d+):\d+/);
                          if (m) {
                            sourceInfo = `${m[1]}:${m[2]}`; // file:line
                          } else {
                            const m2 = jsLine.match(/:(\d+):\d+\)?$/);
                            if (m2) sourceInfo = `line ${m2[1]}`;
                          }
                        }
                      }
                    } catch (stackErr) {
                      // ignore stack parsing errors
                    }

                    console.log(
                      'Created <thead> for table with headers:',
                      headerLabels,
                      tbl,
                      'source:',
                      sourceInfo
                    );
                  } catch (logErr) {
                    // eslint-disable-next-line no-console
                    console.log('Created <thead> for table');
                  }

                  // If a thead was added, remove the 'wmcads-table--without-header' marker from the table
                  try {
                    if (tbl.classList.contains('wmcads-table--without-header')) {
                      tbl.classList.remove('wmcads-table--without-header');
                    }
                  } catch (err4) {
                    // eslint-disable-next-line no-console
                    console.error(
                      'Error removing wmcads-table--without-header class from table:',
                      err4
                    );
                  }

                  // Build and apply data-header values based on the thead header cell text for each column.
                  // This will set data-header on the th in the thead and on each corresponding td/th in the body.
                  const syncDataHeaders = () => {
                    try {
                      const headerCells = Array.from(thead.querySelectorAll('th, td'));
                      headerCells.forEach((hCell, colIndex) => {
                        // Prefer a readable label from the header cell's text; fallback to Header N
                        let label = (hCell.textContent || '').trim();
                        if (!label) label = `Header ${colIndex + 1}`;

                        // Ensure header cell has scope="col" and the data-header value
                        if (!hCell.hasAttribute('scope')) hCell.setAttribute('scope', 'col');
                        hCell.setAttribute('data-header', label);

                        // Apply the same label to all body cells that belong to this column.
                        const bodyRows = Array.from(tbl.querySelectorAll('tr')).filter(r => {
                          return !(r.closest && r.closest('thead'));
                        });

                        bodyRows.forEach(bRow => {
                          try {
                            // Find the cell in this row that maps to the logical column index,
                            // accounting for colspan attributes.
                            const rowCells = Array.from(bRow.querySelectorAll('td, th'));
                            let colPointer = 0;
                            for (let i = 0; i < rowCells.length; i += 1) {
                              const c = rowCells[i];
                              const colspan = parseInt(c.getAttribute('colspan') || '1', 10) || 1;
                              if (colPointer <= colIndex && colIndex < colPointer + colspan) {
                                // This cell corresponds to the header column
                                c.setAttribute('data-header', label);
                                break;
                              }
                              colPointer += colspan;
                            }
                          } catch (errBodyCell) {
                            // eslint-disable-next-line no-console
                            console.error('Error applying data-header to body cell:', errBodyCell);
                          }
                        });
                      });
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.error('Error syncing data-header attributes:', err);
                    }
                  };

                  // Run immediately and again on next tick to account for any synchronous DOM changes elsewhere.
                  syncDataHeaders();
                  setTimeout(syncDataHeaders, 0);

                  // Note: We previously removed data-header from thead cells; keep them now so body cells can reference them.
                }
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Error detecting heading elements in row:', e);
              }

              const firstCell = row.querySelector('td, th');
              if (!firstCell) return;

              // If the first cell is a <th>, ensure it has an appropriate scope
              if (firstCell.tagName && firstCell.tagName.toLowerCase() === 'th') {
                if (!firstCell.hasAttribute('scope')) {
                  firstCell.setAttribute('scope', 'row');
                }
              } else if (firstCell.tagName && firstCell.tagName.toLowerCase() === 'td') {
                // Only convert the first <td> to a <th> when its first element child is <b> or <strong>
                const firstElemChild = firstCell.firstElementChild;
                const shouldConvert =
                  firstElemChild &&
                  (firstElemChild.tagName === 'B' || firstElemChild.tagName === 'STRONG');

                if (shouldConvert) {
                  const th = document.createElement('th');
                  Array.from(firstCell.attributes).forEach(attr => {
                    th.setAttribute(attr.name, attr.value);
                  });
                  if (!th.hasAttribute('scope')) th.setAttribute('scope', 'row');
                  while (firstCell.firstChild) {
                    th.appendChild(firstCell.firstChild);
                  }
                  row.replaceChild(th, firstCell);
                }
                // If not converting, leave the <td> as-is.
              }

              // Apply data-header to all cells based on their column index (Header 1, Header 2...)
              try {
                const cells = Array.from(row.querySelectorAll('td, th'));
                cells.forEach((cell, colIndex) => {
                  cell.setAttribute('data-header', `Header ${colIndex + 1}`);
                });
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Error setting data-header on cells:', e);
              }
            });
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error converting first td to th for each row:', e);
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error ensuring wmcads-table class on tables:', e);
  }
};

export default tableJS;
