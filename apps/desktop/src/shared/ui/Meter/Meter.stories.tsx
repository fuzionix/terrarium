import type { Meta, StoryObj } from "@storybook/react-vite";

import { Meter, MeterIndicator, MeterLabel, MeterRoot, MeterTrack, MeterValue } from "./Meter";

const meta: Meta<typeof Meter> = {
  title: "Primitives/Meter",
  component: Meter,
  parameters: {
    docs: {
      description: {
        component:
          "Range display for Terrarium quotas and measurements. Wraps Base UI `Meter` (`role=\"meter\"`, `aria-valuenow` / `min` / `max`). Not a task progress bar — publishing and snapshotting stay on Button `progress`. `tone=\"auto\"` treats lower as better unless `optimum` sits at or above the midpoint.",
      },
    },
  },
  args: {
    label: "Guest disk",
    value: 42,
    min: 0,
    max: 100,
    size: "md",
    tone: "auto",
    showValue: true,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: {
      control: "select",
      options: ["auto", "brand", "success", "warning", "danger", "system", "remote", "observe"],
    },
    value: { control: { type: "number", min: 0, max: 100 } },
    showValue: { control: "boolean" },
    secondaryValue: { control: { type: "number", min: 0, max: 100 } },
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Meter>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Meter size="sm" label="Status bar" value={36} valueLabel="36%" />
      <Meter size="md" label="Inspector" value={36} valueLabel="36%" />
      <Meter size="lg" label="Publish check" value={36} valueLabel="36%" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Meter tone="brand" label="Brand" value={48} valueLabel="48%" />
      <Meter tone="success" label="Ready" value={48} valueLabel="48%" />
      <Meter tone="warning" label="Ask" value={72} valueLabel="72%" />
      <Meter tone="danger" label="Failed" value={92} valueLabel="92%" />
      <Meter tone="system" label="Snapshotting" value={40} valueLabel="40%" />
      <Meter tone="remote" label="Remote runtime" value={55} valueLabel="55%" />
      <Meter tone="observe" label="Observe" value={20} valueLabel="20%" />
    </div>
  ),
};

export const EnvironmentQuotas: Story = {
  name: "Environment quotas",
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Meter
        label="vCPU"
        description="web-research · cap 4"
        value={1.5}
        min={0}
        max={4}
        low={2.8}
        high={3.6}
        format={{ maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted} / 4`}
        getAriaValueText={(formatted) => `${formatted} of 4 vCPU`}
      />
      <Meter
        label="Memory"
        description="Refuse start above cap"
        value={6.4}
        min={0}
        max={8}
        low={5.6}
        high={7.2}
        format={{ maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted} / 8 GiB`}
        getAriaValueText={(formatted) => `${formatted} of 8 gibibytes`}
        markers={[{ value: 7.2, label: "High" }]}
      />
      <Meter
        label="Disk"
        description="/workspace · guest rootfs"
        value={18.6}
        min={0}
        max={20}
        low={14}
        high={18}
        format={{ maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted} / 20 GiB`}
        getAriaValueText={(formatted) => `${formatted} of 20 gibibytes used`}
        markers={[{ value: 18, label: "Publish warning" }]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Lower is better, so auto tone warns at `low` and turns danger at `high`. The tick marks the publish-check threshold.",
      },
    },
  },
};

export const PublishImageSize: Story = {
  name: "Publish image size",
  render: () => (
    <div className="w-80 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Meter
        size="lg"
        label="Image layer"
        description="Blocked above 2 GiB"
        value={1.84}
        min={0}
        max={2}
        low={1.4}
        high={1.8}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        valueLabel={(formatted) => `${formatted} / 2 GiB`}
        getAriaValueText={(formatted) => `${formatted} of 2 gibibytes, over the publish threshold`}
        markers={[{ value: 1.8, label: "Block" }]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Publish preflight. Insufficient headroom is danger, not a silent Allow. Pair the meter with a disabled Deploy action — do not auto-approve.",
      },
    },
  },
};

export const ContextWindow: Story = {
  name: "Context window",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Meter
        tone="brand"
        label="Prompt tokens"
        description="Informational, does not block"
        value={18240}
        min={0}
        max={128000}
        format={{ notation: "compact", maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted} / 128K`}
        getAriaValueText={(formatted) => `${formatted} of 128 thousand tokens`}
      />
      <Meter
        label="Local throughput"
        description="Ollama · tokens / s"
        value={47}
        min={0}
        max={80}
        low={20}
        high={35}
        optimum={80}
        valueLabel={(formatted) => `${formatted} tok/s`}
        getAriaValueText={(formatted) => `${formatted} tokens per second`}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Cloud token estimate stays informational. Local throughput sets `optimum` at the top of the range so a slow rate reads as warning, not a full bar.",
      },
    },
  },
};

