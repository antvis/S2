// Setup CSS/LESS/SVG extensions BEFORE importing the package
// This must be done first because the package imports @antv/s2 which requires CSS files
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

// Setup Node.js environment for SSR testing
// This file imports the env module from the built package
require('../dist/s2-ssr.cjs');
