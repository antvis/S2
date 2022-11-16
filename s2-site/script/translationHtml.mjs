import { read } from 'to-vfile'
import { reporter } from 'vfile-reporter';
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import parse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify'
import remarkStringify from 'remark-stringify';
import stringify from 'remark-stringify';
import rehypeParse from 'rehype-parse'
import rehypeRemark, { defaultHandlers } from 'rehype-remark'
import fs from "fs";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import { visit } from 'unist-util-visit';
import { default as glob } from 'glob';
import { toHtml } from 'hast-util-to-html'
import { TranslationServiceClient } from "@google-cloud/translate";


const __dirname = dirname(fileURLToPath(import.meta.url));
const mdFile = path.join(__dirname, '../docs/manual/basic');
const allZhFilesName = glob.sync("test.zh.md", { cwd: mdFile, realpath: true });

const hitTagInHtml = async (pathName) => {

// markdown 和 AST 的转换方法
  const toMdAST = (md) => unified().use(parse).use(remarkGfm).parse(md);
  const toMarkdown = (ast) => {
    return unified().use(stringify).use(remarkGfm).stringify(ast);
  };

  const mdContent = fs.readFileSync(pathName, 'utf8');
  const mdAST = toMdAST(mdContent);

  visit(mdAST, 'html', (node) => {
    if (node.value) {
      const matchArr = node.value.match(/<[A-Za-z-1-9]+\s/g, '');
      if (matchArr && matchArr.length > 0) {
        node.value = node.value.slice(0, matchArr[0].length) + ' data-mdast="html" ' + node.value.slice(matchArr[0].length);
      }
    }
  })

  let writePath = pathName;
  const writeToFile = async (pathName, mdAST) => {
    writePath = pathName.replace('.zh.md', '.en.md');
    fs.writeFileSync(
      writePath,
      toMarkdown(mdAST),
      "utf8"
    );
    console.log(`${writePath} written`);
  }
  await writeToFile(pathName, mdAST);
  return writePath;
}

const mdToHtmlFile = async (writePath) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const file = await processor
    .process(await read(writePath))

  console.error(reporter(file))
  return String(file);
}

export const getTranslatedText = async (originalHtml, mimeType = 'text/html') => {
  // 项目统一信息
  const projectId = 'crested-sunup-368006';
  const location = 'global';
  const targetLanguageCode = 'en';
  const translationClient = new TranslationServiceClient();
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
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
    console.log(response.translations, 'response');
    for (const translation of response.translations) {
      result.push(translation.translatedText.replace(/ų/g, '\n'));
    }
  } catch (error) {
    console.log(error, 'request error');
  }
  return result;
}

const HtmlToMdFile = async (html, writePath) => {
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
      }
    })
    .use(remarkStringify)
    .process(html)

  console.log(String(file), 'file md');

  fs.writeFileSync(
    writePath,
    String(file),
    "utf8"
  );
}


allZhFilesName.forEach(async (pathName) => {
  const writePath = await hitTagInHtml(pathName);
  const html = await mdToHtmlFile(writePath);
  console.log(html, 'html');
  const htmlEn = await getTranslatedText([html]);
  console.log(htmlEn[0], 'htmlEn');
  await HtmlToMdFile(htmlEn[0], writePath);
});
