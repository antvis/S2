import translateDoc from "@stone-lyl/google-translate-script/src/translateDoc.mjs";
import { fileURLToPath } from "url";
import { toHtml } from 'hast-util-to-html'
import { resolve } from 'path';
import { readdir } from 'fs/promises';

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      console.log('res', res);
      console.log('dirent', dirent);
      yield res;
      yield* getFiles(res);
    }
  }
}
// 这里是获取 docs 下所有的文件夹路劲
const rootDirPath = '[你的绝对路径]/s2-site/docs';
let allFilePath = [];
(async () => {
  for await (const f of getFiles(rootDirPath)) {
    allFilePath.push(f);
  }
  console.log(allFilePath);
})();

allFilePath.forEach((fileName) => {
  translateDoc({
    fileName: fileName,
    dirname: fileURLToPath(import.meta.url),
    sourceSuffix: '.zh.md',
    targetSuffix: '.en.md',
    projectInfo: {
      projectId: 'crested-sunup-368006', // 替换成本地的 projectId
    },
    isKeepHtml: true,
    customHtmlCallBack: (type, h, node) => {
      if (type !== 'embed' && type !== 'playground') {
        return;
      }
      // embed 时，没有后闭合标签，所以需要手动添加
      if (node.properties && node.properties.dataMdast === 'html') {
        node.properties.dataMdast = undefined;
        let value = toHtml(node, { space: type });
        if (type === 'embed') {
          value = value.replace(/zh.md/g, 'en.md') + '</embed>';
        }
        return h(node, 'html', value);
      }
    }
  });
})

/**
 * todo:
 * 1. <Playground > </Playground> 这类 web Component 无法识别，并进行翻译。
 * 2. markdown 引入文档：`markdown:docs/common/custom/customTreeNode.zh.md` 替换为  en.md
 */
