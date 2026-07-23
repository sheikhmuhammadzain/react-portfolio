module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    // JS project without TS - propTypes boilerplate everywhere isn't worth it
    'react/prop-types': 'off',
    // allow intentional `while (true)` stream-read loops
    'no-constant-condition': ['error', { checkLoops: false }],
    // `_`-prefixed args are intentionally unused (e.g. Express error handler arity)
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // Node contexts: backend + config files (process, require, etc.)
      files: ['backend/**/*.js', '*.config.js'],
      env: { node: true },
    },
  ],
}
