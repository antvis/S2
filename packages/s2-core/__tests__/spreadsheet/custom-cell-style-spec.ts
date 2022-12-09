import { createPivotSheet } from 'tests/util/helpers';
import { EXTRA_FIELD } from '../../src/common';
import type { ViewMeta } from '@/common/interface/basic';
import type { Node } from '@/facet/layout/node';
import type { S2Options } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';

describe('SpreadSheet Custom Cell Style Tests', () => {
  let s2: SpreadSheet;

  const s2Options: S2Options = {
    width: 600,
    height: 400,
    hierarchyType: 'grid',
  };

  const mapNodeSize = (nodes: Node[] | ViewMeta[]) => {
    return nodes.map(({ id, width, height }) => ({ id, width, height }));
  };

  describe('PivotSheet Custom Cell Style Tests', () => {
    beforeAll(() => {
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
        mapNodeSize(
          s2.interaction
            .getPanelGroupAllDataCells()
            .map((cell) => cell.getMeta()),
        ),
      ).toMatchSnapshot();
    });

    describe('#DataCell', () => {
      test('should get custom data cell style', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            cellCfg: {
              width: 300,
              height: 90,
            },
          },
        });

        sheet.render();

        expect(
          mapNodeSize(
            sheet.interaction
              .getPanelGroupAllDataCells()
              .map((cell) => cell.getMeta()),
          ),
        ).toMatchSnapshot();

        // 行头叶子节点高度和 dataCell 一致
        sheet.getRowLeafNodes().forEach((node) => {
          expect(node.height).toStrictEqual(90);
        });

        // 列头叶子节点宽度和 dataCell 一致
        sheet.getColumnLeafNodes().forEach((node) => {
          expect(node.width).toStrictEqual(300);
        });

        sheet.destroy();
      });
    });

    describe('#RowCell', () => {
      test('should get custom row cell style', () => {
        s2.setOptions({
          style: {
            rowCfg: {
              width: 50,
              height: 60,
            },
          },
        });
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should get custom row cell style by custom hook', () => {
        s2.setOptions({
          style: {
            rowCfg: {
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
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should get custom row cell style by field', () => {
        s2.setOptions({
          style: {
            rowCfg: {
              widthByField: {
                city: 66,
              },
              heightByField: {
                city: 33,
              },
            },
          },
        });
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should get custom row cell style by field id', () => {
        const cityId = `root[&]浙江[&]杭州`;

        s2.setOptions({
          style: {
            rowCfg: {
              widthByField: {
                [cityId]: 50,
              },
              heightByField: {
                [cityId]: 300,
              },
            },
          },
        });
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should not get custom row cell style if not leaf node by field', () => {
        const width = 100;
        const height = 200;

        const provinceId = `root[&]浙江`;

        s2.setOptions({
          style: {
            rowCfg: {
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
        s2.render(false);

        const rootRowNodes = s2
          .getRowNodes()
          .filter((node) => node.level === 0);

        expect(rootRowNodes).toHaveLength(1);
        rootRowNodes.forEach((node) => {
          expect(node.width).not.toStrictEqual(width);
          expect(node.height).not.toStrictEqual(height);
        });
      });

      test('should get custom row cell style priority by rowCfg.heightByField > rowCfg.height > cellCfg.height', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            rowCfg: {
              heightByField: {
                city: 40,
              },
              height: 20,
            },
            cellCfg: {
              height: 50,
            },
          },
        });
        sheet.render();

        // 1. rowCfg.heightByField > rowCfg.height > cellCfg.height
        sheet.getRowLeafNodes().forEach((node) => {
          expect(node.height).toEqual(40);
        });

        // 2. rowCfg.height > cellCfg.height
        sheet.setOptions(
          {
            style: {
              rowCfg: {
                height: 20,
              },
              cellCfg: {
                height: 50,
              },
            },
          },
          true,
        );
        sheet.render(false);

        sheet.getRowLeafNodes().forEach((node) => {
          expect(node.height).toEqual(20);
        });
      });
    });

    describe('#ColCell', () => {
      test('should get custom col cell style', () => {
        s2.setOptions({
          style: {
            colCfg: {
              width: 50,
              height: 60,
            },
          },
        });
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      });

      test('should get custom col cell style by custom hook', () => {
        s2.setOptions({
          style: {
            colCfg: {
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
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      });

      test('should get custom col cell style by field', () => {
        s2.setOptions({
          style: {
            colCfg: {
              widthByField: {
                sub_type: 66,
              },
              heightByField: {
                sub_type: 33,
              },
            },
          },
        });
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.colNodes)).toMatchSnapshot();
      });

      test('should get custom col cell style by field id', () => {
        const priceId = `root[&]笔[&]price`;

        s2.setOptions({
          style: {
            colCfg: {
              widthByField: {
                [priceId]: 50,
              },
              heightByField: {
                [priceId]: 300,
              },
            },
          },
        });
        s2.render(false);

        expect(mapNodeSize(s2.facet.layoutResult.rowNodes)).toMatchSnapshot();
      });

      test('should not get custom col cell style if not leaf node by field', () => {
        const width = 100;
        const height = 200;

        const subTypeId = `root[&]笔[&]`;

        s2.setOptions({
          style: {
            colCfg: {
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
        s2.render(false);

        const rootColNodes = s2
          .getColumnNodes()
          .filter((node) => node.level === 0);

        expect(rootColNodes).toHaveLength(1);
        rootColNodes.forEach((node) => {
          expect(node.width).not.toStrictEqual(width);
          expect(node.height).not.toStrictEqual(height);
        });
      });

      test('should get custom col cell style priority by colCfg.widthByField > colCfg.width > cellCfg.width', () => {
        const sheet = createPivotSheet({
          ...s2Options,
          style: {
            colCfg: {
              width: 200,
              widthByField: {
                [EXTRA_FIELD]: 300,
              },
            },
            cellCfg: {
              width: 100,
            },
          },
        });
        sheet.render();

        // 1. colCfg.widthByField > colCfg.width > cellCfg.width
        sheet.getColumnLeafNodes().forEach((node) => {
          expect(node.width).toEqual(300);
        });

        // 2. colCfg.width > cellCfg.width
        sheet.setOptions(
          {
            style: {
              colCfg: {
                width: 200,
              },
              cellCfg: {
                width: 100,
              },
            },
          },
          true,
        );
        sheet.render(false);

        sheet.getColumnLeafNodes().forEach((node) => {
          expect(node.width).toEqual(200);
        });
      });
    });
  });
});
