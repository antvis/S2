/**
 * 将在core 层 S2Event 已经定义的事件，同步到 vue 和 react 中
 * ！注意自己检查生成结果和格式化一下
 */

import { default as inquirer } from 'inquirer';
import { readFileSync, writeFileSync } from "fs";
import{ default as _ } from "lodash";
import { basename, resolve } from 'path';
export const symbol = '// ============== Auto 自动生成的 ================';
const insertEventIntoFile = (filePath, template) => {
  const content = readFileSync(filePath, { encoding: 'utf-8' });
  const lastBracket = content.lastIndexOf(symbol) + symbol.length;

  const newContent = content.slice(0, lastBracket) + `\n  ${template}` + content.slice(lastBracket);
  console.log(newContent, 'newContent');
  writeFileSync(filePath, newContent );
}

// _  to camelCase
/**
 * @param {string} str
 * @return {string} value
 */
const camelcaseName = (str) => {
  return _.chain(str)
    .split('_')
    .map(word => {
      const w = _.trim(word);
      return w[0].toUpperCase() + w.slice(1).toLowerCase();
    })
    .join('')
    .value();
}

const getVueEventName = (eventName) => {
  let vueEventName = camelcaseName(eventName);
  return vueEventName[0].toLowerCase() + vueEventName.slice(1);
}

const vueEventTemplate = (eventName, eventHookName) => {
  const vueEventName = getVueEventName(eventName);
  return `${eventHookName}(s2Ref, emit, S2Event.${eventName}, '${vueEventName}');`;
}

const reactEventTemplate = (eventName, eventHookName) => {
  const reactEventName = 'on' + camelcaseName(eventName);
  return `${eventHookName}(S2Event.${eventName}, props.${reactEventName}, s2);`
}

function getCommonInterfaceTemplate(eventHookName, commonEventName) {
  return eventHookName === 'useCellEvent'
    ? `${commonEventName}?: (data: TargetCellInfo) => void;`
    : `${commonEventName}?: (event: GEvent) => void;`;
}

/**
 * read terminal input
 * @param {string} question
 * @return {Promise<string>}
 */

const readInputLine = (question) => {
  return inquirer.prompt({
    type: 'input',
    message: question,
    name: 'eventName',
    default: 'COL_CELL_BRUSH_SELECTION'
  });
}

const readListLine = async (question) => {
  return inquirer.prompt({
    name: 'eventHookName',
    type: 'list',
    message: question,
    default: 'useS2Event',
    choices: [ 'useCellEvent', 'useS2Event' ],
  });
}
// packages/s2-vue/src/utils/initPropAndEmits.ts
// packages/s2-shared/src/interface.ts
const VUE_USE_EVENTS_PATH = 'packages/s2-vue/src/hooks/useEvents.ts';
const REACT_USE_EVENTS_PATH = 'packages/s2-react/src/hooks/useEvents.ts';
const VUE_INTERFACE_PATH = 'packages/s2-vue/src/utils/initPropAndEmits.ts';
const COMMON_INTERFACE_PATH = 'packages/s2-shared/src/interface.ts';

function insertVueUseEvent(eventName, eventHookName) {
  const vueStr = vueEventTemplate(eventName, eventHookName);
  const vuePath = resolve(process.cwd(), `../../${VUE_USE_EVENTS_PATH}`);
  insertEventIntoFile(vuePath, vueStr);
}

function insertReactUseEvent(eventName, eventHookName) {
  const reactStr = reactEventTemplate(eventName, eventHookName);
  const reactPath = resolve(process.cwd(), `../../${REACT_USE_EVENTS_PATH}`);

  insertEventIntoFile(reactPath, reactStr);
}

function insertVueInterface(eventName) {
  const vueEventName = getVueEventName(eventName);
  const vuePath = resolve(process.cwd(), `../../${VUE_INTERFACE_PATH}`);
  insertEventIntoFile(vuePath, `'${vueEventName}',`);
}


function insertCommonInterface(eventName, eventHookName) {
  const commonEventName = 'on' + camelcaseName(eventName);
  const commonInterfaceTemplate = getCommonInterfaceTemplate(eventHookName, commonEventName);
  const reactPath = resolve(process.cwd(), `../../${COMMON_INTERFACE_PATH}`);
  insertEventIntoFile(reactPath, `${commonInterfaceTemplate}`);
}

const terminalQuestion = async () => {
  const { eventName } = await readInputLine('请输入事件名称：');
  const { eventHookName } = await readListLine(
    '请选择使用 useCellEvent （将事件中传输的event 转为cell返回）\n' +
    '或 useS2Event （直接返回原始参数）？');
  console.log(eventHookName, 'eventName');
  insertVueUseEvent(eventName, eventHookName);
  insertVueInterface(eventName);
  insertReactUseEvent(eventName, eventHookName);
  insertCommonInterface(eventName, eventHookName);

  console.warn('插入完成! ⚠️ 注意自己检查生成结果和格式化一下');
}

terminalQuestion()
