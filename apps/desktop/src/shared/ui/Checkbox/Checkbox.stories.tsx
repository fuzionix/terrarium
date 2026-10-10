import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { CheckboxField } from "./Checkbox";

const meta: Meta<typeof CheckboxField> = {
  title: "Primitives/Checkbox",
  component: CheckboxField,
  parameters: {
    docs: {
      description: {
        component:
          "Boolean control for Terrarium policy, publish preflight, and observation filters. Wraps Base UI `Checkbox` and, via `CheckboxField`, Base UI `Field` so the label, description, and error stay associated. `value` and `parent` are forwarded for a future CheckboxGroup — this story file does not implement the group.",
      },
    },
  },
  args: {
    label: "Allow writes under /workspace",
    description: "Guest writes stay inside the environment rootfs.",
    size: "md",
    disabled: false,
    readOnly: false,
    required: false,
    indeterminate: false,
    invalid: false,
    defaultChecked: true,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    indeterminate: { control: "boolean" },
    invalid: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <CheckboxField size="sm" defaultChecked label="Pin observation" description="Status-bar density." />
      <CheckboxField size="md" defaultChecked label="Allow writes" description="Inspector default." />
      <CheckboxField size="lg" label="Snapshot before publish" description="Create-dialog density." />
      <CheckboxField size="xl" label="Keep guest running" description="Command-palette density." />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <CheckboxField label="Unchecked" description="Policy not granted." />
      <CheckboxField defaultChecked label="Checked" description="Granted while the guest is stopped." />
      <CheckboxField indeterminate label="Mixed" description="Some child capabilities are on." />
      <CheckboxField disabled label="Destroyed" description="Environment is gone. Policy cannot change." />
      <CheckboxField readOnly defaultChecked label="Running" description="Rename and policy edits wait until the guest stops." />
      <CheckboxField
        invalid
        label="Protected prefix"
        error="High-risk path. Ask before any write under /etc, .ssh, or secrets."
      />
    </div>
  ),
};

export const HitlPolicy: Story = {
  name: "HITL policy",
  render: () => (
    <fieldset className="flex w-md flex-col gap-3 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <legend className="px-1 font-sans text-ui font-medium text-(--color-text-primary)">Tool gateway</legend>
      <CheckboxField
        name="allow-workspace"
        defaultChecked
        label="Allow"
        description="Writes under /workspace proceed without a prompt."
      />
      <CheckboxField
        name="ask-protected"
        defaultChecked
        label="Ask"
        description="Protected prefixes pause for HITL. Never a silent Allow."
      />
      <CheckboxField
        name="deny-network"
        label="Deny"
        description="Outbound sockets stay closed until the environment is Ready."
      />
    </fieldset>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Allow / Ask / Deny are separate acknowledgements, not a radio group. Ask on a protected prefix must stay explicit — the gateway does not infer it.",
      },
    },
  },
};

export const ProtectedPath: Story = {
  name: "Protected path",
  render: function ProtectedStory() {
    const [acknowledged, setAcknowledged] = React.useState(false);
    return (
      <div className="w-md rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <CheckboxField
          name="protected-ack"
          checked={acknowledged}
          onCheckedChange={setAcknowledged}
          invalid={!acknowledged}
          label="Ask before /etc, .ssh, and secrets"
          description="Observation marks these prefixes as high-risk."
          error={acknowledged ? undefined : "Required. A protected prefix cannot default to Allow."}
        />
      </div>
    );
  },
};

