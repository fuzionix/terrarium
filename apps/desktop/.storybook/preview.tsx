import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import terrariumTheme from "./theme";

import "../src/styles/index.css";
import "../src/shared/fonts.css";
import "../src/shared/tokens.css";

const preview: Preview = {
  parameters: {
    layout: "padded",

    backgrounds: { disable: true },

    docs: {
      theme: terrariumTheme,
    },

    a11y: {
      test: "todo",
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },

    options: {
      storySort: {
        order: ["Foundation", "Primitives", "Product", "*"],
      },
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],

  tags: ["autodocs"],
};

export default preview;