/**
 * respect https://github.com/dephraiim/translate-readme
 * Markdown 中翻英脚本
 */
import { unified } from 'unified';
import parse from 'remark-parse';
import path from 'path';
import fs from 'fs';
import stringify from 'remark-stringify';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';
import { TranslationServiceClient } from '@google-cloud/translate';

// 项目统一信息
const projectId = 'crested-sunup-368006';
const location = 'global';
const targetLanguageCode = 'en';

// 文件信息
const __dirname = dirname(fileURLToPath(import.meta.url));
const mdFile = path.join(__dirname, 'README.md');
const mdContent = fs.readFileSync(mdFile, 'utf8');

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
const mdAST = toMdAST(mdContent);
const originalText = [];
visit(mdAST, async (node) => {
  if (node.type === "text") {
    originalText.push(node.value);
    const translatedText = await translateText(node.value);
    node.value = translatedText[0];
  }
});
const translatedTextArray = originalText.map(async (text) => {
  return await translateText(text);
});

async function writeToFile() {
  await Promise.all(translatedTextArray);
  fs.writeFileSync(
    path.join(__dirname, `README.${targetLanguageCode}.md`),
    toMarkdown(mdAST),
    "utf8"
  );
  console.log(`README.${targetLanguageCode}.md written`);
}

writeToFile();

