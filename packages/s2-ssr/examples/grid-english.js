/**
 * @file Grid Pivot Table Example with English Labels
 * @description Reference from s2-site/examples/basic/pivot/demo/grid.ts
 * @see https://s2.antv.antgroup.com/examples/basic/pivot#grid
 */

/* eslint-disable no-console */

// Must be set BEFORE importing @antv/s2-ssr
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

const path = require('path');
const { createSpreadsheet } = require('../dist/s2-ssr.cjs');

// English data with international countries and cities
const data = [
  {
    country: 'United States',
    city: 'New York',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 12500,
  },
  {
    country: 'United States',
    city: 'New York',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 8900,
  },
  {
    country: 'United States',
    city: 'New York',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 3200,
  },
  {
    country: 'United States',
    city: 'New York',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 4100,
  },
  {
    country: 'United States',
    city: 'Los Angeles',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 9800,
  },
  {
    country: 'United States',
    city: 'Los Angeles',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 7600,
  },
  {
    country: 'United States',
    city: 'Los Angeles',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 2800,
  },
  {
    country: 'United States',
    city: 'Los Angeles',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 3500,
  },
  {
    country: 'United Kingdom',
    city: 'London',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 8700,
  },
  {
    country: 'United Kingdom',
    city: 'London',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 6500,
  },
  {
    country: 'United Kingdom',
    city: 'London',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 2400,
  },
  {
    country: 'United Kingdom',
    city: 'London',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 3100,
  },
  {
    country: 'United Kingdom',
    city: 'Manchester',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 5400,
  },
  {
    country: 'United Kingdom',
    city: 'Manchester',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 4200,
  },
  {
    country: 'United Kingdom',
    city: 'Manchester',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 1800,
  },
  {
    country: 'United Kingdom',
    city: 'Manchester',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 2300,
  },
  {
    country: 'Germany',
    city: 'Berlin',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 7200,
  },
  {
    country: 'Germany',
    city: 'Berlin',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 5800,
  },
  {
    country: 'Germany',
    city: 'Berlin',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 2100,
  },
  {
    country: 'Germany',
    city: 'Berlin',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 2700,
  },
  {
    country: 'Germany',
    city: 'Munich',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 6100,
  },
  {
    country: 'Germany',
    city: 'Munich',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 4900,
  },
  {
    country: 'Germany',
    city: 'Munich',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 1900,
  },
  {
    country: 'Germany',
    city: 'Munich',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 2500,
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 11200,
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 9100,
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 2900,
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 3800,
  },
  {
    country: 'Japan',
    city: 'Osaka',
    category: 'Electronics',
    sub_category: 'Laptop',
    sales: 7800,
  },
  {
    country: 'Japan',
    city: 'Osaka',
    category: 'Electronics',
    sub_category: 'Phone',
    sales: 6300,
  },
  {
    country: 'Japan',
    city: 'Osaka',
    category: 'Apparel',
    sub_category: 'Shirts',
    sales: 2200,
  },
  {
    country: 'Japan',
    city: 'Osaka',
    category: 'Apparel',
    sub_category: 'Shoes',
    sales: 2900,
  },
];

const dataCfg = {
  fields: {
    rows: ['country', 'city'],
    columns: ['category', 'sub_category'],
    values: ['sales'],
  },
  meta: [
    {
      field: 'country',
      name: 'Country',
    },
    {
      field: 'city',
      name: 'City',
    },
    {
      field: 'category',
      name: 'Category',
    },
    {
      field: 'sub_category',
      name: 'Sub Category',
    },
    {
      field: 'sales',
      name: 'Sales ($)',
    },
  ],
  data,
};

const options = {
  width: 600,
  height: 480,
  hierarchyType: 'grid',
  // Custom corner field text, default is "Values"
  cornerExtraFieldText: 'Metrics',
  interaction: {
    copy: {
      enable: true,
      withFormat: true,
      withHeader: true,
    },
  },
};

async function main() {
  console.log('Creating grid pivot table with English labels...');

  const spreadsheet = await createSpreadsheet({
    sheetType: 'pivot',
    width: options.width,
    height: options.height,
    dataCfg,
    options,
    autoFit: true,
    devicePixelRatio: 2,
    imageType: 'png',
  });

  // Export to PNG file
  const outputPath = path.join(__dirname, 'output', 'grid-english.png');

  spreadsheet.exportToFile(outputPath);
  console.log(`Exported to: ${outputPath}`);

  // Clean up
  spreadsheet.destroy();
}

main().catch(console.error);
