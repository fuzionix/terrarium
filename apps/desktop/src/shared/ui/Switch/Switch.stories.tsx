import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Switch, SwitchField } from "./Switch";

const meta: Meta<typeof SwitchField> = {
  title: "Primitives/Switch",
  component: SwitchField,
  parameters: {
    docs: {
      description: {
        component:
          "Binary setting for Terrarium host policy. Wraps Base UI `Switch.Root` / `Switch.Thumb`. Not a stand-in for Allow / Ask / Deny — that triad stays on the review bus. Label, description, and `data-invalid` come from `SwitchField` via Base UI `Field`.",
      },
    },
  },
  args: {
    label: "Cloud fallback",
    description: "Model router may call a cloud model when the local endpoint is down.",
    size: "md",
    defaultChecked: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SwitchField>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <SwitchField size="sm" label="Status bar" description="Compact row beside the event filter." defaultChecked />
      <SwitchField size="md" label="Inspector" description="Default density. Matches control height md." defaultChecked />
      <SwitchField size="lg" label="Create dialog" description="Used when the switch sits next to a large field." />
      <SwitchField size="xl" label="Command palette" description="Rare. Palette actions stay on Button." />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <SwitchField label="Off" description="Guest network is closed." defaultChecked={false} />
      <SwitchField label="On" description="Observation stream is open." defaultChecked />
      <SwitchField label="Running" description="Policy is locked while the guest is running." defaultChecked readOnly />
      <SwitchField label="Destroyed" description="Environment is gone. Toggle does nothing." disabled />
      <SwitchField
        label="Publish acknowledgement"
        defaultChecked={false}
        invalid
        error="Required before Publish. Publish does not auto-approve."
      />
    </div>
  ),
};

export const CloudFallback: Story = {
  name: "Cloud fallback",
  render: function CloudFallbackStory() {
    const [enabled, setEnabled] = React.useState(false);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <SwitchField
          name="cloudFallback"
          label="Cloud fallback"
          description={
            enabled
              ? "Local endpoint 127.0.0.1:11434 stays first. Cloud is only the fallback."
              : "Ollama only. A down local endpoint fails the turn — it does not hop to cloud."
          }
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Model router setting. Off is the safe default: a dead local endpoint does not silently bill a cloud model.",
      },
    },
  },
};

export const HighRiskWrites: Story = {
  name: "High-risk writes",
  render: function HighRiskStory() {
    const [ask, setAsk] = React.useState(true);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <SwitchField
          name="askHighRisk"
          label="Ask before high-risk writes"
          description="Prefixes /etc, .ssh, and secrets. Off does not equal Allow."
          checked={ask}
          onCheckedChange={setAsk}
          invalid={!ask}
          error={ask ? undefined : "Protected paths are not auto-approved. The gateway still denies until a reviewer approves."}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "HITL stays ternary. This switch only arms Ask for protected prefixes — it never submits Allow on behalf of the reviewer.",
      },
    },
  },
};

export const ObservationStream: Story = {
  name: "Observation stream",
  render: function ObservationStory() {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-bg) p-3">
        <SwitchField
          name="observation"
          label="Stream observation events"
          description="Events land on the observation plane. Revealed secret values are not logged."
          checked={open}
          onCheckedChange={setOpen}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Status-bar companion to the ghost event filter. Closing the stream does not delete retained events.",
      },
    },
  },
};

export const AutoCheckpoint: Story = {
  name: "Auto checkpoint",
  render: () => (
    <div className="w-96">
      <SwitchField
        name="autoCheckpoint"
        label="Checkpoint before publish"
        defaultChecked
        description="8 / 10 used. Oldest auto point drops next. Manual labels are kept."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Publish preflight. The snapshot still has to finish before the image tag is accepted on the publish bus.",
      },
    },
  },
};

export const GuestNetwork: Story = {
  name: "Guest network",
  render: function GuestNetworkStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <SwitchField
          name="guestNetwork"
          label="Guest network"
          description={
            open
              ? "Egress is open for web-research. Tool calls still pass the gateway."
              : "MicroVM has no egress. Recipe web-research cannot fetch until this is on."
          }
          checked={open}
          onCheckedChange={setOpen}
        />
      </div>
    );
  },
};

