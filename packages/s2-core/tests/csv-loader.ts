import { dsvFormat } from 'd3-dsv';

/**
 * csv parsing
 */
export const parseCSV = (csv, header?) => {
  const DELIMITER = ',';

  // add header
  const content = header ? `${header.join(DELIMITER)}\n${csv}` : csv;

  return dsvFormat(DELIMITER).parse(content);
};
