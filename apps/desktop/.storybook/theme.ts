import { create } from "storybook/theming/create";

export default create({
  base: "light",
  brandTitle: "Terrarium Design System",
  brandUrl: "https://terrarium.dev",
  brandTarget: "_self",

  colorPrimary: "#2648F2",
  colorSecondary: "#1E3ECB",

  // UI Backgrounds
  appBg: "#FDFDFE",
  appContentBg: "#FFFFFF",
  appPreviewBg: "#FFFFFF",
  appBorderColor: "rgba(15, 23, 42, 0.08)",
  appBorderRadius: 6,

  // Text colors
  textColor: "#0F172A",
  textInverseColor: "#FFFFFF",
  textMutedColor: "#475569",

  // Toolbar & Tabs
  barBg: "#FFFFFF",
  barTextColor: "#475569",
  barSelectedColor: "#2648F2",

  fontBase: '"Figtree", system-ui, sans-serif',
  fontCode: '"JetBrains Mono", monospace',
});