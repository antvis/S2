export enum KpiType {
  // 目标值
  TargetValue = 'TargetValue',
  // 基准值
  ReferenceValue = 'ReferenceValue',
  // 净增值
  NetAddedValue = 'NetAddedValue',
  // 净增目标值
  TargetNetAddedValue = 'TargetNetAddedValue',
  // 净增完成度
  NetAddedProgress = 'NetAddedProgress',
}

export const KPI_TYPES_CONFIG: Record<KpiType, { name: string; desc: string }> =
  {
    [KpiType.TargetValue]: {
      name: '目标值',
      desc: '指标目标字段的目标值；例如「指标名称1的目标值」',
    },
    [KpiType.ReferenceValue]: {
      name: '基准值',
      desc: '指标目标字段的基准值为（xxx），xxx为具体的数值；例如「指标名称1的基准值为（100000亿）」',
    },
    [KpiType.NetAddedValue]: {
      name: '净增值',
      desc: '指标目标字段的净增值，净增值=当前值-基准值；例如「指标名称1的净增值，净增为当前值-基准值」',
    },
    [KpiType.TargetNetAddedValue]: {
      name: '净增目标值',
      desc: '指标目标字段的净增目标，净增目标=目标值-基准值；例如「指标名称1的净增目标，净增为目标值-基准值」',
    },
    [KpiType.NetAddedProgress]: { name: '净增完成度', desc: '' },
  };
