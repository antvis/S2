const { execSync } = require('child_process');
const { getCurrentBranch } = require('./util');

const branch = getCurrentBranch();

if (branch !== 'latest') {
  console.log('❌ 只允许在 latest 分支执行该命令');
  process.exit(1);
}

execSync("git commit --allow-empty -m 'chore(release): bump version'");
console.log('✅ release commit 创建完成');
process.exit(0);
