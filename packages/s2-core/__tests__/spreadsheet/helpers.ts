import { dsvFormat } from 'd3-dsv';
import * as fs from 'fs';
import * as path from 'path';

export const parseCSV = (csv, header?) => {
  const DELIMITER = ',';

  // add header
  const content = header ? `${header.join(DELIMITER)}\n${csv}` : csv;

  return dsvFormat(DELIMITER).parse(content);
};

export const getMockData = (dataPath: string) => {
  const data = fs.readFileSync(
    path.resolve(__dirname, dataPath),
    'utf8',
  );
  return parseCSV(data);
};

export const getContainer = () => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('style', 'margin-left: 32px');
  document.body.appendChild(rootContainer);
  return rootContainer;
};
