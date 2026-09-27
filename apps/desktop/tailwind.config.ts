import type { Config } from "tailwindcss";

// Token-only theme extension (Design System v1.0).
// Components must reference these names; hardcoded neutral hex is forbidden.
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui-sdk/src/**/*.{ts,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2648F2",
          hover: "#1E3ECB",
          muted: "rgba(38,72,242,.12)",
          ring: "rgba(38,72,242,.60)",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        system: "#A78BFA",
        remote: "#22D3EE",
        observe: "#64748B",
        "high-risk": "#FB7185",
      },
      borderRadius: {
        control: "4px",
        panel: "6px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        micro: ["11px", { lineHeight: "1.2", fontWeight: "500" }],
        compact: ["12px", { lineHeight: "16px" }],
        ui: ["13px", { lineHeight: "20px" }],
        title: ["14px", { lineHeight: "20px", fontWeight: "600" }],
      },
      spacing: {
        "ctrl-sm": "24px",
        "ctrl-md": "28px",
        "ctrl-lg": "32px",
      },
    },
  },
  plugins: [],
} satisfies Config;