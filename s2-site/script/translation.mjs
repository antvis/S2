/**
 * respect https://github.com/dephraiim/translate-readme
 * Markdown 中翻英脚本
 */
import { unified } from 'unified';
import parse from 'remark-parse';
import path, { dirname } from 'path';

import fs from 'fs';
import { default as glob } from 'glob';
import stringify from 'remark-stringify';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';
import { TranslationServiceClient } from '@google-cloud/translate';

// 项目统一信息
const projectId = 'crested-sunup-368006';
const location = 'global';
const targetLanguageCode = 'en';

// 文件信息
const __dirname = dirname(fileURLToPath(import.meta.url));

const mdFile = path.join(__dirname, '../docs/api/basic-class');
const allFilesName = glob.sync("*.zh.md", { cwd: mdFile, realpath: true });

// markdown 和 AST 的转换方法
const toMdAST = (md) => unified().use(parse).parse(md);
const toMarkdown = (ast) => {
  return unified().use(stringify).stringify(ast);
};

/**
 * 中翻英，翻译方法
 * @param {string} originalText
 * @return {Promise<*[]>}
 */
const translateText = async (originalText) => {
  const translationClient = new TranslationServiceClient();
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [ originalText ],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'zh',
    targetLanguageCode,
  };
  const result = [];
  // Run request
  try {
    const [ response ] = await translationClient.translateText(request);
    for (const translation of response.translations) {
      result.push(translation.translatedText);
    }
  } catch (error) {
    console.log(error, 'request error');
  }
  return result;
}

// 请求 google 翻译，将翻译结果写入 AST
const getOriginalAllText = (mdAST) => {
  const originalText = [];
  visit(mdAST, async (node) => {
    if (node.type === "text" || node.type === "code") {
      originalText.push(node.value);
      const translatedText = await translateText(node.value);
      node.value = translatedText[0];
    }
  });
  return originalText;
}

const translatedTextArray = (originalTextList) => originalTextList.map(async (text) => {
  return await translateText(text);
});

const writeToFile = async (pathName, mdAST) => {
  const writePath = pathName.replace('.zh.md', '.en.md');
  fs.writeFileSync(
    writePath,
    toMarkdown(mdAST),
    "utf8"
  );
  console.log(`${writePath} written`);
}

allFilesName.forEach(async (pathName) => {
  // 获取文件内容 -> 转换为 AST -> 提取文字 -> 翻译 -> 写入 AST -> 转换为 markdown -> 写入文件
  const mdContent = fs.readFileSync(pathName, 'utf8');
  const mdAST = toMdAST(mdContent);
  const originalTextList = getOriginalAllText(mdAST);
  await Promise.all(translatedTextArray(originalTextList));
  await writeToFile(pathName, mdAST);
});

