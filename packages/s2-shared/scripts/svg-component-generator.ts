import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, resolve } from 'path';

type SvgIconInfo = { name: string; content: string };

const readSvgFile = (filePath: string): SvgIconInfo => {
  const name = basename(filePath, '.svg');
  const content = readFileSync(filePath, { encoding: 'utf-8' });
  return { name, content };
};

const listSvgFiles = (dir: string) => {
  const filePathList = readdirSync(dir)
    .filter((it) => it.endsWith('.svg'))
    .map((it) => resolve(dir, it));
  return filePathList.map(readSvgFile);
};

const vueSvgTemplate = ({ name, content }: SvgIconInfo) => {
  return `<template>
${content}
</template>
<script> 
export default {
name: '${name}',
}
</script>`;
};

const ReactSvgTemplate = ({ name, content }: SvgIconInfo) => {
  const reactContent = content
    .replace(/class/g, 'className')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/stroke-width/g, 'strokeWidth');
  // 将短横线链接的文件名替换为驼峰式命名
  const reactName = name
    .split('-')
    .map((it) => it.charAt(0).toUpperCase() + it.slice(1))
    .join('');
  return `export const ${reactName}: FC = () =>  ( ${reactContent} )`;
};

const writeVueComponents = (outputDir: string, icons: SvgIconInfo[]) => {
  const fileContentList = icons.map((it) => [it.name, vueSvgTemplate(it)]);
  for (const [name, content] of fileContentList) {
    writeFileSync(resolve(outputDir, `${name}.vue`), content);
  }
};

const writeReactComponents = (outputDir: string, icons: SvgIconInfo[]) => {
  let fileContent = `import React, { FC } from 'react';
import './index.less'; 

`;
  fileContent += icons.map((it) => ReactSvgTemplate(it)).join('\n\n');
  writeFileSync(resolve(outputDir, 'index.tsx'), fileContent);
};

const files = listSvgFiles(resolve(__dirname, '../src/icons'));

writeVueComponents(
  resolve(__dirname, '../../s2-vue/src/components/icons'),
  files,
);
writeReactComponents(
  resolve(__dirname, '../../s2-react/src/components/icons'),
  files,
);
