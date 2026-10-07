import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, FolderClosed, KeyRound, Search, Server, Tag } from "lucide-react";
import { Input, InputField } from "./Input";
import { Button } from "../Button";

const meta: Meta<typeof InputField> = {
  title: "Primitives/Input",
  component: InputField,
  parameters: {
    docs: {
      description: {
        component:
          "Single-line field for Terrarium forms. Wraps Base UI `Input` and, via `InputField`, Base UI `Field` so labels, descriptions, and `data-invalid` stay associated. Not a multiline composer — agent prompts stay in the workspace editor. Publishing and snapshot progress stay on Button `progress`.",
      },
    },
  },
  args: {
    label: "Environment",
    placeholder: "web-research",
    size: "md",
    variant: "outline",
    mono: false,
    disabled: false,
    readOnly: false,
    clearable: false,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "ghost"] },
    mono: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    clearable: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputField size="sm" label="Status bar" placeholder="Filter events" />
      <InputField size="md" label="Inspector" placeholder="web-research" />
      <InputField size="lg" label="Create dialog" placeholder="Name the environment" />
      <InputField size="xl" label="Command palette" placeholder="Jump to snapshot" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputField label="Ready" defaultValue="web-research" description="Editable while stopped" />
      <InputField label="Running" defaultValue="web-research" readOnly description="Rename after the guest stops" />
      <InputField label="Destroyed" defaultValue="web-research" disabled />
      <InputField
        label="Publish check"
        defaultValue="research latest"
        invalid
        error="Tag must match ^[a-z0-9][a-z0-9._-]{0,127}$"
      />
    </div>
  ),
};

export const EnvironmentName: Story = {
  name: "Environment name",
  render: () => (
    <div className="w-80 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <InputField
        label="Environment"
        name="environment"
        placeholder="web-research"
        defaultValue="web-research"
        description="Guest name · recipe web-research · cap 4 vCPU"
        clearable
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Create / rename flow. Slug is validated before the runtime accepts Start — an invalid name never reaches the microVM.",
      },
    },
  },
};

export const WorkspacePath: Story = {
  name: "Workspace path",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <InputField
        mono
        label="Workspace"
        name="workspace"
        iconLeading={<FolderClosed />}
        defaultValue="/workspace"
        description="Guest mount. Writes stay inside the environment rootfs."
      />
      <InputField
        mono
        invalid
        label="Protected path"
        name="protected-path"
        iconLeading={<FolderClosed />}
        defaultValue="/etc/ssh"
        error="High-risk path. Ask before any write under /etc, .ssh, or secrets."
        description="Observation marks this prefix as high-risk."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Path fields are mono. A protected prefix is danger, not a silent Allow — pair it with a disabled Apply action.",
      },
    },
  },
};

export const ModelEndpoint: Story = {
  name: "Model endpoint",
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <InputField
        mono
        label="Local endpoint"
        name="endpoint"
        prefix="http://"
        placeholder="127.0.0.1:11434"
        defaultValue="127.0.0.1:11434"
        description="Ollama · model router. Does not block cloud fallback."
        clearable
      />
    </div>
  ),
};

export const SecretReference: Story = {
  name: "Secret reference",
  render: () => (
    <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <InputField
        mono
        type="password"
        label="Secret"
        name="secret"
        iconLeading={<KeyRound />}
        autoComplete="off"
        defaultValue="tvly-live-placeholder"
        description="Stored in the host secret store. The guest receives a reference, not the raw value."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Reveal is on for password fields so a mistyped reference can be checked. Do not log the revealed value on the observation plane.",
      },
    },
  },
};

export const PublishImageTag: Story = {
  name: "Publish image tag",
  render: () => (
    <div className="w-96">
      <InputField
        mono
        label="Image tag"
        name="tag"
        iconLeading={<Tag />}
        prefix="terrarium/"
        placeholder="web-research:0.1.0"
        defaultValue="web-research:0.1.0"
        description="Blocked above 2 GiB. Tag is recorded on the publish bus."
      />
    </div>
  ),
};