export const PublishPreflight: Story = {
  name: "Publish preflight",
  render: function PublishStory() {
    const [tagOk, setTagOk] = React.useState(false);
    const [sizeOk, setSizeOk] = React.useState(false);
    const [publishing, setPublishing] = React.useState(false);
    const ready = tagOk && sizeOk && !publishing;
    return (
      <form
        className="flex w-md flex-col gap-3 rounded-panel border border-(--color-border) bg-(--color-surface) p-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready) return;
          setPublishing(true);
          window.setTimeout(() => setPublishing(false), 900);
        }}
      >
        <CheckboxField
          required
          name="tag-ack"
          checked={tagOk}
          onCheckedChange={setTagOk}
          label="Tag terrarium/web-research:0.1.0"
          description="Recorded on the publish bus. Does not auto-approve."
        />
        <CheckboxField
          required
          name="size-ack"
          checked={sizeOk}
          onCheckedChange={setSizeOk}
          label="Image is under 2 GiB"
          description="Publish stays blocked above the cap."
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={!tagOk || !sizeOk} isLoading={publishing}>
            Publish
          </Button>
        </div>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Both acknowledgements are required. An unticked box keeps Publish disabled — do not auto-approve.",
      },
    },
  },
};

export const SnapshotRetention: Story = {
  name: "Snapshot retention",
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <CheckboxField
        defaultChecked
        name="drop-oldest"
        label="Drop oldest auto checkpoint"
        description="8 / 10 used. The next snapshot replaces the oldest auto point, not a named one."
      />
    </div>
  ),
};

export const CapabilityParent: Story = {
  name: "Capability parent",
  render: function ParentStory() {
    const [caps, setCaps] = React.useState({ network: true, write: false, secrets: false });
    const values = Object.values(caps);
    const allChecked = values.every(Boolean);
    const indeterminate = values.some(Boolean) && !allChecked;
    const setAll = (checked: boolean) => setCaps({ network: checked, write: checked, secrets: checked });
    return (
      <div className="flex w-md flex-col gap-2 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <CheckboxField
          parent
          name="capabilities"
          checked={allChecked}
          indeterminate={indeterminate}
          onCheckedChange={setAll}
          label="Guest capabilities"
          description="Parent seam. CheckboxGroup will own this relationship later."
        />
        <div className="flex flex-col gap-2 ps-6">
          <CheckboxField
            value="network"
            name="network"
            checked={caps.network}
            onCheckedChange={(checked) => setCaps((current) => ({ ...current, network: checked }))}
            label="Network"
            description="Outbound sockets through the gateway."
          />
          <CheckboxField
            value="write"
            name="write"
            checked={caps.write}
            onCheckedChange={(checked) => setCaps((current) => ({ ...current, write: checked }))}
            label="Workspace write"
            description="Limited to the guest mount."
          />
          <CheckboxField
            value="secrets"
            name="secrets"
            checked={caps.secrets}
            onCheckedChange={(checked) => setCaps((current) => ({ ...current, secrets: checked }))}
            label="Secret references"
            description="Guest receives a reference, not the raw value."
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Indeterminate parent plus `value` on each child. This is the extension point for CheckboxGroup — the group itself is intentionally not implemented.",
      },
    },
  },
};

export const ReadonlyWhileRunning: Story = {
  name: "Read-only while running",
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <CheckboxField
        readOnly
        defaultChecked
        label="MCP server attached"
        description="web-research is Running. Detach after the guest stops."
      />
    </div>
  ),
};

export const SecretReference: Story = {
  name: "Secret reference",
  render: function SecretStory() {
    const [accepted, setAccepted] = React.useState(false);
    return (
      <div className="w-md rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <CheckboxField
          required
          name="secret-ack"
          checked={accepted}
          onCheckedChange={setAccepted}
          invalid={!accepted}
          label="Store tvly-live in the host secret store"
          description="The guest receives a reference. Do not log the raw value on the observation plane."
          error={accepted ? undefined : "Required before the reference is mounted."}
        />
      </div>
    );
  },
};

export const LocaleZhHant: Story = {
  name: "Locale · zh-Hant",
  render: () => (
    <div className="flex w-md flex-col gap-3">
      <CheckboxField
        defaultChecked
        label="允許寫入 /workspace"
        description="寫入限制在訪客根檔案系統內。"
      />
      <CheckboxField
        defaultChecked
        label="受保護路徑需先詢問"
        description=" /etc、.ssh、secrets 不會靜默允許。"
      />
      <CheckboxField
        required
        label="發佈不自動核准"
        description="標籤寫入 publish bus 後仍需人工確認。"
      />
    </div>
  ),
};
