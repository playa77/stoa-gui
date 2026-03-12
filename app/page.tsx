import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  return (
    <main className="grid h-screen grid-cols-[18rem_1fr_20rem] bg-muted/40" aria-label="Stoa workbench">
      <aside className="border-r bg-background p-4" aria-label="Session manager">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold">Sessions</h1>
          <Button size="sm">New Session</Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)] rounded-md border p-2">
          <p className="text-sm text-muted-foreground">No sessions loaded yet.</p>
        </ScrollArea>
      </aside>

      <section className="flex flex-col" aria-label="Chat arena">
        <header className="border-b bg-background p-4">
          <p className="text-sm font-medium">No active session</p>
        </header>
        <ScrollArea className="flex-1 p-4">
          <div className="rounded-md border border-dashed bg-background p-6 text-sm text-muted-foreground">
            Select or create a session to start interacting with your agent.
          </div>
        </ScrollArea>
        <footer className="border-t bg-background p-4">
          <form className="flex gap-2" aria-label="Prompt input form">
            <Input aria-label="Prompt input" placeholder="Send a prompt to Stoa..." />
            <Button type="submit">Send</Button>
          </form>
        </footer>
      </section>

      <aside className="border-l bg-background p-4" aria-label="Inspector panel">
        <h2 className="mb-3 text-sm font-semibold">Inspector</h2>
        <div className="rounded-md border p-3 text-sm text-muted-foreground">Skills and payload details will appear here.</div>
      </aside>
    </main>
  );
}