export const DesktopNotification: Story = {
  name: "Desktop notification",
  render: () => (
    <div className="w-80">
      <SwitchField
        size="sm"
        name="hitlNotify"
        label="Notify on Ask"
        defaultChecked
        description="Host notification when the review bus is waiting. Does not auto-approve."
      />
    </div>
  ),
};

export const PublishAcknowledgement: Story = {
  name: "Publish acknowledgement",
  render: function PublishAckStory() {
    const [ack, setAck] = React.useState(false);
    const [publishing, setPublishing] = React.useState(false);
    return (
      <form
        className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!ack || publishing) return;
          setPublishing(true);
          window.setTimeout(() => setPublishing(false), 900);
        }}
      >
        <div className="flex flex-col gap-3">
          <SwitchField
            name="publishAck"
            label="Publish does not auto-approve"
            description="Tag terrarium/web-research:0.1.0 · blocked above 2 GiB."
            checked={ack}
            onCheckedChange={setAck}
            required
            invalid={!ack}
            error={ack ? undefined : "Required. An image tag is not an Allow."}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={!ack} isLoading={publishing}>
              Publish
            </Button>
          </div>
        </div>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Required switch gates Publish. The button stays secondary-disabled until the acknowledgement is on — do not auto-approve.",
      },
    },
  },
};

export const EnvironmentPolicy: Story = {
  name: "Environment policy",
  render: function PolicyStory() {
    const [network, setNetwork] = React.useState(false);
    const [checkpoint, setCheckpoint] = React.useState(true);
    const [ask, setAsk] = React.useState(true);
    return (
      <div className="flex w-96 flex-col gap-3 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <div className="font-sans text-title font-semibold text-(--color-text-primary)">web-research</div>
        <p className="font-sans text-compact text-(--color-text-tertiary)">
          Guest · recipe web-research · cap 4 vCPU · stopped
        </p>
        <div className="flex flex-col gap-3 border-t border-(--color-border) pt-3">
          <SwitchField
            name="guestNetwork"
            label="Guest network"
            description="Writes stay inside the environment rootfs either way."
            checked={network}
            onCheckedChange={setNetwork}
          />
          <SwitchField
            name="autoCheckpoint"
            label="Checkpoint before publish"
            description="8 / 10 snapshot slots used."
            checked={checkpoint}
            onCheckedChange={setCheckpoint}
          />
          <SwitchField
            name="askHighRisk"
            label="Ask before high-risk writes"
            description="/etc, .ssh, secrets."
            checked={ask}
            onCheckedChange={setAsk}
            invalid={!ask}
            error={ask ? undefined : "Protected prefixes stay denied until review."}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Inspector policy group. Switches edit host policy only — they do not start the microVM.",
      },
    },
  },
};

export const Bare: Story = {
  name: "Bare control",
  render: function BareStory() {
    const [on, setOn] = React.useState(true);
    return (
      <Switch
        size="sm"
        aria-label="Stream observation events"
        checked={on}
        onCheckedChange={setOn}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "No label chrome. The accessible name is aria-label — same rule as the ghost event filter.",
      },
    },
  },
};

export const LocaleZhHant: Story = {
  name: "Locale · zh-Hant",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <SwitchField
        label="雲端備援"
        name="cloudFallback"
        description="本機端點中斷時，模型路由才改走雲端。不會略過人工核准。"
      />
      <SwitchField
        label="高風險路徑先詢問"
        name="askHighRisk"
        defaultChecked
        description="寫入 /etc、.ssh、secrets 維持 Ask，不會自動 Allow。"
      />
      <SwitchField
        label="觀察串流"
        name="observation"
        defaultChecked
        description="事件進入觀察面。密鑰原值不會被記錄。"
      />
      <SwitchField
        label="發佈前檢查點"
        name="autoCheckpoint"
        defaultChecked
        description="已用 8 / 10。最舊的自動點會被取代。"
      />
    </div>
  ),
};
