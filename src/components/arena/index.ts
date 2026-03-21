import React from "react";
import { RunSidebar } from "./RunSidebar";
import { ComparisonGrid } from "./ComparisonGrid";

export const ArenaView: React.FC = () => {
  return (
    <div className="flex h-full w-full bg-zinc-950 overflow-hidden">
      <RunSidebar />
      <ComparisonGrid />
    </div>
  );
};

export * from "./RunSidebar";
export * from "./ComparisonGrid";
export * from "./ArenaView";
