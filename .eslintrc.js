module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['eslint-plugin-tsdoc'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // Documentation follows the TSDoc standard (custom tags are declared in tsdoc.json).
        'tsdoc/syntax': 'error',
      },
    },
  ],
};