export const SnapshotBudget: Story = {
  name: "Snapshot budget",
  render: () => (
    <div className="w-80">
      <Meter
        tone="system"
        label="Checkpoints"
        description="Oldest auto point drops next"
        value={8}
        min={0}
        max={10}
        low={7}
        high={9}
        valueLabel="8 / 10"
        getAriaValueText={() => "8 of 10 checkpoints used"}
        markers={[{ value: 9, label: "Evict" }]}
      />
    </div>
  ),
};

export const ColdStartBudget: Story = {
  name: "Cold start budget",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Meter
        label="Ready"
        description="P50 target 3s, P95 8s"
        value={2.4}
        min={0}
        max={8}
        low={3}
        high={8}
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted}s`}
        getAriaValueText={(formatted) => `${formatted} seconds to ready`}
        markers={[
          { value: 3, label: "P50" },
          { value: 8, label: "P95" },
        ]}
      />
      <Meter
        label="Cold"
        description="Same budget, over the P50 tick"
        value={5.1}
        min={0}
        max={8}
        low={3}
        high={8}
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted}s`}
        getAriaValueText={(formatted) => `${formatted} seconds to ready`}
        markers={[{ value: 3, label: "P50" }]}
      />
    </div>
  ),
};

export const LocaleZhHant: Story = {
  name: "Locale · zh-Hant",
  render: () => (
    <div className="w-80">
      <Meter
        label="磁碟"
        description="訪客環境 · 預設映像 web-research"
        locale="zh-Hant"
        value={12.5}
        min={0}
        max={20}
        low={14}
        high={18}
        format={{ maximumFractionDigits: 1 }}
        valueLabel={(formatted) => `${formatted} / 20 GiB`}
        getAriaValueText={(formatted) => `已使用 ${formatted} GiB，上限 20 GiB`}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`locale` is forwarded to Base UI's Intl.NumberFormat.",
      },
    },
  },
};

export const Parts: Story = {
  name: "Parts · status bar",
  render: () => (
    <MeterRoot value={42} aria-label="Guest disk" className="flex w-80 items-center gap-3">
      <MeterLabel className="shrink-0 font-sans text-micro text-(--color-text-secondary)">
        disk
      </MeterLabel>
      <MeterTrack className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-(--color-surface-hover)">
        <MeterIndicator className="h-full rounded-full bg-success" />
      </MeterTrack>
      <MeterValue className="shrink-0 font-mono text-micro tabular-nums text-(--color-text-primary)" />
    </MeterRoot>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Observation-plane status bar. Compose `MeterRoot`, `MeterLabel`, `MeterTrack`, `MeterIndicator`, and `MeterValue` when the stacked layout is too tall. Indicator width still comes from Base UI.",
      },
    },
  },
};

export const WithSecondaryBar: Story = {
  name: "With secondary bar",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Meter
        label="Current vs previous"
        description="Secondary shows last period when higher"
        value={42}
        secondaryValue={67}
        valueLabel="42%"
      />
      <Meter
        label="Within previous"
        value={55}
        secondaryValue={40}
        valueLabel="55%"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A lighter secondary bar of the same tone appears behind the main indicator only when `secondaryValue` exceeds the current `value`.",
      },
    },
  },
};