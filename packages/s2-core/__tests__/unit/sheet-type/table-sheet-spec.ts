import { getContainer } from 'tests/util/helpers';
import type { GEvent } from '@antv/g-adapter';
import * as dataCfg from 'tests/data/simple-table-data.json';
import { TableSheet } from '@/sheet-type';
import { setLang, type LangType, type S2Options } from '@/common';
import { Node } from '@/facet/layout/node';

describe('TableSheet Tests', () => {
  let s2: TableSheet;

  const s2Options: S2Options = {
    width: 100,
    height: 100,
    tooltip: {
      showTooltip: true,
    },
    interaction: {
      autoResetSheetStyle: false,
    },
  };

  let container: HTMLDivElement;

  beforeAll(() => {
    container = getContainer();
    s2 = new TableSheet(container, dataCfg, s2Options);
    s2.render();
  });

  afterAll(() => {
    container?.remove();
    s2?.destroy();
  });

  describe('TableSheet Sort Tests', () => {
    test('should trigger sort', () => {
      const renderSpy = jest.spyOn(s2, 'render').mockImplementation(() => {});

      const showTooltipWithInfoSpy = jest
        .spyOn(s2, 'showTooltipWithInfo')
        .mockImplementation(() => {});

      const nodeMeta = new Node({ id: '1', key: '1', value: 'testValue' });

      s2.handleGroupSort(
        {
          stopPropagation() {},
        } as GEvent,
        nodeMeta,
      );
      expect(showTooltipWithInfoSpy).toHaveBeenCalledTimes(1);

      s2.onSortTooltipClick(
        { key: 'asc' },
        {
          field: 'city',
        },
      );

      expect(s2.dataCfg.sortParams).toEqual([
        {
          sortFieldId: 'city',
          sortMethod: 'asc',
        },
      ]);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('should update sort params', () => {
      s2.onSortTooltipClick(
        { key: 'desc' },
        {
          field: 'cost',
        },
      );

      expect(s2.dataCfg.sortParams).toEqual([
        {
          sortFieldId: 'city',
          sortMethod: 'asc',
        },
        {
          sortFieldId: 'cost',
          sortMethod: 'desc',
        },
      ]);

      s2.onSortTooltipClick(
        { key: 'desc' },
        {
          field: 'city',
        },
      );

      expect(s2.dataCfg.sortParams).toEqual([
        {
          sortFieldId: 'cost',
          sortMethod: 'desc',
        },
        {
          sortFieldId: 'city',
          sortMethod: 'desc',
        },
      ]);

      s2.setDataCfg({
        ...s2.dataCfg,
        sortParams: [
          {
            sortFieldId: 'cost',
            sortMethod: 'desc',
            sortBy: ['1', '2'],
          },
          {
            sortFieldId: 'city',
            sortMethod: 'desc',
          },
        ],
      });

      s2.onSortTooltipClick(
        { key: 'asc' },
        {
          field: 'cost',
        },
      );

      expect(s2.dataCfg.sortParams).toEqual([
        {
          sortFieldId: 'city',
          sortMethod: 'desc',
        },
        {
          sortFieldId: 'cost',
          sortMethod: 'asc',
          sortBy: ['1', '2'],
        },
      ]);
    });

    // https://github.com/antvis/S2/issues/1421
    test.each(['zh_CN', 'en_US'])(
      'should render group sort menu',
      (lang: LangType) => {
        setLang(lang);

        const sheet = new TableSheet(container, dataCfg, s2Options);
        sheet.render();

        const showTooltipWithInfoSpy = jest
          .spyOn(sheet, 'showTooltipWithInfo')
          .mockImplementation(() => {});

        const event = {
          stopPropagation() {},
        } as GEvent;

        sheet.handleGroupSort(event, null);

        const isEnUS = lang === 'en_US';
        const groupAscText = isEnUS ? 'ASC' : '升序';
        const groupDescText = isEnUS ? 'DESC' : '降序';
        const groupNoneText = isEnUS ? 'No order' : '不排序';

        expect(showTooltipWithInfoSpy).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          {
            onlyMenu: true,
            operator: {
              menus: [
                { icon: 'groupAsc', key: 'asc', text: groupAscText },
                { icon: 'groupDesc', key: 'desc', text: groupDescText },
                { key: 'none', text: groupNoneText },
              ],
              onClick: expect.anything(),
            },
          },
        );
        sheet.destroy();
      },
    );
  });
});
