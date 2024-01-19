import * as dataCfg from 'tests/data/simple-table-data.json';
import { getContainer } from 'tests/util/helpers';
import { TableDataSet } from '../../../src/data-set';
import { TableFacet } from '../../../src/facet';
import { S2Event, setLang, type LangType, type S2Options } from '@/common';
import { Node } from '@/facet/layout/node';
import type { GEvent, TooltipOptions } from '@/index';
import { TableSheet } from '@/sheet-type';

describe('TableSheet Tests', () => {
  let s2: TableSheet;

  const s2Options: S2Options = {
    width: 100,
    height: 100,
    tooltip: {
      enable: true,
    },
    interaction: {
      autoResetSheetStyle: false,
    },
  };

  let container: HTMLDivElement;

  beforeEach(async () => {
    container = getContainer();
    s2 = new TableSheet(container, dataCfg, s2Options);
    await s2.render();
    s2.store.set('sortMethodMap', null);
  });

  afterEach(() => {
    // container?.remove();
    // s2?.destroy();
  });

  describe('TableSheet Sort Tests', () => {
    test('should trigger sort', () => {
      const renderSpy = jest
        .spyOn(s2, 'render')
        .mockImplementation(async () => {});

      const showTooltipWithInfoSpy = jest
        .spyOn(s2, 'showTooltipWithInfo')
        .mockImplementation(() => {});

      const nodeMeta = new Node({
        id: '1',
        field: '1',
        value: 'testValue',
      });

      s2.handleGroupSort(
        {
          stopPropagation() {},
        } as GEvent,
        nodeMeta,
      );

      expect(showTooltipWithInfoSpy).toHaveBeenCalledWith(
        expect.anything(),
        [],
        {
          operator: expect.anything(),
          onlyShowOperator: true,
          forceRender: true,
        },
      );

      s2.groupSortByMethod('asc', {
        id: 'city',
        field: 'city',
      } as Node);

      expect(s2.store.get('sortMethodMap')).toEqual({
        city: 'asc',
      });
      expect(s2.getMenuDefaultSelectedKeys('city')).toEqual(['asc']);
      expect(s2.dataCfg.sortParams).toEqual([
        {
          sortFieldId: 'city',
          sortMethod: 'asc',
        },
      ]);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('should update sort params', () => {
      const node = {
        id: 'cost',
        field: 'cost',
      } as Node;

      s2.groupSortByMethod('desc', node);

      expect(s2.store.get('sortMethodMap')).toEqual({
        cost: 'desc',
      });
      expect(s2.getMenuDefaultSelectedKeys(node.id)).toEqual(['desc']);
      expect(s2.dataCfg.sortParams).toEqual([
        {
          sortFieldId: 'cost',
          sortMethod: 'desc',
        },
      ]);

      s2.groupSortByMethod('desc', {
        id: 'city',
        field: 'city',
      } as Node);

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
      expect(s2.store.get('sortMethodMap')).toEqual({
        cost: 'desc',
        city: 'desc',
      });
      expect(s2.getMenuDefaultSelectedKeys('city')).toEqual(['desc']);

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

      s2.groupSortByMethod('asc', {
        id: 'cost',
        field: 'cost',
      } as Node);

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
      expect(s2.store.get('sortMethodMap')).toEqual({
        cost: 'asc',
        city: 'desc',
      });
      expect(s2.getMenuDefaultSelectedKeys('cost')).toEqual(['asc']);
    });

    // https://github.com/antvis/S2/issues/1421
    test.each(['zh_CN', 'en_US'] as LangType[])(
      'should render group sort menu',
      async (lang) => {
        setLang(lang);

        const sheet = new TableSheet(container, dataCfg, s2Options);

        await sheet.render();

        const showTooltipWithInfoSpy = jest
          .spyOn(sheet, 'showTooltipWithInfo')
          .mockImplementation(() => {});

        const event = {
          stopPropagation() {},
        } as GEvent;

        sheet.handleGroupSort(event, null as unknown as Node);

        const isEnUS = lang === 'en_US';
        const groupAscText = isEnUS ? 'ASC' : '升序';
        const groupDescText = isEnUS ? 'DESC' : '降序';
        const groupNoneText = isEnUS ? 'No order' : '不排序';

        const options: TooltipOptions = {
          onlyShowOperator: true,
          forceRender: true,
          operator: {
            menu: {
              items: [
                { icon: 'groupAsc', key: 'asc', label: groupAscText },
                { icon: 'groupDesc', key: 'desc', label: groupDescText },
                { key: 'none', label: groupNoneText },
              ],
              onClick: expect.anything(),
              defaultSelectedKeys: [],
            },
          },
        };

        expect(showTooltipWithInfoSpy).toHaveBeenLastCalledWith(
          expect.anything(),
          expect.anything(),
          options,
        );
        sheet.destroy();
      },
    );
  });

  test('should get normal header fields status', () => {
    expect(s2.isCustomHeaderFields()).toBeFalsy();
    expect(s2.isCustomRowFields()).toBeFalsy();
    expect(s2.isCustomColumnFields()).toBeFalsy();
  });

  test('should get table mode', () => {
    expect(s2.isPivotMode()).toBeFalsy();
    expect(s2.isTableMode()).toBeTruthy();
  });

  test('should get data set', () => {
    expect(s2.getDataSet()).toBeInstanceOf(TableDataSet);
  });

  test('should emit destroy event', () => {
    const onDestroy = jest.fn();

    s2.on(S2Event.LAYOUT_DESTROY, onDestroy);

    s2.destroy();

    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  test('should render custom table facet', async () => {
    const mockRender = jest.fn();

    class CustomFacet extends TableFacet {
      render() {
        super.render();
        mockRender();
      }
    }

    const sheet = new TableSheet(getContainer(), dataCfg, {
      facet: (spreadsheet) => new CustomFacet(spreadsheet),
      tooltip: {
        enable: false,
      },
    });

    await sheet.render();

    expect(sheet.facet).toBeInstanceOf(TableFacet);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  test('should get content height', () => {
    expect(s2.getContentHeight()).toEqual(120);
  });
});
