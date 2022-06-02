const fs = require('fs');
const path = require('path');

module.exports = function createRewriter(
  libName,
  {
    mainPath = 'lib/index.js',
    modulePath = 'esm/index.js',
    typesPath = 'temp/index.d.ts',
  } = {},
) {
  let originalPackageConfig = null;
  let packagePath = null;

  function rewritePackage() {
    const packageRelativePath = `../packages/${libName}/package.json`;
    packagePath = path.join(__dirname, packageRelativePath);

    if (!fs.existsSync(packagePath)) {
      return;
    }

    originalPackageConfig = require(packageRelativePath);
    const copySharedPackage = { ...originalPackageConfig };
    // 配合 tsconfig.declaration.json 配置的声明文件导出路径
    copySharedPackage.main = mainPath;
    copySharedPackage.module = modulePath;
    copySharedPackage.types = typesPath;
    fs.writeFileSync(
      packagePath,
      JSON.stringify(copySharedPackage, null, 2) + '\n',
    );
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
  return {
    rewritePackage,
    restorePackage,
  };
};
