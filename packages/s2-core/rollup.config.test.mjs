import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import configs from './rollup.config.mjs';

const replace = configs[0].plugins.find((plugin) => plugin.name === 'replace');

function transform(code) {
  return replace.transform(code, 'env-fixture.ts')?.code ?? code;
}

const accessForms = [
  'process.env.NODE_ENV',
  "process.env['NODE_ENV']",
  'process.env["NODE_ENV"]',
];

for (const access of accessForms) {
  test(`replaces ${access} with the production environment`, () => {
    assert.equal(
      transform(`const value = ${access};`),
      'const value = "production";',
    );
    assert.equal(transform(access), '"production"');
    assert.equal(
      transform(`${access} === 'test'`),
      '"production" === \'test\'',
    );
  });

  test(`does not replace assignments to ${access}`, () => {
    const code = `${access} = 'test';`;

    assert.equal(transform(code), code);
  });

  for (const prefix of ['other', '$', 'object.', 'object?.']) {
    test(`does not replace ${access} after ${prefix}`, () => {
      const code = `const value = ${prefix}${access};`;

      assert.equal(transform(code), code);
    });
  }

  test(`does not replace nested property access after ${access}`, () => {
    const code = `const value = ${access}.length;`;

    assert.equal(transform(code), code);
  });
}

test('does not replace another environment variable', () => {
  const code = [
    'process.env.NODE_ENV_EXTRA',
    'process.env.NODE_ENV$other',
    "process.env['NODE_ENV_EXTRA']",
    'process.env["NODE_ENV_EXTRA"]',
  ].join(';');

  assert.equal(transform(code), code);
});

test('replaces the environment check in the actual table export source', async () => {
  const code = await readFile(
    new URL('./src/utils/export/copy/table-copy.ts', import.meta.url),
    'utf8',
  );
  const transformed = transform(code);

  assert.ok(transformed.includes('"production" === \'test\''));
  assert.ok(!transformed.includes("process.env['NODE_ENV']"));
});
