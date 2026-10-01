import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Ban, Check, Rocket, ShieldOff } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Aligned with Design System and Frontend Dev Guide. Uses Base UI `Button` as the unstyled primitive."
      },
    },
  },
  args: {
    children: "Approve once",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    progress: { control: "number" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Approve once</Button>
      <Button variant="secondary">Rewrite & rerun</Button>
      <Button variant="ghost">Later</Button>
      <Button variant="danger">Deny</Button>
    </div>
  ),
};

export const HitlCluster: Story = {
  name: "HITL cluster",
  render: () => (
    <div className="flex flex-wrap items-center gap-2 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <Button variant="primary" size="sm" iconLeading={<Check />}>
        Approve once
      </Button>
      <Button variant="secondary" size="sm">
        Approve similar · 1h
      </Button>
      <Button variant="secondary" size="sm">
        Rewrite & rerun
      </Button>
      <Button variant="danger" size="sm">
        Deny
      </Button>
      <Button variant="danger" size="sm" iconLeading={<Ban />}>
        Abort agent
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Approve once, Approve similar (TTL required), Rewrite & rerun, Deny, and Abort agent. Timeout policy must be PauseWait or AutoDeny, never AutoAllow.",
      },
    },
  },
};

export const InsufficientCard: Story = {
  name: "Insufficient info (Approval disabled)",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" size="sm" disabled>
        Approve once
      </Button>
      <Button variant="secondary" size="sm">
        Rewrite & rerun
      </Button>
      <Button variant="danger" size="sm">
        Deny
      </Button>
    </div>
  ),
};

export const LoadingAndDisabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" isLoading>
        Publishing…
      </Button>
      <Button variant="secondary" disabled>
        No image selected (disabled)
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" iconLeading={<Check />} aria-label="Approve once" />
      <Button variant="secondary" size="md" iconLeading={<ShieldOff />} aria-label="Destroy environment" />
      <Button variant="danger" size="lg" iconLeading={<Ban />} aria-label="Abort agent" />
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <Button variant="primary" fullWidth iconLeading={<Rocket />}>
        Deploy to remote
      </Button>
    </div>
  ),
};

export const ProgressBackground: Story = {
  name: "Progress background",
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const id = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 4));
      }, 180);
      return () => clearInterval(id);
    }, []);

    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" progress={progress} isLoading={progress < 100}>
          Publishing
        </Button>
        <Button variant="secondary" progress={progress} isLoading={progress < 100}>
          Snapshotting
        </Button>
        <Button variant="ghost" progress={progress} isLoading={progress < 100}>
          Restoring
        </Button>
        <Button variant="danger" progress={progress} isLoading={progress < 100}>
          Rolling back
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`progress` (0–100) renders a filled track behind the button's content, clipped to the button's radius and tinted per variant (white overlay on `primary`, brand tint on `secondary`/`ghost`, danger tint on `danger`). Pair with `isLoading` while the operation is still indeterminate.",
      },
    },
  },
};