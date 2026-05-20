<script setup lang="ts">
import {
  S2_PREFIX_CLS,
  i18n,
  asyncGetAllData,
  asyncGetAllPlainData,
  copyToClipboard,
  download,
  CSV_SEPARATOR,
  TAB_SEPARATOR,
  type CopyAllDataParams,
  type Copyable,
} from '@antv/s2';
import { Button, Dropdown, Menu, type MenuProps } from 'ant-design-vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import type { ExportProps } from './interface';

const props = withDefaults(defineProps<ExportProps>(), {
  async: true,
  copyOriginalText: () => i18n('复制原始数据'),
  copyFormatText: () => i18n('复制格式化数据'),
  downloadOriginalText: () => i18n('下载原始数据'),
  downloadFormatText: () => i18n('下载格式化数据'),
  fileName: 'sheet',
});

const emit = defineEmits<{
  (e: 'copy-success', data: Copyable | string | undefined): void;
  (e: 'copy-error', error: unknown): void;
  (e: 'download-success', data: string): void;
  (e: 'download-error', error: unknown): void;
}>();

const PRE_CLASS = `${S2_PREFIX_CLS}-export`;

const getData = async (
  split: string,
  isFormat: boolean,
  method: (
    params: CopyAllDataParams,
  ) => Promise<Copyable | string> | Copyable | string,
) => {
  const params: CopyAllDataParams = {
    sheetInstance: props.sheetInstance,
    split,
    formatOptions: isFormat,
    async: props.async,
  };

  const data = await (props.customCopyMethod?.(params) || method?.(params));

  return data;
};

const getPlainData = async (split: string, isFormat: boolean) => {
  const result = await getData(split, isFormat, asyncGetAllPlainData);

  return result as string;
};

const getAllData = async (split: string, isFormat: boolean) => {
  const result = await getData(split, isFormat, asyncGetAllData);

  return result;
};

const copyData = async (isFormat: boolean) => {
  const data = await getAllData(TAB_SEPARATOR, isFormat);

  copyToClipboard(data!, props.async)
    .then(() => {
      emit('copy-success', data);
      props.onCopySuccess?.(data);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('copy failed: ', error);
      emit('copy-error', error);
      props.onCopyError?.(error);
    });
};

const downloadData = async (isFormat: boolean) => {
  // 导出的是 csv 格式, 复制时需要以逗号分割 https://github.com/antvis/S2/issues/2701
  const data = await getPlainData(CSV_SEPARATOR, isFormat);

  try {
    download(data, props.fileName);
    emit('download-success', data);
    props.onDownloadSuccess?.(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('download failed: ', error);
    emit('download-error', error);
    props.onDownloadError?.(error);
  }
};

const menuItems: MenuProps['items'] = [
  {
    key: 'copyOriginal',
    label: props.copyOriginalText,
    onClick: () => copyData(false),
  },
  {
    key: 'copyFormat',
    label: props.copyFormatText,
    onClick: () => copyData(true),
  },
  {
    key: 'downloadOriginal',
    label: props.downloadOriginalText,
    onClick: () => downloadData(false),
  },
  {
    key: 'downloadFormat',
    label: props.downloadFormatText,
    onClick: () => downloadData(true),
  },
];
</script>

<template>
  <Dropdown :class="[PRE_CLASS, className]" trigger="click" v-bind="dropdown">
    <template #overlay>
      <Menu :items="menuItems" />
    </template>
    <slot>
      <Button type="text">
        <template #icon>
          <MoreOutlined />
        </template>
      </Button>
    </slot>
  </Dropdown>
</template>
