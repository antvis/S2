import fs from 'fs';
import path from 'path';
import { dsvFormat } from 'd3-dsv';
import EE from '@antv/event-emitter';
import { Canvas } from '@antv/g-canvas';
import { RootInteraction } from '@/interaction/root';
import { Store } from '@/common/store';
import { SpreadSheet } from '@/sheet-type';
import { BaseTooltip } from '@/ui/tooltip';

export const parseCSV = (csv: string, header?: string[]) => {
  const DELIMITER = ',';

  // add header
  const content = header ? `${header.join(DELIMITER)}\n${csv}` : csv;

  return dsvFormat(DELIMITER).parse(content);
};

export const getMockData = (dataPath: string) => {
  const data = fs.readFileSync(path.resolve(__dirname, dataPath), 'utf8');
  return parseCSV(data);
};

export const getContainer = () => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('style', 'margin-left: 32px');
  document.body.appendChild(rootContainer);
  return rootContainer;
};

export const sleep = async (timeout = 0) => {
  await new Promise((resolve) => setTimeout(resolve, timeout));
};

export const createFakeSpreadSheet = () => {
  class FakeSpreadSheet extends EE {}

  const s2 = new FakeSpreadSheet() as SpreadSheet;
  const interaction = new RootInteraction(s2 as unknown as SpreadSheet);
  s2.store = new Store();
  s2.interaction = interaction;
  s2.tooltip = {
    container: {} as HTMLElement,
  } as BaseTooltip;
  s2.container = {
    draw: jest.fn(),
  } as unknown as Canvas;
  s2.render = jest.fn();
  s2.hideTooltip = jest.fn();
  s2.showTooltipWithInfo = jest.fn();

  return s2;
};
