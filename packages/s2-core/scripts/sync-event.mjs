/* eslint-disable import/no-extraneous-dependencies */
/**
 * 将在core 层 S2Event 已经定义的事件，同步到 vue 和 react 中
 * ！注意自己检查生成结果和格式化一下
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { default as inquirer } from 'inquirer';
import { camelCase } from 'lodash';

const symbol = '// ============== Auto 自动生成的 ================';

const insertEventIntoFile = (filePath, template) => {
  const content = readFileSync(filePath, { encoding: 'utf-8' });
  const lastBracket = content.lastIndexOf(symbol) + symbol.length;
  const newContent = `${content.slice(
    0,
    lastBracket,
  )}\n  ${template}${content.slice(lastBracket)}`;

  writeFileSync(filePath, newContent);
};

const getVueEventName = (eventName) => {
  return camelCase(eventName);
};

const getReactEventName = (eventName) => {
  return `on${eventName.charAt(0).toUpperCase()}${camelCase(
    eventName.slice(1),
  )}`;
};

const vueEventTemplate = (eventName, eventHookName) => {
  const vueEventName = getVueEventName(eventName);

  return `${eventHookName}(s2Ref, emit, S2Event.${eventName}, '${vueEventName}');`;
};

const reactEventTemplate = (eventName, eventHookName) => {
  const reactEventName = getReactEventName(eventName);

  return `${eventHookName}(S2Event.${eventName}, props.${reactEventName}, s2);`;
};

function getCommonInterfaceTemplate(eventHookName, commonEventName) {
  return eventHookName === 'useCellEvent'
    ? `${commonEventName}?: (data: TargetCellInfo) => void;`
    : `${commonEventName}?: (event: GEvent) => void;`;
}

/**
 * 读取 eventName
 * @param {string} question
 * @return {Promise<string>}
 */

const readInputLine = (question) => {
  return inquirer.prompt({
    type: 'input',
    message: question,
    name: 'eventName',
    default: 'COL_CELL_BRUSH_SELECTION',
  });
};

/**
 * 读取 eventHookName
 * @param {string} question
 * @return {Promise<string>}
 */
const readListLine = (question) => {
  return inquirer.prompt({
    name: 'eventHookName',
    type: 'list',
    message: question,
    default: 'useS2Event',
    choices: ['useCellEvent', 'useS2Event'],
  });
};

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
  const commonEventName = getReactEventName(eventName);
  const commonInterfaceTemplate = getCommonInterfaceTemplate(
    eventHookName,
    commonEventName,
  );
  const reactPath = resolve(process.cwd(), `../../${COMMON_INTERFACE_PATH}`);

  insertEventIntoFile(reactPath, `${commonInterfaceTemplate}`);
}

const syncEvent = async () => {
  const { eventName } = await readInputLine('请输入事件名称：');
  const { eventHookName } = await readListLine(
    '请选择使用 useCellEvent （将事件中传输的event 转为cell返回）\n' +
      '或 useS2Event （直接返回原始参数）？',
  );

  insertVueUseEvent(eventName, eventHookName);
  insertVueInterface(eventName);
  insertReactUseEvent(eventName, eventHookName);
  insertCommonInterface(eventName, eventHookName);

  // eslint-disable-next-line no-console
  console.warn(`✅${eventName}插入完成!  ⚠️ 注意自己检查生成结果和格式化一下`);
};

await syncEvent();
