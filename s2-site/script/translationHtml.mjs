import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype, { defaultHandlers as mdDefaultHandlers } from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify'
import remarkStringify from 'remark-stringify';
import rehypeParse from 'rehype-parse'
import rehypeRemark, { defaultHandlers } from 'rehype-remark'
import fs from "fs";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import { default as glob } from 'glob';
import { toHtml } from 'hast-util-to-html'
import { TranslationServiceClient } from "@google-cloud/translate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mdFile = path.join(__dirname, '../docs/manual/basic');
const allZhFilesName = glob.sync("test.zh.md", { cwd: mdFile, realpath: true });

/**
 * <tag foo="bar"> -> <tag data-mdast="html" foo="bar">
 * @param {string} value
 */
function addAttrIntoHtml(value) {
  return value.replace(/^<(\w+)/, '<$1 data-mdast="html"');
}

/**
 * 去掉文件头部的 yaml,
 * e.g.
 * ---
 * title: <title>
 * order: <order>
 * ---
 * @type {RegExp}
 */
const yamlRegx = /---[\s\S]*?---/;

/**
 * @param content
 * @return {*}
 */
function removeFileHead(content) {
  return content.replace(yamlRegx, '');
}

const mdToHtml = async (filePath) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        code: (h, node) => {
          // google translate sb, 会吞掉 code 中的空格，所以，将空格替换成 &nbsp;
          node.value = node.value.replace(/ /g, '&nbsp;');
          return mdDefaultHandlers.code(h, node);
        },
        html: (h, node) => {
          node.value = addAttrIntoHtml(node.value);
          return mdDefaultHandlers.html(h, node);
        }
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const content = removeFileHead(fs.readFileSync(filePath, 'utf8'));
  const file = await processor
    .process(content);

  return String(file);
}

/**
 * 将中文的HTML 翻译成 英文的HTML
 * @return {Promise<html[]>}
 * @param originalHtml
 * @param mimeType
 */
export const getTranslatedText = async (originalHtml, mimeType = 'text/html') => {
  // 项目统一信息
  const projectId = 'crested-sunup-368006';
  const location = 'global';
  const targetLanguageCode = 'en';
  const translationClient = new TranslationServiceClient();
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    // 因为 google translate 会忽略 \n ，所以这里需要把 \n 替换成 'ų'
    contents: originalHtml.map(it => it.replace(/\n/g, 'ų')),
    mimeType, // mime types: text/plain, text/html
    sourceLanguageCode: 'zh',
    targetLanguageCode,
  };
  let result = [];
  try {
    // Run request
    console.log('request 11');
    const [ response ] = await translationClient.translateText(request);
    for (const translation of response.translations) {
      result.push(translation.translatedText.replace(/ų/g, '\n'));
    }
  } catch (error) {
    console.log(error, 'request error');
  }
  return result;
}

/**
 * 为了保留以前的英语文档头部的 yaml，因为在目录中有使用到
 * @param writePath
 * @param file
 * @return {string}
 */
function getEnFileContent(writePath, file) {
  const readFileContent = fs.readFileSync(writePath, 'utf8');
  return readFileContent.match(yamlRegx)[0] + '\n\n' + String(file);
}

const HtmlToMd = async (html, writePath) => {
  // 当一个 html 标签，带有 data-mdast="html" 属性时，不会被转换成 md
  const getCustomHandler = (type, h, node) => {
    if (node.properties && node.properties.dataMdast === 'html') {
      return h(node, 'html', toHtml(node, { space: 'html' }))
    }
    return defaultHandlers[type](h, node);
  };
  const file = await unified()
    .use(rehypeParse)
    .use(remarkGfm)
    .use(rehypeRemark, {
      handlers: {
        img: (h, node) => getCustomHandler('img', h, node),
        playground: (h, node) => getCustomHandler('playground', h, node),
        table: (h, node) => getCustomHandler('table', h, node),
        pre: (h, node) => {
          // 有点 hack 的方式，因为 translate API 会吞掉 code 中的空格。
          // 所以，在翻译前，将 code 中的空格替换成 &nbsp;，翻译后，再替换回来
          node.children[0].value = node.children[0].value === ' ' ? '' : node.children[0].value;
          node.children[1].children[0].value = node.children[1].children[0].value.replace(/&nbsp;/g, ' ');
          return defaultHandlers.pre(h, node);
        },
      }
    })
    .use(remarkStringify)
    .process(html)

  const content = getEnFileContent(writePath, file);

  fs.writeFileSync(
    writePath,
    content,
    'utf8',
  )
  ;
  console.log(`${writePath} written`);

}

const allAsyncTask = allZhFilesName.map(async (pathName) => {
  const html = await mdToHtml(pathName);
  console.log(html, 'html');
  const htmlEn = await getTranslatedText([ html ]);
  console.log(htmlEn[0], 'htmlEn');
  const writePath = pathName.replace('.zh', '.en');
  await HtmlToMd(htmlEn[0], writePath);
});
await Promise.all(allAsyncTask);
process.exit(0);
