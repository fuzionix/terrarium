import type { Meta, StoryObj } from "@storybook/react-vite";
import { Buddy } from "./Buddy";
import { BUDDY_PALETTES } from "./palette";
import { EYE_STYLES } from "./eyes";

const meta: Meta<typeof Buddy> = {
  title: "Characters/Buddy",
  component: Buddy,
  parameters: {
    docs: {
      description: {
        component: "Character design system. Rounded-square body and thick round-cap eye strokes only. No raster and no initials. Avatar chrome does not live here.",
      },
    },
  },
  args: {
    seed: "tera",
    isLive: true,
  },
  argTypes: {
    palette: {
      control: "select",
      options: [undefined, ...BUDDY_PALETTES.map((palette) => palette.id)],
    },
    eye: {
      control: "select",
      options: [undefined, ...EYE_STYLES],
    },
    isLive: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="size-16">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Buddy>;

export const Playground: Story = {};

export const EyeVersions: Story = {
  name: "Eye versions",
  decorators: [],
  render: () => (
    <div className="flex items-end gap-4">
      {EYE_STYLES.map((eye) => (
        <figure key={eye} className="flex flex-col items-center gap-2">
          <div className="size-12">
            <Buddy seed="eye-board" palette="brand" eye={eye} isLive={false} />
          </div>
          <figcaption className="text-compact text-(--color-text-secondary)">{eye}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Palette: Story = {
  decorators: [],
  render: () => (
    <div className="flex items-end gap-4">
      {BUDDY_PALETTES.map((palette) => (
        <figure key={palette.id} className="flex flex-col items-center gap-2">
          <div className="size-12">
            <Buddy seed={palette.id} palette={palette.id} eye="neutral" />
          </div>
          <figcaption className="text-compact text-(--color-text-secondary)">{palette.id}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Still: Story = {
  args: { isLive: false, eye: "neutral", palette: "ink" },
};
