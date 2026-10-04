import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Progress, type ProgressStatus } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  parameters: {
    docs: {
      description: {
        component:
          "Task completion for environment jobs. Uses Base UI `Progress`. Pass `value={null}` when duration is unknown. Use `Meter` for gauges (CPU, memory, token budget) and `Button` `progress` when the fill belongs on the action itself.",
      },
    },
  },
  args: {
    label: "Snapshotting",
    description: "Memory + disk",
    value: 42,
    status: "snapshotting",
    size: "md",
    showValue: true,
  },
  argTypes: {
    status: {
      control: "select",
      options: [
        "creating",
        "running",
        "paused",
        "snapshotting",
        "restoring",
        "publishing",
        "failed",
        "ready",
        "destroyed",
      ],
    },
    tone: {
      control: "select",
      options: ["brand", "success", "warning", "danger", "system", "remote", "observe"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    value: { control: "number" },
    showValue: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Progress size="sm" status="running" label="Tool call" value={64} />
      <Progress size="md" status="snapshotting" label="Snapshotting" value={64} />
      <Progress size="lg" status="publishing" label="Publishing" value={64} />
    </div>
  ),
};

export const EnvironmentTones: Story = {
  name: "Environment tones",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Progress status="creating" label="Creating" description="Allocating microVM" value={12} />
      <Progress status="running" label="Running" description="agentd · web-research" value={48} />
      <Progress status="paused" label="Paused" description="HITL · waiting for approval" value={48} />
      <Progress status="snapshotting" label="Snapshotting" description="memory + disk" value={71} />
      <Progress status="restoring" label="Restoring" description="snap_01H" value={33} />
      <Progress status="publishing" label="Publishing" description="remote runtime" value={86} />
      <Progress status="ready" label="Ready" description="exit 0" value={100} />
      <Progress status="failed" label="Failed" description="exit 1 · protected path" value={37} />
      <Progress status="destroyed" label="Destroyed" description="teardown complete" value={100} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Tone follows the environment state machine: observe (creating / destroyed), brand (running), warning (paused), system (snapshotting / restoring), remote (publishing), success (ready), danger (failed).",
      },
    },
  },
};

export const MicroVmBoot: Story = {
  name: "MicroVM boot",
  render: () => {
    const steps = [
      { label: "Pull guest image", description: "web-research · recipe.toml", at: 28 },
      { label: "Boot microVM", description: "runtime-microsandbox", at: 61 },
      { label: "Start agentd", description: "jobd extension", at: 84 },
      { label: "Attach observation", description: "event bus", at: 100 },
    ];
    const [value, setValue] = useState(6);
    useEffect(() => {
      const id = setInterval(() => {
        setValue((current) => (current >= 100 ? 6 : current + 2));
      }, 160);
      return () => clearInterval(id);
    }, []);
    const step = steps.find((item) => value <= item.at) ?? steps[steps.length - 1];
    const status: ProgressStatus = value >= 100 ? "ready" : "creating";
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Progress
          status={status}
          label={value >= 100 ? "Environment ready" : step.label}
          description={step.description}
          value={value}
          valueLabel={(formatted) => (value >= 100 ? "Ready" : formatted)}
        />
      </div>
    );
  },
};

export const Snapshotting: Story = {
  render: () => {
    const [value, setValue] = useState(18);
    useEffect(() => {
      const id = setInterval(() => {
        setValue((current) => (current >= 100 ? 0 : current + 3));
      }, 180);
      return () => clearInterval(id);
    }, []);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Progress
          status={value >= 100 ? "ready" : "snapshotting"}
          label="Snapshotting"
          description="Memory + disk"
          value={value}
          valueLabel={(formatted, current) => (current != null && current >= 100 ? "Saved" : formatted)}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "System tone. Pair with the Snapshotting button fill only while the action itself is the control.",
      },
    },
  },
};

export const Restoring: Story = {
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Progress
        status="restoring"
        label="Restoring"
        description="snap_04 → env_01J"
        value={46}
      />
    </div>
  ),
};

export const PublishToRemote: Story = {
  name: "Publish to remote",
  render: () => {
    const [value, setValue] = useState(12);
    useEffect(() => {
      const id = setInterval(() => {
        setValue((current) => (current >= 100 ? 8 : current + 4));
      }, 200);
      return () => clearInterval(id);
    }, []);
    const phase =
      value < 30 ? "Pack snapshot" : value < 75 ? "Upload artifact" : "Register runtime";
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Progress
          status="publishing"
          label="Publishing"
          description={`${phase} · remote`}
          value={value}
        />
      </div>
    );
  },
};

export const GuestImageBuild: Story = {
  name: "Guest image build",
  render: () => (
    <div className="flex w-96 flex-col gap-3 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Progress
        status="running"
        size="sm"
        label="web-research"
        description="guest/images/web-research/recipe.toml"
        value={73}
      />
      <Progress
        status="creating"
        size="sm"
        label="Layer cache"
        description="2 of 5 steps"
        value={40}
        valueLabel="2/5"
      />
    </div>
  ),
};

export const IndeterminateToolCall: Story = {
  name: "Indeterminate tool call",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Progress
        status="running"
        label="model-router"
        description="Streaming · duration unknown"
        value={null}
        valueLabel="Streaming"
      />
      <Progress
        status="creating"
        label="Waiting on tool gateway"
        description="mcp-host · no byte count yet"
        value={null}
        valueLabel="Working"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`value={null}` is the Base UI indeterminate state. Use it for model streams and tool calls that have no known total. Reduced motion flattens the slide to a static tint.",
      },
    },
  },
};

export const HitlPaused: Story = {
  name: "HITL paused",
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Progress
        status="paused"
        label="Paused · approval required"
        description="Timeout policy: PauseWait. Never AutoAllow."
        value={62}
        valueLabel="Ask"
      />
    </div>
  ),
};

export const FailedRun: Story = {
  name: "Failed run",
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Progress
        status="failed"
        label="Failed"
        description="Denied · protected path /etc"
        value={37}
        valueLabel="exit 1"
      />
    </div>
  ),
};

export const EnvironmentPanel: Story = {
  name: "Environment panel",
  render: () => (
    <div className="flex w-[420px] flex-col gap-3 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Progress
        size="sm"
        status="running"
        label="env_01H"
        description="Running · web-research"
        value={null}
        valueLabel="Live"
      />
      <Progress
        size="sm"
        status="snapshotting"
        label="snap_04"
        description="Snapshotting"
        value={58}
      />
      <Progress
        size="sm"
        status="publishing"
        label="remote"
        description="Publishing"
        value={21}
      />
      <Progress
        size="sm"
        status="paused"
        label="tool:write"
        description="HITL · Ask"
        value={100}
        valueLabel="Waiting"
        tone="warning"
      />
    </div>
  ),
};
