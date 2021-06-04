// @ts-check
const {
  task,
  series,
  tscTask,
  jestTask,
  parallel,
  eslintTask,
  prettierCheckTask,
  prettierTask,
} = require('just-scripts');
const glob = require('glob');
const path = require('path');

task('ts', tscTask({ build: true }));

task('test', jestTask({ passWithNoTests: true }));

task('prettier:check', prettierCheckTask({ files: ['packages/*/src/**/*.ts'] }));
task('prettier:fix', prettierTask({ files: ['packages/*/src/**/*.ts'] }));

const lintTasks = glob
  .sync('./packages/**/.eslintrc.js')
  .map((config) => eslintTask({ files: [path.dirname(config)], configPath: config }));
task('lint', lintTasks.length ? parallel(...lintTasks) : () => {});

task('ci', series('ts', parallel('test', 'lint', 'prettier:check')));
