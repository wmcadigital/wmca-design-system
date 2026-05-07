let del; // `del` is ESM-only in newer versions; import dynamically
const fs = require('fs');
const paths = require('./paths');

const cleaningDir = async () => {
  if (!del) {
    const mod = await import('del');
    del = mod.default || mod;
  }

  // Prefer the named async API if present
  if (del && typeof del.deleteAsync === 'function') {
    await del.deleteAsync([paths.output, paths.logs.sourcemaps, paths.clean.a11y, paths.clean.tmp]);
  } else {
    const delFn = (del && del.default) || del;
    await delFn([paths.output, paths.logs.sourcemaps, paths.clean.a11y, paths.clean.tmp]);
  }

  // Recreate the build output directory so downstream tasks that read from
  // it (linting, server, etc.) don't fail with ENOENT.
  try {
    fs.mkdirSync(paths.output, { recursive: true });
  } catch (e) {
    // ignore errors creating directory
  }

  return Promise.resolve();
};

module.exports = cleaningDir;
