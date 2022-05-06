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
  const reactContent = content.replace(/class/g, 'className');
  return `export const ${name}: FC = () =>  ( ${reactContent} )`;
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
  writeFileSync(resolve(outputDir, 'svg.tsx'), fileContent);
};

const files = listSvgFiles(resolve(__dirname, '../src/svg'));

writeVueComponents(resolve(__dirname, '../src/svg/vue'), files);
writeReactComponents(resolve(__dirname, '../src/svg/react'), files);
