const reset = !!process.env.RESET;

const coreRewriter = require('./rewriter')(
  's2-core',
  reset
    ? {
        modulePath: 'src/index.ts',
        typesPath: 'src/index.ts',
      }
    : {
        typesPath: 'esm/index.d.ts',
      },
);

coreRewriter.rewritePackage();
