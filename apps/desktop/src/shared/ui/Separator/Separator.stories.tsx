import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          "Hairline rule on Base UI `Separator`. Uses `--color-border` and `--border-width`. Default is semantic (`role=\"separator\"`); pass `decorative` for chrome that should be ignored by screen readers.",
      },
    },
  },
  args: {
    orientation: "horizontal",
    decorative: false,
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Playground: Story = {
  render: (args) => (
    <div
      className={
        args.orientation === "vertical"
          ? "flex h-16 items-center"
          : "w-80"
      }
    >
      <Separator {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
      <p className="text-title">Environment</p>
      <p className="text-compact text-(--color-text-secondary)">
        web-research · Ready
      </p>
      <Separator className="my-3" />
      <p className="text-compact text-(--color-text-secondary)">
        Snapshot queued. Protected paths stay ask-gated.
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-compact">
      <section className="px-2">
        <p className="text-title">Observe</p>
        <p className="text-compact text-(--color-text-secondary)">Snapshot queued</p>
      </section>
      <Separator orientation="vertical" decorative />
      <section className="px-2">
        <p className="text-title">Runtime</p>
        <p className="text-compact text-(--color-text-secondary)">Live</p>
      </section>
      <Separator orientation="vertical" decorative />
      <section className="px-2">
        <p className="text-title">Review</p>
        <p className="text-compact text-(--color-text-secondary)">Approved</p>
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical rules stretch to the row via `self-stretch`. The parent needs a defined cross-size (here `h-8`, matching `--control-height-sm`).",
      },
    },
  },
};

export const ToolbarCluster: Story = {
  name: "Toolbar cluster",
  render: () => (
    <div className="inline-flex h-ctrl-md items-center gap-1 rounded-panel border border-(--color-border) bg-(--color-surface) px-1">
      <span className="px-2 text-compact text-(--color-text-primary)">Approve once</span>
      <Separator orientation="vertical" decorative className="mx-1" />
      <span className="px-2 text-compact text-(--color-text-secondary)">
        Approve similar · 1h
      </span>
      <Separator orientation="vertical" decorative className="mx-1" />
      <span className="px-2 text-compact text-danger">Deny</span>
    </div>
  ),
};

export const SectionStack: Story = {
  name: "Section stack",
  render: () => (
    <div className="w-80">
      <section className="py-2">
        <p className="text-title">Tools</p>
        <p className="text-compact text-(--color-text-secondary)">gateway · 3 granted</p>
      </section>
      <Separator />
      <section className="py-2">
        <p className="text-title">Secrets</p>
        <p className="text-compact text-(--color-text-secondary)">none mounted</p>
      </section>
      <Separator />
      <section className="py-2">
        <p className="text-title">Publish</p>
        <p className="text-compact text-(--color-text-secondary)">remote idle</p>
      </section>
    </div>
  ),
};

export const DecorativeVsSemantic: Story = {
  name: "Decorative vs semantic",
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div>
        <p className="mb-2 text-compact text-(--color-text-tertiary)">
          Semantic — announced as a separator
        </p>
        <Separator />
      </div>
      <div>
        <p className="mb-2 text-compact text-(--color-text-tertiary)">
          Decorative — role none, aria-hidden
        </p>
        <Separator decorative />
      </div>
    </div>
  ),
};
