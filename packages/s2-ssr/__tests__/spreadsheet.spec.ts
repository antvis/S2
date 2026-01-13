import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { MetaData, Spreadsheet } from '../src';
import { createSpreadsheet } from '../src';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchFile(path: string, meta?: MetaData): R;
    }
  }
}

expect.extend({
  toMatchFile: (received: Spreadsheet, path: string, meta?: MetaData) => {
    const filePath = join(__dirname, path);

    const file = received.toBuffer(meta);
    const pass = existsSync(filePath)
      ? file.equals(readFileSync(filePath))
      : true;

    const actualName = filePath.replace('.', '-actual.');

    if (!pass) {
      writeFileSync(actualName, file);
    } else if (existsSync(actualName)) {
      unlinkSync(actualName);
    }

    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      };
    }

    return {
      message: () => 'expected files are equal',
      pass: false,
    };
  },
});

const pivotData = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
  data: [
    { province: '浙江', city: '杭州', type: '笔', price: 10 },
    { province: '浙江', city: '杭州', type: '纸张', price: 20 },
    { province: '浙江', city: '宁波', type: '笔', price: 15 },
    { province: '浙江', city: '宁波', type: '纸张', price: 25 },
  ],
};

const tableData = {
  fields: {
    columns: ['province', 'city', 'type', 'price'],
  },
  data: [
    { province: '浙江', city: '杭州', type: '笔', price: 10 },
    { province: '浙江', city: '宁波', type: '纸张', price: 20 },
  ],
};

describe('createSpreadsheet', () => {
  describe('PivotSheet', () => {
    const createPivot = (
      outputType?: 'image' | 'svg' | 'pdf',
      imageType: 'png' | 'jpeg' = 'png',
      options = {},
    ) => {
      return createSpreadsheet({
        sheetType: 'pivot',
        width: 400,
        height: 300,
        outputType,
        imageType,
        dataCfg: pivotData,
        ...options,
      });
    };

    it('image png', async () => {
      const spreadsheet = await createPivot();

      expect(spreadsheet).toMatchFile('./assets/pivot.png');

      spreadsheet.exportToFile(join(__dirname, './assets/pivot'));

      spreadsheet.destroy();
    });

    it('image jpeg', async () => {
      const spreadsheet = await createPivot('image', 'jpeg');

      expect(spreadsheet).toMatchFile('./assets/pivot.jpeg');

      spreadsheet.exportToFile(join(__dirname, './assets/pivot'));

      spreadsheet.destroy();
    });

    it('file svg', async () => {
      const spreadsheet = await createPivot('svg');
      const outputPath = join(__dirname, './assets/pivot.svg');

      spreadsheet.exportToFile(join(__dirname, './assets/pivot'));

      expect(existsSync(outputPath)).toBe(true);
      spreadsheet.destroy();
    });

    it('toDataURL', async () => {
      const spreadsheet = await createPivot();

      const dataURL = spreadsheet.toDataURL();

      expect(dataURL).toMatch(/^data:image\/png;base64,/);

      spreadsheet.destroy();
    });

    it('toBuffer', async () => {
      const spreadsheet = await createPivot();

      const buffer = spreadsheet.toBuffer();

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);

      spreadsheet.destroy();
    });
  });

  describe('TableSheet', () => {
    const createTable = (
      outputType?: 'image' | 'svg' | 'pdf',
      imageType: 'png' | 'jpeg' = 'png',
      options = {},
    ) => {
      return createSpreadsheet({
        sheetType: 'table',
        width: 400,
        height: 200,
        outputType,
        imageType,
        dataCfg: tableData,
        ...options,
      });
    };

    it('image png', async () => {
      const spreadsheet = await createTable();

      expect(spreadsheet).toMatchFile('./assets/table.png');

      spreadsheet.exportToFile(join(__dirname, './assets/table'));

      spreadsheet.destroy();
    });

    it('image jpeg', async () => {
      const spreadsheet = await createTable('image', 'jpeg');

      expect(spreadsheet).toMatchFile('./assets/table.jpeg');

      spreadsheet.exportToFile(join(__dirname, './assets/table'));

      spreadsheet.destroy();
    });
  });
});
