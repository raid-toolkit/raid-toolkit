const base = require('../../.eslintrc.react.js');
module.exports = {
  ...base,
  parserOptions: {
    project: require('path').join(__dirname, 'tsconfig.json'),
  },
};
