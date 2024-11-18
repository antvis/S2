/* eslint-disable import/no-extraneous-dependencies */
import { execSync } from 'child_process';
import { glob } from 'glob';
import { default as inquirer } from 'inquirer';
import { default as autoCompletePrompt } from 'inquirer-autocomplete-prompt';
import ora from 'ora';

inquirer.registerPrompt('autocomplete', autoCompletePrompt);

function run(path) {
  const command = `cross-env DEBUG_MODE=1 npx jest ${path} --passWithNoTests`;
  const jestSpinner = ora(`[测试运行中]: ${command}`).start();

  try {
    execSync(command);
    jestSpinner.succeed('测试运行完成.');
  } catch (error) {
    jestSpinner.fail();
  }
}

async function main() {
  const spinner = ora('读取测试文件中...').start();
  const paths = glob.sync(`!(node_modules)/**/*-spec.ts?(x)`);

  const customPath = process.argv[2];
  const defaultPath =
    customPath || '__tests__/spreadsheet/spread-sheet-spec.tsx';

  spinner.stop();

  if (customPath) {
    run(customPath);

    return;
  }

  const selectedPath = await inquirer.prompt([
    {
      type: 'autocomplete',
      message:
        '📢 请选择测试文件 (支持文件名搜索, 直接回车默认 spread-sheet-spec 🔍 )',
      emptyText: '未匹配到测试文件',
      name: 'path',
      loop: true,
      pageSize: 10,
      default: defaultPath,
      source: (_, input) => {
        return Promise.resolve(
          input ? paths.filter((path) => path.includes(input)) : paths,
        );
      },
      validate: (val) => (val ? true : '未选择测试文件!'),
    },
  ]);

  run(selectedPath.path);
}

main();
