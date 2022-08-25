const { execSync } = require('child_process');
const corePkg = require('@antv/s2/package.json');
const reactPkg = require('../packages/s2-react/package.json');
const vuePkg = require('../packages/s2-vue/package.json');
const sharedPkg = require('@antv/s2-shared/package.json');

const branchList = ['alpha', 'next', 'beta', 'master'];

function getCurrentBranch() {
  return execSync('git symbolic-ref --short -q HEAD')
    .toString()
    .trim()
    .toLowerCase();
}

function bootstrap() {
  const branch = getCurrentBranch();

  if (!branchList.includes(branch)) {
    console.log('[SKIP] 非发布分支, 跳过检查...');
    process.exit(0);
  }

  console.log(`🕵️‍♀️ 发布版本 version 检查, 当前分支 (${branch})`);

  const versionStatus = [reactPkg, vuePkg, sharedPkg].map(
    ({ name, version, devDependencies }) => {
      const devDepVersion = devDependencies['@antv/s2'];

      console.log(
        `📦 [${name}] version: ${version} | @antv/s2 devDependencies version: ${devDepVersion}`,
      );

      return {
        name,
        devDepVersion,
        pass: devDepVersion.includes(corePkg.version),
      };
    },
  );

  console.log('\r\n');

  const isValidDevDepVersion = versionStatus.every(({ pass }) => pass);

  if (!isValidDevDepVersion) {
    versionStatus
      .filter(({ pass }) => !pass)
      .forEach(({ name }) => {
        console.error(
          `⛑ 请将 ${name} 下的 devDependencies @antv/s2 版本修改为: ${corePkg.version} \r\n`,
        );
      });
    process.exit(1);
  }

  console.log('✅ 发布版本 version 检查通过 \r\n');
  process.exit(0);
}

bootstrap();
