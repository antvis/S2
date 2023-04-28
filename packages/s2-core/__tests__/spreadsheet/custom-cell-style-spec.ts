import {
  createPivotSheet,
  createTableSheet,
  getContainer,
} from 'tests/util/helpers';
import * as dataConfig from 'tests/data/mock-dataset.json';
import { customColSimpleColumns } from '../data/custom-table-col-fields';
import { EXTRA_FIELD, type S2DataConfig } from '@/common';
import type { ViewMeta } from '@/common/interface/basic';
import type { Node } from '@/facet/layout/node';
import type { S2Options } from '@/common/interface';
import { TableSheet, type SpreadSheet } from '@/sheet-type';

describe('SpreadSheet Custom Cell Style Tests', () => {
  let s2: SpreadSheet;

  const s2Options: S2Options = {
    width: 600,
    height: 400,
    devicePixelRatio: 1,
    hierarchyType: 'grid',
  };

  const mapNodeSize = (nodes: Node[] | ViewMeta[]) =>
    nodes.map(({ id, width, height }) => {
      return { id, width, height };
    });

  describe('PivotSheet Custom Cell Style Tests', () => {
    beforeEach(() => {
      s2 = createPivotSheet(s2Options);
      s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should render default cell style', () => {
      expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      expect(
        mapNodeSize(s2.facet.getDataCells().map((cell) => cell.getMeta())),
      ).toMatchSnapshot();
    });

    describe('#DataCell', () => {
      test('should get custom data cell style', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            dataCell: {
              width: 300,
              height: 90,
            },
          },
        });

        sheet.render();

        expect(
          mapNodeSize(sheet.facet.getDataCells().map((cell) => cell.getMeta())),
        ).toMatchSnapshot();

        // 行头叶子节点高度和 dataCell 一致
        sheet.facet.getRowLeafNodes().forEach((node) => {
          expect(node.height).toStrictEqual(90);
        });

        // 列头叶子节点宽度和 dataCell 一致
        sheet.facet.getColLeafNodes().forEach((node) => {
          expect(node.width).toStrictEqual(300);
        });

        sheet.destroy();
      });
    });

    describe('#RowCell', () => {
      test('should get custom row cell style', () => {
        s2.setOptions({
          style: {
            rowCell: {
              width: 50,
              height: 60,
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should get custom row cell style by custom hook', () => {
        s2.setOptions({
          style: {
            rowCell: {
              width: (node) => {
                expect(node?.id).toInclude('root[&]浙江');

                return 100;
              },
              height: (node) => {
                expect(node?.id).toInclude('root[&]浙江');

                return 40;
              },
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should get custom row cell style by field', () => {
        s2.setOptions({
          style: {
            rowCell: {
              widthByField: {
                city: 66,
              },
              heightByField: {
                city: 33,
              },
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should get custom row cell style by field id', () => {
        const cityId = `root[&]浙江[&]杭州`;

        s2.setOptions({
          style: {
            rowCell: {
              widthByField: {
                [cityId]: 50,
              },
              heightByField: {
                [cityId]: 300,
              },
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should not get custom row cell style if not leaf node by field', () => {
        const width = 100;
        const height = 200;

        const provinceId = `root[&]浙江`;

        s2.setOptions({
          style: {
            rowCell: {
              widthByField: {
                province: width,
                [provinceId]: width,
              },
              heightByField: {
                province: height,
                [provinceId]: height,
              },
            },
          },
        });
        s2.render();

        const rootRowNodes = s2.facet
          .getRowNodes()
          .filter((node) => node.level === 0);

        expect(rootRowNodes).toHaveLength(1);
        rootRowNodes.forEach((node) => {
          expect(node.width).toStrictEqual(width);
          expect(node.height).not.toStrictEqual(height);
        });
      });

      test('should get custom row cell style priority by rowCell.heightByField > rowCell.height > dataCell.height', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            rowCell: {
              heightByField: {
                city: 40,
              },
              height: 20,
            },
            dataCell: {
              height: 50,
            },
          },
        });

        sheet.render();

        // 1. rowCell.heightByField > rowCell.height > dataCell.height
        sheet.facet.getRowLeafNodes().forEach((node) => {
          expect(node.height).toEqual(40);
        });

        // 2. rowCell.height > dataCell.height
        sheet.setOptions(
          {
            style: {
              rowCell: {
                height: 20,
              },
              dataCell: {
                height: 50,
              },
            },
          },
          true,
        );
        sheet.render(false);

        sheet.facet.getRowLeafNodes().forEach((node) => {
          expect(node.height).toEqual(20);
        });
      });
    });

    describe('#ColCell', () => {
      test('should get custom col cell style', () => {
        s2.setOptions({
          style: {
            colCell: {
              width: 50,
              height: 60,
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      });

      test('should get custom col cell style by custom hook', () => {
        s2.setOptions({
          style: {
            colCell: {
              width: (node) => {
                expect(node?.id).toInclude('root[&]笔');

                return 100;
              },
              height: (node) => {
                expect(node?.id).toInclude('root[&]笔');

                return 40;
              },
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      });

      test('should get custom col cell style by field', () => {
        s2.setOptions({
          style: {
            colCell: {
              widthByField: {
                sub_type: 66,
              },
              heightByField: {
                sub_type: 33,
              },
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      });

      test('should get custom col cell style by field id', () => {
        const priceId = `root[&]笔[&]price`;

        s2.setOptions({
          style: {
            colCell: {
              widthByField: {
                [priceId]: 50,
              },
              heightByField: {
                [priceId]: 300,
              },
            },
          },
        });
        s2.render();

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should not get custom col cell style if not leaf node by field', () => {
        const width = 100;
        const height = 200;

        const subTypeId = `root[&]笔[&]sub_type`;

        s2.setOptions({
          style: {
            colCell: {
              widthByField: {
                sub_type: width,
                [subTypeId]: width,
              },
              heightByField: {
                sub_type: height,
                [subTypeId]: height,
              },
            },
          },
        });
        s2.render();

        const rootColNodes = s2.facet
          .getColNodes()
          .filter((node) => node.level === 0);

        expect(rootColNodes).toHaveLength(1);
        rootColNodes.forEach((node) => {
          expect(node.width).not.toStrictEqual(width);
          expect(node.height).not.toStrictEqual(height);
        });
      });

      test('should get custom col cell style priority by colCell.widthByField > colCell.width > dataCell.width', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            colCell: {
              width: 200,
              widthByField: {
                [EXTRA_FIELD]: 300,
              },
            },
            dataCell: {
              width: 100,
            },
          },
        });

        sheet.render();

        // 1. colCell.widthByField > colCell.width > dataCell.width
        sheet.facet.getColLeafNodes().forEach((node) => {
          expect(node.width).toEqual(300);
        });

        // 2. colCell.width > dataCell.width
        sheet.setOptions(
          {
            style: {
              colCell: {
                width: 200,
              },
              dataCell: {
                width: 100,
              },
            },
          },
          true,
        );
        sheet.render(false);

        sheet.facet.getColLeafNodes().forEach((node) => {
          expect(node.width).toEqual(200);
        });
      });

      test('should get custom col cell style if measure column hidden', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            colCell: {
              hideValue: true,
              widthByField: {
                'root[&]笔': 100,
              },
            },
          },
        });

        sheet.render();

        sheet.facet.getColLeafNodes().forEach((node) => {
          expect(node.width).toEqual(100);
        });
      });
    });
  });

  describe('TableSheet Custom Cell Style Tests', () => {
    beforeEach(() => {
      s2 = createTableSheet(s2Options, {
        useSimpleData: false,
      });
      s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should render default cell style', () => {
      expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      expect(
        mapNodeSize(s2.facet.getDataCells().map((cell) => cell.getMeta())),
      ).toMatchSnapshot();
    });

    test('should set row cell style by height', () => {
      s2.setOptions({
        style: {
          rowCell: {
            height: 60,
          },
        },
      });
      s2.render();

      expect(
        mapNodeSize(s2.facet.getDataCells().map((cell) => cell.getMeta())),
      ).toMatchSnapshot();
    });

    test('should set row cell style by row index', () => {
      s2.setOptions({
        style: {
          rowCell: {
            heightByField: {
              0: 40,
              '2': 100,
            },
          },
        },
      });
      s2.render();

      expect(
        mapNodeSize(s2.facet.getDataCells().map((cell) => cell.getMeta())),
      ).toMatchSnapshot();
    });

    test('should set col cell style by width', () => {
      s2.setOptions({
        style: {
          colCell: {
            width: 100,
          },
        },
      });
      s2.render();

      expect(mapNodeSize(s2.facet.getColNodes())).toMatchSnapshot();
    });

    test('should set col cell style by field', () => {
      const sheet = createTableSheet(s2Options, {
        useSimpleData: false,
      });

      sheet.setOptions({
        style: {
          colCell: {
            widthByField: {
              type: 50,
              sub_type: 120,
            },
          },
        },
      });
      sheet.render();

      expect(mapNodeSize(sheet.facet.getColNodes())).toMatchSnapshot();
    });

    test('should set col cell style by field id', () => {
      const sheet = createTableSheet(s2Options, {
        useSimpleData: false,
      });

      sheet.setOptions({
        style: {
          colCell: {
            widthByField: {
              'root[&]类别': 100,
              'root[&]子类别': 200,
            },
          },
        },
      });
      sheet.render();

      expect(mapNodeSize(sheet.facet.getColNodes())).toMatchSnapshot();
    });

    test('should not set top level col cell style by field', () => {
      const customColDataCfg: S2DataConfig = {
        ...dataConfig,
        fields: {
          columns: customColSimpleColumns,
        },
      };
      const sheet = new TableSheet(getContainer(), customColDataCfg, s2Options);

      sheet.setOptions({
        style: {
          colCell: {
            widthByField: {
              area: 100,
              money: 100,
            },
          },
        },
      });
      sheet.render();

      const nodes = sheet.facet.getColNodes();

      const areaNode = nodes.find((node) => node.field === 'area');
      const moneyNode = nodes.find((node) => node.field === 'money');

      expect(areaNode?.width).not.toEqual(100);
      expect(moneyNode?.width).not.toEqual(100);
    });

    test('should set col cell style by field for multiple columns', () => {
      const customColDataCfg: S2DataConfig = {
        ...dataConfig,
        fields: {
          columns: customColSimpleColumns,
        },
      };
      const sheet = new TableSheet(getContainer(), customColDataCfg, s2Options);

      sheet.setOptions({
        style: {
          colCell: {
            widthByField: {
              province: 100,
              city: 80,
              price: 90,
              number: 120,
            },
          },
        },
      });
      sheet.render();

      expect(mapNodeSize(sheet.facet.getColNodes())).toMatchSnapshot();
    });
  });
});
