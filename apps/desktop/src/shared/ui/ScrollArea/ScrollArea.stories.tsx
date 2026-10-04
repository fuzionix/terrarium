import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ban, Check, ScrollText, ShieldAlert } from "lucide-react";
import { Button } from "../Button/Button";
import { ScrollArea } from "./ScrollArea";

const meta: Meta<typeof ScrollArea> = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  parameters: {
    docs: {
      description: {
        component:
          "Native scroll container with overlay thumbs, for Terrarium panels that must shrink inside the IDE shell (transcript, guest log, environment roster, HITL queue). Built on Base UI Scroll Area. Parent flex/grid tracks need min-h-0 so the viewport, not the page, scrolls.",
      },
    },
  },
  args: {
    orientation: "vertical",
    visibility: "hover",
    fade: true,
    fadeSize: 28,
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
    },
    visibility: {
      control: "select",
      options: ["hover", "always"],
    },
    fade: { control: "boolean" },
    fadeSize: { control: "number" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const PANEL = "h-72 w-[28rem] max-w-full rounded-panel border border-(--color-border) bg-(--color-surface)";

type RunState = "ready" | "running" | "paused" | "ask" | "failed" | "snapshotting" | "remote" | "destroyed";

const STATE_CLASS: Record<RunState, string> = {
  ready: "text-success",
  running: "text-brand",
  paused: "text-warning",
  ask: "text-warning",
  failed: "text-danger",
  snapshotting: "text-system",
  remote: "text-remote",
  destroyed: "text-observe",
};

const ENVIRONMENTS: Array<{ id: string; image: string; state: RunState; detail: string }> = [
  { id: "env_7f3a", image: "web-research", state: "running", detail: "guest agentd · 2 tools in flight" },
  { id: "env_19c2", image: "web-research", state: "ask", detail: "HITL · write /workspace/notes.md" },
  { id: "env_b801", image: "python-repl", state: "paused", detail: "PauseWait · approval timeout 00:42" },
  { id: "env_04de", image: "web-research", state: "snapshotting", detail: "snapshot snap_88 · freezing" },
  { id: "env_aa10", image: "browser-guest", state: "remote", detail: "publishing · runtime-remote" },
  { id: "env_6611", image: "python-repl", state: "failed", detail: "exit 1 · ModuleNotFoundError" },
  { id: "env_90ab", image: "web-research", state: "ready", detail: "warm · last exit 0" },
  { id: "env_33e0", image: "browser-guest", state: "destroyed", detail: "observe only · disk released" },
  { id: "env_c4d2", image: "web-research", state: "running", detail: "mcp-host · 14 resources" },
  { id: "env_e917", image: "python-repl", state: "ask", detail: "protected path · ~/.ssh/config" },
];

export const Playground: Story = {
  render: (args) => (
    <ScrollArea {...args} className={PANEL} aria-label="Environment roster">
      <ul className="flex flex-col">
        {ENVIRONMENTS.map((env) => (
          <li
            key={env.id}
            className="flex items-baseline justify-between gap-3 border-b border-(--color-border) px-3 py-2 last:border-b-0"
          >
            <span className="min-w-0">
              <span className="block truncate font-mono text-compact text-(--color-text-primary)">{env.id}</span>
              <span className="block truncate text-compact text-(--color-text-tertiary)">{env.image} · {env.detail}</span>
            </span>
            <span className={`shrink-0 font-mono text-micro uppercase ${STATE_CLASS[env.state]}`}>{env.state}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

const TRANSCRIPT = [
  { kind: "system", text: "env_7f3a entered Running. Policy: Ask on protected paths, never AutoAllow." },
  { kind: "agent", text: "Search the guest filesystem for the recipe, then summarise outbound hosts." },
  { kind: "tool", name: "fs.read", text: "guest/images/web-research/recipe.toml · 86 lines" },
  { kind: "observe", text: "tool-gateway allowed fs.read. observation span 140ms." },
  { kind: "tool", name: "shell.exec", text: "ss -tnp | head · established sockets" },
  { kind: "ask", text: "Write /workspace/notes.md? Path is inside the workspace, not a protected root." },
  { kind: "agent", text: "Waiting on Approve once. Similar writes can be pinned for 1h — timeout stays PauseWait." },
  { kind: "tool", name: "fs.write", text: "denied preview · notes.md not committed" },
  { kind: "observe", text: "review-bus parked the call. No snapshot taken." },
  { kind: "agent", text: "If denied, rewrite the call to stdout only and rerun against the same snapshot." },
];

export const AgentTranscript: Story = {
  name: "Agent transcript",
  render: () => (
    <ScrollArea fade className={`${PANEL} bg-(--color-bg)`} aria-label="Agent transcript">
      <ol className="flex flex-col gap-2 p-3 pr-4">
        {TRANSCRIPT.map((line, index) => (
          <li key={index} className="rounded-control border border-(--color-border) bg-(--color-surface) px-3 py-2">
            <span className="font-mono text-micro uppercase text-(--color-text-tertiary)">
              {line.kind === "tool" ? line.name : line.kind}
            </span>
            <p className="mt-0.5 text-compact leading-4 text-(--color-text-primary)">{line.text}</p>
          </li>
        ))}
      </ol>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Observation stream beside the run. Fade uses --scroll-area-overflow-y-start/end so the mask collapses at the true edges instead of a permanent gradient.",
      },
    },
  },
};

const LOG_LINES = [
  "agentd  info  attached jobd pid=441",
  "jobd    info  image web-research recipe digest sha256:9c1e…",
  "net     warn  egress api.example.test not on allowlist",
  "fs      deny  open /etc/ssl/private/guest.key  high-risk",
  "fs      deny  open ~/.ssh/id_ed25519  high-risk",
  "tool    info  fs.read guest/images/web-research/recipe.toml exit 0",
  "tool    info  shell.exec ss -tnp exit 0  140ms",
  "hitl    ask   fs.write /workspace/notes.md  PauseWait",
  "snap    info  skip snapshot, review-bus unresolved",
  "agentd  info  heartbeat env_7f3a state=ask",
  "mcp     info  resources listed 14",
  "jobd    info  no child reaped",
];

export const GuestLog: Story = {
  name: "Guest log",
  render: () => (
    <ScrollArea
      fade
      visibility="always"
      className={`${PANEL} bg-(--color-bg)`}
      contentClassName="font-mono text-compact"
      aria-label="Guest log"
    >
      <pre className="m-0 px-3 py-2 pr-4 leading-5">
        {LOG_LINES.map((line) => {
          const highRisk = line.includes("high-risk") || line.includes("deny");
          return (
            <div key={line} className={highRisk ? "text-high-risk" : "text-(--color-text-secondary)"}>
              {line}
            </div>
          );
        })}
      </pre>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "runtime-microsandbox stdout. visibility=always keeps the thumb mounted for long traces. Protected-path denials use the high-risk token.",
      },
    },
  },
};

export const HitlQueue: Story = {
  name: "HITL queue",
  render: () => (
    <ScrollArea fade className="h-80 w-lg max-w-full rounded-panel border border-(--color-border) bg-(--color-bg)" aria-label="Approval queue">
      <ul className="flex flex-col gap-2 p-3 pr-4">
        {[
          { title: "fs.write /workspace/notes.md", risk: "workspace", hold: "Approve available" },
          { title: "fs.read ~/.ssh/config", risk: "protected", hold: "Approve disabled · insufficient scope" },
          { title: "shell.exec curl https://files.example", risk: "egress", hold: "Ask · host not on allowlist" },
        ].map((item) => (
          <li key={item.title} className="rounded-panel border border-(--color-border) bg-(--color-surface) p-3">
            <div className="mb-2 flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-medium text-ui">
                  {item.risk === "protected" ? <ShieldAlert className="size-3.5 text-high-risk" /> : <ScrollText className="size-3.5 text-(--color-text-tertiary)" />}
                  <span className="truncate font-mono text-compact">{item.title}</span>
                </span>
                <span className="mt-1 block text-compact text-(--color-text-tertiary)">{item.hold}</span>
              </span>
              <span className="shrink-0 font-mono text-micro uppercase text-warning">ask</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" iconLeading={<Check />} disabled={item.risk === "protected"}>
                Approve once
              </Button>
              <Button variant="secondary" size="sm" disabled={item.risk === "protected"}>
                Approve similar · 1h
              </Button>
              <Button variant="secondary" size="sm">Rewrite & rerun</Button>
              <Button variant="danger" size="sm">Deny</Button>
              <Button variant="danger" size="sm" iconLeading={<Ban />}>Abort agent</Button>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Queue scrolls; the decision cluster does not. Protected-path calls keep Approve disabled. Timeout policy remains PauseWait or AutoDeny.",
      },
    },
  },
};

const TRACE_ROWS = Array.from({ length: 18 }, (_, index) => ({
  t: `12:0${index % 10}:${(index * 7) % 60}`.padEnd(8, "0").slice(0, 8),
  env: index % 2 === 0 ? "env_7f3a" : "env_19c2",
  tool: index % 3 === 0 ? "shell.exec" : index % 3 === 1 ? "fs.read" : "mcp.call",
  span: `${80 + index * 13}ms`,
  result: index === 4 ? "ask" : index === 11 ? "deny" : "allow",
}));

export const ToolTrace: Story = {
  name: "Tool trace (both axes)",
  render: () => (
    <ScrollArea
      orientation="both"
      fade="both"
      visibility="always"
      className="h-64 w-md max-w-full rounded-panel border border-(--color-border) bg-(--color-bg)"
      aria-label="Tool trace"
    >
      <table className="w-max border-separate border-spacing-0 font-mono text-compact">
        <thead>
          <tr className="text-left text-micro uppercase text-(--color-text-tertiary)">
            {["time", "env", "tool", "target", "span", "decision", "policy"].map((heading) => (
              <th key={heading} className="sticky top-0 border-b border-(--color-border) bg-(--color-bg) px-3 py-1.5 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRACE_ROWS.map((row) => (
            <tr key={`${row.t}-${row.tool}`} className="text-(--color-text-secondary)">
              <td className="border-b border-(--color-border) px-3 py-1.5">{row.t}</td>
              <td className="border-b border-(--color-border) px-3 py-1.5">{row.env}</td>
              <td className="border-b border-(--color-border) px-3 py-1.5">{row.tool}</td>
              <td className="border-b border-(--color-border) px-3 py-1.5">guest/images/web-research/recipe.toml</td>
              <td className="border-b border-(--color-border) px-3 py-1.5 tabular-nums">{row.span}</td>
              <td className={`border-b border-(--color-border) px-3 py-1.5 ${row.result === "deny" ? "text-danger" : row.result === "ask" ? "text-warning" : "text-success"}`}>
                {row.result}
              </td>
              <td className="border-b border-(--color-border) px-3 py-1.5">Ask on protected · no AutoAllow</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Both scrollbars plus Corner. Content is w-max so the wide trace can scroll horizontally without stretching the panel.",
      },
    },
  },
};

const SNAPSHOTS = [
  { id: "snap_81", label: "before search", state: "ready" },
  { id: "snap_84", label: "after fs.read", state: "ready" },
  { id: "snap_88", label: "freezing", state: "snapshotting" },
  { id: "snap_90", label: "restore candidate", state: "remote" },
  { id: "snap_91", label: "published", state: "remote" },
  { id: "snap_77", label: "destroyed", state: "destroyed" },
  { id: "snap_76", label: "exit 0", state: "ready" },
];

export const SnapshotRail: Story = {
  name: "Snapshot rail",
  render: () => (
    <ScrollArea
      orientation="horizontal"
      fade="horizontal"
      className="w-md max-w-full rounded-panel border border-(--color-border) bg-(--color-surface)"
      aria-label="Snapshots"
    >
      <ul className="flex w-max gap-2 p-2">
        {SNAPSHOTS.map((snap) => (
          <li key={snap.id} className="w-36 shrink-0 rounded-control border border-(--color-border) bg-(--color-bg) px-2.5 py-2">
            <span className="block font-mono text-compact text-(--color-text-primary)">{snap.id}</span>
            <span className="block truncate text-compact text-(--color-text-tertiary)">{snap.label}</span>
            <span className={`font-mono text-micro uppercase ${STATE_CLASS[snap.state as RunState]}`}>{snap.state}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const NoOverflow: Story = {
  name: "No overflow",
  render: () => (
    <ScrollArea fade className={PANEL} aria-label="Idle environment">
      <div className="px-3 py-2">
        <span className="font-mono text-compact">env_90ab</span>
        <span className="mt-1 block text-compact text-(--color-text-tertiary)">Ready · warm pool · scrollbar stays unmounted.</span>
      </div>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Base UI unmounts a scrollbar when that axis has no overflow, unless visibility is always (keepMounted).",
      },
    },
  },
};

export const DarkTranscript: Story = {
  name: "Dark transcript",
  render: () => (
    <div data-theme="dark" className="w-fit rounded-panel bg-(--color-bg) p-3 text-(--color-text-primary)">
      <ScrollArea fade className={`${PANEL} bg-(--color-bg)`} aria-label="Agent transcript, dark">
        <ol className="flex flex-col gap-2 p-3 pr-4">
          {TRANSCRIPT.slice(0, 6).map((line, index) => (
            <li key={index} className="rounded-control border border-(--color-border) bg-(--color-surface) px-3 py-2">
              <span className="font-mono text-micro uppercase text-(--color-text-tertiary)">{line.kind}</span>
              <p className="mt-0.5 text-compact leading-4">{line.text}</p>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  ),
};