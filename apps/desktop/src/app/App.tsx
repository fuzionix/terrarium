import { CSPProvider } from "@base-ui/react/csp-provider";
import { DirectionProvider } from "@base-ui/react/direction-provider";

export default function App() {
  return (
    <CSPProvider>
      <DirectionProvider direction="ltr">
        <div
          dir="ltr"
          className="flex h-screen w-screen items-center justify-center bg-(--color-bg) text-(--color-text-primary)"
        >
          <div className="rounded-panel border border-(--color-border) bg-(--color-surface) px-6 py-4 text-center">
            <p className="text-title">Terrarium</p>
            <p className="text-compact text-(--color-text-secondary)">
              Phase 0 scaffold — token pipeline OK
            </p>
          </div>
        </div>
      </DirectionProvider>
    </CSPProvider>
  );
}