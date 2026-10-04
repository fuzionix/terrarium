import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";
import type { AvatarStatus } from "./Avatar";
import { Mote, MOTE_PALETTES, EYE_STYLES } from "@/shared/characters";

const STATUSES: AvatarStatus[] = ["ready", "running", "paused", "failed", "remote", "offline"];

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Avatar frame on Base UI `Avatar.Root` + `Avatar.Fallback`. The frame owns size, status, and focus. The glyph is a character slot; the default is Mote. Display-name seeds are hashed into the same 32 nibble table.",
      },
    },
  },
  args: {
    label: "Tera",
    seed: "Tera",
    size: "lg",
    isLive: true,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    status: {
      control: "select",
      options: [undefined, ...STATUSES],
    },
    palette: { control: "select", options: [undefined, ...MOTE_PALETTES.map((item) => item.id)] },
    eye: { control: "select", options: [undefined, ...EYE_STYLES] },
    isLive: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar size="sm" seed="sm" label="Small mote" />
      <Avatar size="md" seed="md" label="Medium mote" />
      <Avatar size="lg" seed="lg" label="Large mote" />
      <Avatar size="xl" seed="xl" label="Extra large mote" />
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {STATUSES.map((status) => (
        <Avatar key={status} size="lg" seed={status} status={status} label={status} />
      ))}
    </div>
  ),
};

export const UuidSeed: Story = {
  name: "UUID seed",
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar
        size="xl"
        seed="01a1039f-2953-769f-bb8e-e6cfe19d1f36"
        label="01a1039f-2953-769f-bb8e-e6cfe19d1f36"
        status="running"
      />
      <Avatar
        size="xl"
        seed="urn:uuid:01a1039f-916d-76eb-917c-abf28051cd67"
        label="urn:uuid:01a1039f-916d-76eb-917c-abf28051cd67"
        status="remote"
      />
    </div>
  ),
};

export const Roster: Story = {
  name: "Live roster",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {["tera", "moss", "ink", "lagoon", "coral", "iris", "amber", "paper", "quill", "orbit"].map(
        (seed) => (
          <Avatar key={seed} size="lg" seed={seed} label={seed} status="ready" />
        ),
      )}
    </div>
  ),
};

export const CustomCharacter: Story = {
  name: "Character slot",
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="xl" label="Default mote" seed="tera" />
      <Avatar
        size="xl"
        label="Slotted character"
        status="running"
        character={
          <svg viewBox="0 0 32 32" aria-hidden="true" className="size-full">
            <rect x="1" y="1" width="30" height="30" rx="9.6" fill="#0f172a" />
            <line
              x1="12"
              y1="13"
              x2="12"
              y2="18"
              stroke="#22d3ee"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            <line
              x1="20"
              y1="13"
              x2="20"
              y2="18"
              stroke="#22d3ee"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pass `character` to keep Avatar sizing, radius, status, and focus while swapping the glyph. Mote stays importable on its own.",
      },
    },
  },
};

export const Interactive: Story = {
  render: () => (
    <Avatar
      size="lg"
      seed="orbit"
      label="Open Orbit"
      status="remote"
      render={<button type="button" />}
    />
  ),
};

export const WithMoteDirect: Story = {
  name: "Mote outside the frame",
  render: () => (
    <div className="flex items-center gap-4">
      <div className="size-16">
        <Mote seed="orbit" eye="focus" isLive={false} />
      </div>
      <Avatar size="xl" seed="orbit" eye="focus" label="Same mote, framed" />
    </div>
  ),
};
