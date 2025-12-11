#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

// This script finds `.njk` templates shipped in package `dist/` directories
// and attempts to render them into `.html` files. It is used to produce
// example HTML for components that include Nunjucks templates.

function findPackagesDir() {
  // Project packages directory (relative to this scripts folder)
  return path.join(__dirname, '..', 'packages');
}

function readFileSafe(p) {
  // Read a file and return its contents, or `null` on error.
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return null;
  }
}

function detectMacros(content) {
  // Very small parser to detect `macro` declarations in a Nunjucks template.
  // It returns an array of objects: { name, params } for each macro found.
  const re = /\{%\s*macro\s+([a-zA-Z0-9_\-]+)\s*\(([^}]*)\)\s*%\}/g;
  const macros = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    const params = m[2]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    macros.push({ name, params });
  }
  return macros;
}

function sampleArgFor(param) {
  // Produce a simple example value for a macro parameter name.
  // This is heuristic and only intended to provide useful demo input when
  // calling macros (e.g. title -> 'Example title', lists -> array sample).
  if (!param) return "'example'";
  const p = param.toLowerCase();
  if (p.includes('items') || p.includes('list') || p.includes('links')) {
    return `[{'href':'#','text':'Example 1'},{'href':'#','text':'Example 2'}]`;
  }
  if (p.includes('meta') || p.includes('data') || p.includes('info')) return "'Meta text'";
  if (p.includes('title') || p.includes('heading')) return "'Example title'";
  return "'example'";
}

function findDistDirs(rootDir) {
  // Walk the packages root and return any found `dist/` directories.
  // The repository layout sometimes nests packages one level deeper, so this
  // function checks both `packages/<pkg>/dist` and `packages/<group>/<pkg>/dist`.
  const results = [];
  const items = fs.readdirSync(rootDir);
  items.forEach(item => {
    const p = path.join(rootDir, item);
    try {
      if (!fs.statSync(p).isDirectory()) return;
    } catch (e) {
      return;
    }

    const dist = path.join(p, 'dist');
    if (fs.existsSync(dist) && fs.statSync(dist).isDirectory()) {
      results.push({ pkg: item, distDir: dist });
      return;
    }

    // check one level deeper (packages/<group>/<pkg>)
    const subitems = fs.readdirSync(p).filter(d => {
      try {
        return fs.statSync(path.join(p, d)).isDirectory();
      } catch (e) {
        return false;
      }
    });
    subitems.forEach(sub => {
      const sp = path.join(p, sub);
      const sdist = path.join(sp, 'dist');
      if (fs.existsSync(sdist) && fs.statSync(sdist).isDirectory()) {
        results.push({ pkg: sub, distDir: sdist });
      }
    });
  });
  return results;
}

function renderPackageNjks() {
  // The script accepts an optional path argument. If provided and it points
  // to a `dist` directory, render only that directory. If provided and it is
  // a package root, search inside it for `dist/`. Otherwise render all
  // package dist directories (legacy behaviour).
  const arg = process.argv[2];
  let entries = [];

  if (arg) {
    const abs = path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg);
    try {
      if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
        const base = path.basename(abs);
        if (base === 'dist') {
          // arg is a dist folder
          entries = [{ pkg: path.basename(path.dirname(abs)), distDir: abs }];
        } else {
          // arg is a package folder (or other dir) - look for dist inside
          const maybeDist = path.join(abs, 'dist');
          if (fs.existsSync(maybeDist) && fs.statSync(maybeDist).isDirectory()) {
            entries = [{ pkg: path.basename(abs), distDir: maybeDist }];
          } else {
            // fall back to searching for dist dirs under arg
            entries = findDistDirs(abs);
          }
        }
      }
    } catch (e) {
      // fall back to default behaviour below
      entries = [];
    }
  }

  if (!entries || entries.length === 0) {
    const pkgsDir = findPackagesDir();
    entries = findDistDirs(pkgsDir);
  }

  entries.forEach(entry => {
    const { pkg } = entry;
    const { distDir } = entry;
    // Find .njk files recursively under the dist directory
    function findNjkFiles(dir) {
      let results = [];
      const items = fs.readdirSync(dir);
      items.forEach(it => {
        const p = path.join(dir, it);
        try {
          const stat = fs.statSync(p);
          if (stat.isDirectory()) {
            results = results.concat(findNjkFiles(p));
          } else if (stat.isFile() && p.endsWith('.njk')) {
            results.push(p);
          }
        } catch (e) {
          // ignore
        }
      });
      return results;
    }

    const files = findNjkFiles(distDir);
    files.forEach(full => {
      const content = readFileSafe(full);
      if (content === null) return;
      const macros = detectMacros(content);
      let outputHtml = '';
      try {
        const env = new nunjucks.Environment(
          new nunjucks.FileSystemLoader([
            distDir,
            path.join(__dirname, '..', 'src', 'wmcads', 'components'),
            path.join(__dirname, '..', 'src')
          ]),
          { autoescape: false }
        );
        // If no macros are detected, try to render the file as a full template.
        // If macros exist, import the file and call the first macro with sample args.
        if (macros.length === 0) {
          // try render as full template
          outputHtml = env.renderString(content, {});
        } else {
          // use the first macro and call it with sample args
          const macro = macros[0];
          const importName = 'm';
          const rel = path.relative(distDir, full).replace(/\\/g, '/');
          const wrapper = [];
          wrapper.push(`{% import '${rel}' as ${importName} %}`);
          const args = macro.params.map(p => sampleArgFor(p)).join(', ');
          wrapper.push(`{{ ${importName}.${macro.name}(${args}) }}`);
          const wrapperTpl = wrapper.join('\n');
          outputHtml = env.renderString(wrapperTpl, {});
        }
      } catch (err) {
        outputHtml = `<pre>Rendering error: ${err.message}</pre>`;
      }
      const relOut = path.relative(distDir, full).replace(/\\/g, '/').replace(/\.njk$/, '.html');
      const outPath = path.join(distDir, relOut);
      // ensure parent directory exists
      function ensureDir(dir) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      }
      ensureDir(path.dirname(outPath));
      fs.writeFileSync(outPath, outputHtml, 'utf8');
      console.log(`Rendered ${pkg}/${relOut} -> ${path.basename(outPath)}`);
    });
  });
}

renderPackageNjks();
