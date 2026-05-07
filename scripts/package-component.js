#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// CLI arguments: either `--all` to package all components, or a single component name.
const argv = process.argv.slice(2);
const ALL_FLAG = argv.includes('--all');
const componentArg = argv.find(a => a !== '--all');

// project root (one level up from this scripts directory)
const root = path.resolve(__dirname, '..');
const mappingPath = path.join(root, 'component-packages.json');

// Ensure mapping exists - this file drives which files get packaged per component
if (!fs.existsSync(mappingPath)) {
  console.error('component-packages.json not found. Create it at project root.');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

/**
 * Ensure a directory exists (creates recursively if needed).
 * @param {string} dir - absolute or relative directory path
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Copy a file to a destination, creating destination directory if required.
 * Logs the copy operation to the console.
 */
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
}

/**
 * Package a single component defined in `component-packages.json`.
 * Behavior:
 * - Creates `packages/<name>/dist` and `packages/<name>/src` as needed
 * - Copies listed files from the project into the package
 *   - SCSS files are copied into `packages/<name>/src` with external @import lines removed
 *   - Other files are copied into `packages/<name>/dist`
 * - Copies root `README.md` into the package if present
 * - Copies selected shared Sass files into package src while stripping font-face/font-family references
 *
 * @param {string} name - component key from `component-packages.json`
 */
function packageComponent(name) {
  const pkg = mapping[name];
  if (!pkg) {
    console.error(`No mapping for component '${name}'`);
    return;
  }
  const pkgDir = path.join(root, 'packages', name);
  const distDir = path.join(pkgDir, 'dist');
  ensureDir(distDir);

  // Copy files listed in the mapping. SCSS files are treated specially.
  (pkg.files || []).forEach(rel => {
    const src = path.join(root, rel);
    if (!fs.existsSync(src)) {
      console.warn(`Source not found: ${src}`);
      return;
    }
    const ext = path.extname(rel).toLowerCase();
    if (ext === '.scss') {
      // SCSS files: copy into the component `src/` directory.
      // While copying, remove external URL @import lines (eg Google font imports)
      const srcDir = path.join(pkgDir, 'src');
      ensureDir(srcDir);
      const dest = path.join(srcDir, path.basename(rel));

      try {
        const content = fs.readFileSync(src, 'utf8');
        // Remove any @import lines that reference an external URL (http/https)
        const lines = content.split(/\r?\n/);
        const filtered = lines
          .filter(line => {
            const trimmed = line.trim();
            if (!trimmed.startsWith('@import')) return true;
            // If the import contains an absolute URL, drop it
            if (/https?:\/\//i.test(trimmed)) return false;
            return true;
          })
          .join('\n');
        fs.writeFileSync(dest, filtered, 'utf8');
        console.log(`Copied ${src} -> ${dest} (external imports removed)`);
      } catch (err) {
        // On any read/write error, fall back to a direct copy
        copyFile(src, dest);
      }
    } else {
      // Non-SCSS assets go into `dist/`
      const dest = path.join(distDir, path.basename(rel));
      copyFile(src, dest);
    }
  });

  // Copy project README into the package for documentation
  const readmeSrc = path.join(root, 'README.md');
  if (fs.existsSync(readmeSrc)) {
    copyFile(readmeSrc, path.join(pkgDir, 'README.md'));
  }

  // Copy a small set of shared Sass utility files into the package `src/`.
  // While copying, strip out @font-face blocks and any font-related variable or declarations
  // so packages don't accidentally pull in global font definitions.
  const sharedSrcDir = path.join(root, 'src', 'wmcads', 'assets', 'sass');
  const sharedFiles = [
    path.join(sharedSrcDir, 'shared', '_vars.scss'),
    path.join(sharedSrcDir, 'shared', '_mixins.scss'),
    path.join(sharedSrcDir, 'wmca', '_vars.scss')
  ];

  sharedFiles.forEach(sharedPath => {
    if (!fs.existsSync(sharedPath)) return;
    let baseName = path.basename(sharedPath);
    // Avoid basename collision for wmca/_vars.scss -> write as _wmca_vars.scss
    if (sharedPath.indexOf(path.join('wmca', '_vars.scss')) !== -1) {
      baseName = '_wmca_vars.scss';
    }
    const destPath = path.join(pkgDir, 'src', baseName);
    ensureDir(path.dirname(destPath));
    try {
      let content = fs.readFileSync(sharedPath, 'utf8');
      if (path.basename(sharedPath) === '_vars.scss') {
        // remove @font-face blocks entirely
        content = content.replace(/@font-face\s*{[\s\S]*?}/g, '');
        // remove variable definitions that mention font (e.g., $x-font-family)
        content = content
          .split(/\r?\n/)
          .filter(line => {
            if (/^\s*\$[^:]*font[^:]*:/i.test(line)) return false;
            if (/font-family\s*:/i.test(line)) return false;
            return true;
          })
          .join('\n');
      }
      fs.writeFileSync(destPath, content, 'utf8');
      console.log(`Copied ${sharedPath} -> ${destPath} (filtered)`);
    } catch (err) {
      // Fallback to regular copy on error
      copyFile(sharedPath, destPath);
    }
  });

  console.log(`Packaged component '${name}' into ${pkgDir}`);
}

if (ALL_FLAG) {
  Object.keys(mapping).forEach(name => packageComponent(name));
} else if (componentArg) {
  packageComponent(componentArg);
} else {
  console.error('Usage: node scripts/package-component.js [componentName] | --all');
  process.exit(1);
}
