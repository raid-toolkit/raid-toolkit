const glob = require('glob');
const path = require('path');

module.exports = {
  projects: glob.sync('./packages/**/jest.config.js').map((config) => `<rootDir>/${path.relative(__dirname, config)}`),
};
