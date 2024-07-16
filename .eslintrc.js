require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'airbnb-base/legacy',
    'prettier',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
    'vue/setup-compiler-macros': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { tsconfigRootDir: __dirname },
  plugins: ['@typescript-eslint', 'import', 'vue'],
  settings: {
    jest: {
      version: 26,
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': [
      2,
      {
        endOfLine: 'lf',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 80,
        proseWrap: 'never',
        overrides: [
          { files: '.eslintrc', options: { parser: 'json' } },
          { files: '.prettierrc', options: { parser: 'json' } },
        ],
        plugins: [
          require.resolve('prettier-plugin-packagejson'),
          require.resolve('prettier-plugin-organize-imports'),
        ],
        pluginSearchDirs: false,
      },
    ],
    'import/no-duplicates': [2, { considerQueryString: true }],
    'import/no-deprecated': 1,
    'import/no-cycle': 1,
    'import/order': [
      2,
      {
        warnOnUnassignedImports: false,
      },
    ],
    'import/no-default-export': 0,
    'no-restricted-syntax': 0,
    semi: 0,
    'no-console': 2,
    'no-case-declarations': 0,
    'consistent-return': 0,
    'import/no-extraneous-dependencies': 2,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': [
      2,
      {
        allowAfterThis: true,
      },
    ],
    'no-plusplus': 0,
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'import/no-named-default': 0,
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    ],
    'react/sort-comp': 2,
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': [2],
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': [1],
    'no-alert': 2,
    'no-caller': 2,
    'no-else-return': 2,
    'no-useless-return': 2,
    'no-extra-bind': 2,
    'no-magic-numbers': 0,
    'no-self-compare': 2,
    'no-multi-spaces': 2,
    'require-await': 2,
    'no-multi-assign': 2,
    'no-var': 2,
    'no-useless-rename': 2,
    'object-shorthand': 2,
    'prefer-arrow-callback': 2,
    'prefer-const': 2,
    'max-statements-per-line': [2, { max: 1 }],
    'max-params': [2, 4],
    'no-unreachable': 2,
    'no-useless-computed-key': 2,
    'block-spacing': [2, 'always'],
    'lines-between-class-members': [2, 'always'],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/no-non-null-asserted-optional-chain': 0,
    'no-unsafe-optional-chaining': 0,
    'default-param-last': 0,
    '@typescript-eslint/ban-ts-comment': 1,
    eqeqeq: [
      2,
      'always',
      {
        null: 'ignore',
      },
    ],
    curly: [2, 'all'],
    'guard-for-in': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-reserved-component-names': 0,
    'vue/prefer-import-from-vue': 1,
    'no-nested-ternary': [2],
    'no-restricted-imports': [
      2,
      {
        paths: [
          {
            name: 'lodash',
            importNames: ['default'],
            message:
              '\n 请不要全量引入 lodash \n 推荐 `import { get } from "lodash"` 的方式',
          },
        ],
        patterns: ['lodash/*', 'lodash-es/*', 'lodash-es'],
      },
    ],
    'line-comment-position': [2, { position: 'above' }],
    'new-cap': 2,
    'prefer-template': 2,
    'no-useless-rename': 2,
    // 'arrow-body-style': [
    //   2,
    //   'as-needed',
    //   { requireReturnForObjectLiteral: true },
    // ],
    'no-promise-executor-return': 2,
    'no-unneeded-ternary': 2,
    'array-callback-return': 2,
    'dot-notation': 0,
    'prefer-named-capture-group': 1,
    'eol-last': [2, 'always'],
    'max-lines-per-function': [
      2,
      { max: 120, skipBlankLines: true, skipComments: true },
    ],
    // 'multiline-comment-style': [2, 'starred-block'],
    'lines-around-comment': [
      2,
      {
        ignorePattern: 'pragma',
        beforeBlockComment: false,
        allowBlockStart: true,
        allowObjectStart: true,
        allowArrayStart: true,
        allowClassStart: true,
      },
    ],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },
      { blankLine: 'always', prev: 'if', next: '*' },
    ],
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
    },
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        'import/no-default-export': 2,
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'react-hooks/exhaustive-deps': 1,
        'react-hooks/rules-of-hooks': 2,
        'max-lines-per-function': 0,
      },
    },
    {
      files: ['*-spec.tsx', '*-spec.ts'],
      rules: {
        'max-lines-per-function': 0,
        'line-comment-position': 0,
        'import/order': 0,
      },
    },
  ],
};
