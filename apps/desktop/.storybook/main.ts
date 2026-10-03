import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const here = dirname(fileURLToPath(import.meta.url));
const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/shared/ui/**/*.stories.@(ts|tsx)",
    "../src/shared/characters/**/*.stories.@(ts|tsx)",
    "../src/workspace/**/*.stories.@(ts|tsx)",
    "../src/features/**/*.stories.@(ts|tsx)",
    "../../../packages/ui-sdk/src/**/*.stories.@(ts|tsx)",
  ],

  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => !/node_modules/.test(prop.parent?.fileName ?? ""),
    },
  },

  core: {
    disableTelemetry: true,
  },

  staticDirs: ["../public"],

  viteFinal: async (viteConfig) => {
    const { mergeConfig } = await import("vite");
    const tailwindcss = (await import("@tailwindcss/vite")).default;

    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": resolve(here, "../src"),
        },
      },
    });
  },
};

export default config;