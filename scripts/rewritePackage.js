const fs = require('fs');
const path = require('path');

let originalPackageConfig = null;
let packagePath = null;

function rewritePackage(libName) {
  const packageRelativePath = `../packages/${libName}/package.json`;
  packagePath = path.join(__dirname, packageRelativePath);

  if (!fs.existsSync(packagePath)) {
    return;
  }

  originalPackageConfig = require(packageRelativePath);
  const copySharedPackage = { ...originalPackageConfig };
  // 配合 tsonfig.declaration.json配置的声明文件导出路径
  copySharedPackage.types = './temp/index.d.ts';
  fs.writeFileSync(packagePath, JSON.stringify(copySharedPackage, null, 2));
}

function restorePackage() {
  if (!packagePath || !originalPackageConfig) {
    return;
  }

  fs.writeFileSync(
    packagePath,
    JSON.stringify(originalPackageConfig, null, 2) + '\n',
  );
}

module.exports = {
  rewritePackage,
  restorePackage,
};
