import { Sidebar } from "./components/shell/Sidebar";
import { Header } from "./components/shell/Header";
import { TracePanel } from "./components/shell/TracePanel";
import { useUIStore } from "./stores/ui";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { usePolling } from "./hooks/usePolling";
import { SessionMode } from "./types";

function App() {
  const { activeMode } = useUIStore();
  
  // Custom hooks
  useKeyboardShortcuts();
  usePolling();

  const renderContent = () => {
    switch (activeMode) {
      case SessionMode.CHAT:
        return (
          <div className="flex h-full items-center justify-center text-text-secondary">
            [CHAT MODE PLACEHOLDER]
          </div>
        );
      case SessionMode.RESEARCH:
        return (
          <div className="flex h-full items-center justify-center text-text-secondary">
            [RESEARCH MODE PLACEHOLDER]
          </div>
        );
      case SessionMode.DELIBERATION:
        return (
          <div className="flex h-full items-center justify-center text-text-secondary">
            [DELIBERATION MODE PLACEHOLDER]
          </div>
        );
      case SessionMode.WORKSPACE:
        return (
          <div className="flex h-full items-center justify-center text-text-secondary">
            [WORKSPACE MODE PLACEHOLDER]
          </div>
        );
      case SessionMode.ARENA:
        return (
          <div className="flex h-full items-center justify-center text-text-secondary">
            [ARENA MODE PLACEHOLDER]
          </div>
        );
      case SessionMode.REPLAY:
        return (
          <div className="flex h-full items-center justify-center text-text-secondary">
            [REPLAY MODE PLACEHOLDER]
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base font-sans leading-relaxed text-text-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-bg-base p-6">
          {renderContent()}
        </main>
      </div>
      <TracePanel />
    </div>
  );
}

export default App;
