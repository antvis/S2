const { prompt } = require('inquirer');
const { execSync } = require('child_process');
const glob = require('glob');
const ora = require('ora');

async function main() {
  const spinner = ora('读取测试文件中...').start();
  const paths = glob.sync(`!(node_modules)/**/*-spec.ts?(x)`);

  const defaultSelectedIndex = paths.findIndex(
    (p) => p === 'tests/spreadsheet/spread-sheet-spec.tsx',
  );
  spinner.stop();

  const selectedPath = await prompt([
    {
      type: 'rawlist',
      message: '📢 请选择测试文件 (输入序号可快速选择)',
      name: 'path',
      choices: paths,
      default: () => defaultSelectedIndex,
    },
  ]);

  const jestSpinner = ora('测试运行中...').start();
  try {
    execSync(`DEBUG_MODE=1 npx jest ${selectedPath.path}`);
    jestSpinner.succeed('测试运行完成.');
  } catch (error) {
    jestSpinner.fail();
  }
}

main();
