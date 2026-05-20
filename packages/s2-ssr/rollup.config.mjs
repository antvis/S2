import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/s2-ssr.cjs',
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        plugins: [
            nodePolyfills(),
            resolve({
                preferBuiltins: true,
            }),
            commonjs(),
            json(),
            typescript({
                tsconfig: 'tsconfig.build.json',
            }),
            terser(),
        ],
        // Mark @antv/s2 as external - requires setting up browser globals in Node.js environment
        external: ['fs', 'path', 'canvas', '@antv/s2', /^@antv\/s2\//],
    },
];
