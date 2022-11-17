/**
 * 中翻英，分词翻译脚本
 * 全文根据 AST 分割成多个小段，每个小段翻译后再合并。类似于使用划软件翻译的效果。
 * 适用于某些需要翻译 code (```ts) 和 inlineCode (`inline`) 的场景
 * 可以修改 mdFile 文件夹名称，对指定的文件夹或者文件进行翻译。
 * 只要本地环境配置了 google translate API key，运行：node ./script/translationText.mjs  可以使用。
 * respect https://github.com/dephraiim/translate-readme
 */
import { unified } from 'unified';
import parse from 'remark-parse';
import path, { dirname } from 'path';
import fs from 'fs';
import { default as glob } from 'glob';
import stringify from 'remark-stringify';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import { TranslationServiceClient } from '@google-cloud/translate';

// 项目统一信息
const projectId = 'crested-sunup-368006';
const location = 'global';
const targetLanguageCode = 'en';

// 文件信息
const __dirname = dirname(fileURLToPath(import.meta.url));
const mdFile = path.join(__dirname, '../docs/manual/basic');
const allFilesName = glob.sync("*.zh.md", { cwd: mdFile, realpath: true });

// markdown 和 AST 的转换方法
const toMdAST = (md) => unified().use(parse).use(remarkGfm).parse(md);
const toMarkdown = (ast) => {
  return unified().use(stringify).use(remarkGfm).stringify(ast);
};

// 是否为有效的 url
const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
// 是否为数字和英语
const isEnglishOrNumber = (text) => {
  const regx = /^[A-Za-z-1-9]*\.*$/;
  const trimText = text.toString().replace(/ /g,'');
  return regx.test(trimText);
}

const cacheMap = new Map();
let cacheCount = 0;

/**
 * google translate API 请求, 中翻英
 * @param {string[]} originalText
 * @return {Promise<*[]>}
 */
const getTranslatedText = async (originalText) => {
  const translationClient = new TranslationServiceClient();
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: originalText,
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'zh',
    targetLanguageCode,
  };
  let result = [];
  try {
    // Run request
    console.log('request 11');
    const [ response ] = await translationClient.translateText(request);
    for (const translation of response.translations) {
      result.push(translation.translatedText);
    }
  } catch (error) {
    console.log(error, 'request error');
  }
  return result;
}

const isLinkType = (node) => {
  return node.type === 'link';
}
const formatUrl = (url) => url?.replace(/^#/, '');

/**
 * 请求 google 翻译，将翻译结果写入 AST
 * @param mdAST
 * @return {{textMap: Map<string, number>, originalTextArr: string[]}}
 */
const getOriginalTextInfo = (mdAST) => {
  const originalTextArr = [];
  const textMap = new Map();
  let index = 0;

  visit(mdAST, (node) => {
    if (isTranslateText(node)) {
      const nodeVal = node.type === 'link' ? formatUrl(node.url) : node.value;
      // 英文数值不翻译、缓存中有的不翻译、链接不翻译
      console.log(isEnglishOrNumber(nodeVal), cacheMap.has(nodeVal), isValidHttpUrl(nodeVal));
      if (!nodeVal || isEnglishOrNumber(nodeVal) || cacheMap.has(nodeVal) || isValidHttpUrl(nodeVal)) {
        return;
      }
      if (!textMap.has(nodeVal)) {
        originalTextArr.push(nodeVal);
        textMap.set(nodeVal, index);
        index++;
      }
    }
  });
  return { originalTextArr, textMap };
}

// 判断是否为需要翻译的文本
function isTranslateText(node) {
  return node.type === "text" || node.type === "code" || node.type === "link" ;
}

const toInSiteLink = (url) => {
  return `#${url}`;
}
/**
 * 将翻译后的文本写入 AST
 * @param mdAST 翻译前的 markdown AST
 * @param translatedTextList 翻译后的文本
 * @param textMap 原文本和翻译后文本的对应关系
 * @return mdAST 翻译后的 markdown AST
 */
const writeValueToAST = (mdAST, translatedTextList, textMap) => {
  visit(mdAST, (node) => {
    const nodeVal = node.type === 'link' ? formatUrl(node.url) : node.value;
    if (isValidHttpUrl(nodeVal) || isEnglishOrNumber(nodeVal)) {
      return;
    }

    if (isLinkType(node)) {
      if (cacheMap.has(nodeVal)) {
        cacheCount++;
        node.url = toInSiteLink(cacheMap.get(nodeVal));
        return;
      }
      const valueIndex = textMap.get(nodeVal);
      node.url = toInSiteLink(translatedTextList[valueIndex]);
      cacheMap.set(nodeVal, translatedTextList[valueIndex]);
    } else if (isTranslateText(node)) {
      if (cacheMap.has(nodeVal)) {
        cacheCount++;
        node.value = cacheMap.get(nodeVal);
        return;
      }
      const valueIndex = textMap.get(nodeVal);
      node.value = translatedTextList[valueIndex];
      cacheMap.set(nodeVal, translatedTextList[valueIndex]);
    }
  });
  return mdAST;
}

/**
 * 将 AST 转换为 markdown 写入文件
 * @param pathName
 * @param mdAST
 * @return {Promise<void>}
 */
const writeToFile = async (pathName, mdAST) => {
  const writePath = pathName.replace('.zh.md', '.en.md');
  fs.writeFileSync(
    writePath,
    toMarkdown(mdAST),
    "utf8"
  );
  console.log(`${writePath} written`);
}

/**
 * 将中文 markdown 转换为英文 markdown
 * eg: api/README.zh.md -> api/README.en.md
 * 获取文件内容 -> 转换为 AST -> 提取文字 -> 翻译 -> 写入 AST -> 转换为 markdown -> 写入文件
 */
allFilesName.forEach(async (pathName) => {
  const mdContent = fs.readFileSync(pathName, 'utf8');
  const mdAST = toMdAST(mdContent);
  const { originalTextArr, textMap } = getOriginalTextInfo(mdAST);
  console.log(originalTextArr, 'originalTextList', originalTextArr.length);
  const translatedAllText = await getTranslatedText(originalTextArr);
  writeValueToAST(mdAST, translatedAllText, textMap);
  console.log(translatedAllText, 'translatedAllText', translatedAllText.length);
  await writeToFile(pathName, mdAST);
});
console.log(cacheCount, 'cacheCount used');
