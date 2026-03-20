export default function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-bg-base font-sans text-text-primary">
      <div className="flex flex-col items-center space-y-4 rounded-lg border border-border bg-bg-surface p-8 shadow-xl">
        <h1 className="text-xl font-bold tracking-tight text-accent">Stoa GUI</h1>
        <p className="text-sm text-text-secondary">Project Bootstrap Complete (M0-WP01)</p>
        <div className="flex space-x-2">
          <span className="flex items-center space-x-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
            <span>Shell Loaded</span>
          </span>
        </div>
      </div>
    </div>
  );
}
