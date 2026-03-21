import React from "react";
import { SourceList } from "./SourceList";
import { RetrievalView } from "./RetrievalView";
import { SynthesisView } from "./SynthesisView";

export const ResearchView: React.FC = () => {
  return (
    <div className="flex h-full w-full bg-zinc-950 overflow-hidden">
      <SourceList />
      <RetrievalView />
      <SynthesisView />
    </div>
  );
};

export * from "./SourceList";
export * from "./RetrievalView";
export * from "./SynthesisView";
export * from "./ResearchView";
