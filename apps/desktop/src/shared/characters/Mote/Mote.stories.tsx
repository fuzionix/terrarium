import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mote } from "./Mote";
import { MOTE_PALETTES } from "./palette";

const meta: Meta<typeof Mote> = {
  title: "Characters/Mote",
  component: Mote,
  parameters: {
    docs: {
      description: {
        component:
          "Character design system. Rounded-square body and thick round-cap eye strokes only. Eyes slide on a cylindrical rounded box; rim poses foreshorten and protrude. No raster and no initials. Avatar chrome does not live here.",
      },
    },
  },
  args: {
    seed: "tera",
    isLive: true,
    look: { x: 0, y: 0 },
  },
  argTypes: {
    palette: {
      control: "select",
      options: [undefined, ...MOTE_PALETTES.map((palette) => palette.id)],
    },
    isLive: { control: "boolean" },
    look: { control: "object" },
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

type Story = StoryObj<typeof Mote>;

export const Playground: Story = {};

export const Palette: Story = {
  decorators: [],
  render: () => (
    <div className="flex items-end gap-4">
      {MOTE_PALETTES.map((palette) => (
        <figure key={palette.id} className="flex flex-col items-center gap-2">
          <div className="size-12">
            <Mote seed={palette.id} palette={palette.id} />
          </div>
          <figcaption className="text-compact text-(--color-text-secondary)">{palette.id}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Still: Story = {
  args: { isLive: false, palette: "ink" },
};

export const Gaze: Story = {
  args: {
    look: { x: 0.5, y: -0.3 },
    palette: "lemon",
  },
};