export const SnapshotLabel: Story = {
  name: "Snapshot label",
  render: () => (
    <div className="w-80">
      <InputField
        label="Checkpoint"
        name="snapshot"
        iconLeading={<Camera />}
        placeholder="before-publish"
        defaultValue="before-publish"
        description="8 / 10 used. Oldest auto point drops next."
        clearable
      />
    </div>
  ),
};

export const McpCommand: Story = {
  name: "MCP command",
  render: () => (
    <div className="w-md">
      <InputField
        mono
        size="lg"
        label="MCP server"
        name="mcp"
        iconLeading={<Server />}
        placeholder="npx -y @terrarium/mcp-server"
        defaultValue="npx -y @terrarium/mcp-server"
        description="Host process. Tool calls still pass the gateway."
      />
    </div>
  ),
};

export const ObservationFilter: Story = {
  name: "Observation filter",
  render: function FilterStory() {
    const [query, setQuery] = React.useState("snapshot");
    return (
      <div className="w-80 rounded-panel border border-(--color-border) bg-(--color-bg) p-2">
        <Input
          variant="ghost"
          size="sm"
          mono
          aria-label="Filter events"
          placeholder="Filter events"
          iconLeading={<Search />}
          value={query}
          onValueChange={setQuery}
          clearable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Status-bar density. Ghost variant, no label chrome — the accessible name is aria-label.",
      },
    },
  },
};

export const SlugValidation: Story = {
  name: "Slug validation",
  render: function SlugStory() {
    const [value, setValue] = React.useState("Web Research");
    const invalid = !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
    return (
      <div className="w-80">
        <InputField
          label="Environment slug"
          name="slug"
          value={value}
          onValueChange={setValue}
          invalid={invalid}
          error={invalid ? "Use lowercase letters, numbers, and single hyphens." : undefined}
          description="Runtime id. Not shown to the guest as a path."
        />
      </div>
    );
  },
};

export const LocaleZhHant: Story = {
  name: "Locale · zh-Hant",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <InputField
        label="環境名稱"
        name="environment"
        placeholder="web-research"
        defaultValue="web-research"
        description="訪客環境 · 預設映像 web-research"
      />
      <InputField
        mono
        label="工作區"
        name="workspace"
        iconLeading={<FolderClosed />}
        defaultValue="/workspace"
        description="寫入限制在訪客根檔案系統內"
      />
      <InputField
        mono
        type="password"
        label="密鑰參考"
        name="secret"
        iconLeading={<KeyRound />}
        defaultValue="tvly-live-placeholder"
        description="主機密鑰庫保存原值，訪客只收到參考"
      />
    </div>
  ),
};

export const WithAction: Story = {
  name: "With action",
  render: function PublishActionStory() {
    const [tag, setTag] = React.useState("web-research:0.1.0");
    const [publishing, setPublishing] = React.useState(false);
    const valid = /^[a-z0-9][a-z0-9._:-]{0,127}$/.test(tag);

    return (
      <form
        className="w-md rounded-panel border border-(--color-border) bg-(--color-surface) p-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!valid || publishing) return;
          setPublishing(true);
          window.setTimeout(() => setPublishing(false), 900);
        }}
      >
        <div className="flex items-start gap-2">
          <InputField
            mono
            label="Image tag"
            name="tag"
            iconLeading={<Tag />}
            value={tag}
            onValueChange={setTag}
            invalid={!valid}
            error={valid ? undefined : "Tag must match ^[a-z0-9][a-z0-9._:-]{0,127}$"}
            description="Blocked above 2 GiB. Publish does not auto-approve."
            fieldClassName="min-w-0 flex-1"
          />
          <div className="pt-6.5">
            <Button type="submit" variant="primary" disabled={!valid} isLoading={publishing}>
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
          "Publish preflight. The button matches control height (`h-ctrl-md`) and sits beside the field, not inside it. An invalid tag keeps Publish disabled — do not auto-approve.",
      },
    },
  },
};