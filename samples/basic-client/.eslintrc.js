const base = require('../../.eslintrc.typescript.js');
module.exports = {
  ...base,
  parserOptions: {
    project: require('path').join(__dirname, 'tsconfig.json'),
  },
  rules: {
    'no-console': 'off',
  },
};
