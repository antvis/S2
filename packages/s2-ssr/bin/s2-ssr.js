#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

const fs = require('fs');
const cac = require('cac');

// Setup CSS/LESS/SVG extensions BEFORE importing the package
// This must be done first because the package imports @antv/s2 which requires CSS files
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

// Import env setup from built package (this sets up Node.js globals)
const { setupNodeEnvironment } = require('../dist/s2-ssr.cjs');

setupNodeEnvironment();

// Now load the actual module and CLI logic
const { createSpreadsheet } = require('../dist/s2-ssr.cjs');
const { version } = require('../package.json');

const cli = cac();

cli.version(version);

cli.command('version', 'Show version').action(() => {
  console.log(version);
});

cli
  .command('export', 'Export spreadsheet to image')
  .option('-i, --input <file>', 'Input specification file (JSON)')
  .option('-o, --output <file>', 'Output file path')
  .option('-t, --type <type>', 'Sheet type: pivot or table', {
    default: 'pivot',
  })
  .option('-w, --width <number>', 'Width in pixels', { default: 800 })
  .option('-h, --height <number>', 'Height in pixels', { default: 600 })
  .option('--image-type <type>', 'Image type: png or jpeg', { default: 'png' })
  .option('--output-type <type>', 'Output type: image, svg, or pdf', {
    default: 'image',
  })
  .option('--wait <ms>', 'Wait time for rendering in milliseconds', {
    default: 100,
  })
  .action(async (options) => {
    const { input, output, type, width, height, imageType, outputType, wait } =
      options;

    if (!input) {
      console.error('Error: Input file is required');
      process.exit(1);
    }

    if (!output) {
      console.error('Error: Output file is required');
      process.exit(1);
    }

    // Read input specification
    const specContent = fs.readFileSync(input, 'utf-8');
    const spec = JSON.parse(specContent);

    // Create spreadsheet and export
    const spreadsheet = await createSpreadsheet({
      sheetType: spec.sheetType || type,
      width: spec.width || parseInt(width, 10),
      height: spec.height || parseInt(height, 10),
      imageType: spec.imageType || imageType,
      outputType: spec.outputType || outputType,
      waitForRender: spec.waitForRender || parseInt(wait, 10),
      dataCfg: spec.dataCfg,
      options: spec.options,
    });

    spreadsheet.exportToFile(output);
    spreadsheet.destroy();
    console.log(`Exported to: ${output}`);
  });

cli.help();
cli.parse();
