import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Cloud,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  ShieldAlert,
  Wifi,
  WifiOff,
  WrapText,
} from "lucide-react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          "Two-state button for Terrarium toolbars and inspector rows. Wraps Base UI `Toggle` so `aria-pressed` and `data-pressed` stay on the control. `value` is forwarded for a future `ToggleGroup` (Allow / Ask / Deny, density, runtime) — do not build exclusive selection here. Not a form switch: on/off settings that are not buttons stay on Switch.",
      },
    },
  },
  args: {
    children: "Observe",
    variant: "ghost",
    size: "md",
    defaultPressed: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: { control: "select", options: ["ghost", "outline", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    pressed: { control: false },
    onPressedChange: { control: false },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Toggle size="sm" defaultPressed icon={<Eye />}>
        Status bar
      </Toggle>
      <Toggle size="md" defaultPressed icon={<Eye />}>
        Inspector
      </Toggle>
      <Toggle size="lg" variant="outline" icon={<Cloud />}>
        Create dialog
      </Toggle>
      <Toggle size="xl" variant="outline" icon={<Pin />}>
        Command palette
      </Toggle>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle variant="ghost" defaultPressed icon={<Eye />}>
        Ghost
      </Toggle>
      <Toggle variant="outline" defaultPressed icon={<Pin />}>
        Outline
      </Toggle>
      <Toggle variant="danger" defaultPressed icon={<ShieldAlert />}>
        Danger
      </Toggle>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle variant="outline" icon={<Eye />}>
        Off
      </Toggle>
      <Toggle variant="outline" defaultPressed icon={<Eye />}>
        Pressed
      </Toggle>
      <Toggle variant="outline" disabled icon={<Eye />}>
        Disabled
      </Toggle>
      <Toggle variant="outline" disabled defaultPressed icon={<Eye />}>
        Disabled pressed
      </Toggle>
    </div>
  ),
};

export const IconOnlyToolbar: Story = {
  name: "Icon-only toolbar",
  render: function ToolbarStory() {
    const [observe, setObserve] = React.useState(true);
    const [pinned, setPinned] = React.useState(false);
    const [wrap, setWrap] = React.useState(true);
    return (
      <div className="inline-flex items-center gap-0.5 rounded-panel border border-(--color-border) bg-(--color-surface) p-1">
        <Toggle
          size="sm"
          pressed={observe}
          onPressedChange={setObserve}
          icon={<Eye />}
          iconPressed={<EyeOff />}
          aria-label="Observe mode"
          value="observe"
        />
        <Toggle
          size="sm"
          pressed={pinned}
          onPressedChange={setPinned}
          icon={<Pin />}
          iconPressed={<PinOff />}
          aria-label="Pin inspector"
          value="pin"
        />
        <Toggle
          size="sm"
          pressed={wrap}
          onPressedChange={setWrap}
          icon={<WrapText />}
          aria-label="Wrap editor lines"
          value="wrap"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Status-bar density. Icon-only toggles need an accessible name. Each `value` is a stable id for a future ToggleGroup — these three are independent, so they are not grouped yet.",
      },
    },
  },
};

export const ObserveMode: Story = {
  name: "Observe mode",
  render: function ObserveStory() {
    const [pressed, setPressed] = React.useState(true);
    return (
      <div className="w-80 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Toggle
          variant="outline"
          pressed={pressed}
          onPressedChange={setPressed}
          icon={<Eye />}
          iconPressed={<EyeOff />}
          aria-label="Observe mode"
          value="observe"
        >
          {pressed ? "Observing" : "Observe"}
        </Toggle>
        <p className="mt-2 truncate font-sans text-compact text-(--color-text-tertiary)">
          {pressed
            ? "Guest writes are recorded. Nothing is auto-approved."
            : "Observation plane is quiet. Tool calls still hit the gateway."}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Environment inspector. Observe is a pressed tool state, not a permission. Allow / Ask / Deny stays a future ToggleGroup — never a single Toggle.",
      },
    },
  },
};

export const CloudFallback: Story = {
  name: "Cloud fallback",
  render: function CloudStory() {
    const [pressed, setPressed] = React.useState(false);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Toggle
          variant="outline"
          pressed={pressed}
          onPressedChange={setPressed}
          icon={<Cloud />}
          value="cloud-fallback"
        >
          Cloud fallback
        </Toggle>
        <p className="mt-2 font-sans text-compact text-(--color-text-tertiary)">
          Local endpoint stays 127.0.0.1:11434. Pressed only routes after the model router misses.
        </p>
      </div>
    );
  },
};

export const GuestNetwork: Story = {
  name: "Guest network",
  render: function NetworkStory() {
    const [pressed, setPressed] = React.useState(false);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Toggle
          variant="outline"
          pressed={pressed}
          onPressedChange={setPressed}
          icon={pressed ? <Wifi /> : <WifiOff />}
          value="egress"
        >
          {pressed ? "Egress on" : "Egress off"}
        </Toggle>
        <p className="mt-2 font-sans text-compact text-(--color-text-tertiary)">
          web-research recipe. Off keeps the microVM on the host bridge only.
        </p>
      </div>
    );
  },
};

export const AskBeforeWrite: Story = {
  name: "Ask before write",
  render: function AskStory() {
    const [pressed, setPressed] = React.useState(true);
    return (
      <div className="w-96 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
        <Toggle
          variant="danger"
          pressed={pressed}
          onPressedChange={setPressed}
          icon={<ShieldAlert />}
          value="ask-high-risk"
        >
          Ask on protected paths
        </Toggle>
        <p className="mt-2 font-sans text-compact text-(--color-text-tertiary)">
          {pressed
            ? "Prefixes /etc, .ssh, and secrets stay Ask. Pressed is not Allow."
            : "Unpressed does not grant writes. The gateway still denies protected paths."}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Danger variant is for a risky capability, not a destructive click. Pressed means the ask gate is armed. Auto-approve never ships as a Toggle.",
      },
    },
  },
};

export const GroupReadyValues: Story = {
  name: "Group-ready values",
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <p className="font-sans text-compact text-(--color-text-tertiary)">
        Independent today. Same `value` keys a future ToggleGroup can own.
      </p>
      <div className="inline-flex gap-1">
        <Toggle variant="outline" size="sm" value="allow" disabled>
          Allow
        </Toggle>
        <Toggle variant="outline" size="sm" value="ask" defaultPressed>
          Ask
        </Toggle>
        <Toggle variant="outline" size="sm" value="deny" disabled>
          Deny
        </Toggle>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Preview only — not a ToggleGroup. Items stay disabled except the current policy so this story cannot fake exclusive selection. Wire `value` through; group state lands with ToggleGroup.",
      },
    },
  },
};

export const LocaleZhHant: Story = {
  name: "Locale · zh-Hant",
  render: () => (
    <div className="flex w-80 flex-col items-start gap-3">
      <Toggle variant="outline" defaultPressed icon={<Eye />}>
        觀察模式
      </Toggle>
      <Toggle variant="outline" icon={<Cloud />}>
        雲端備援
      </Toggle>
      <Toggle variant="danger" defaultPressed icon={<ShieldAlert />}>
        受保護路徑先詢問
      </Toggle>
    </div>
  ),
};
