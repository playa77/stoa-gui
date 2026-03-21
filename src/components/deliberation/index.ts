import React from "react";
import { FrameView } from "./FrameView";
import { ConsensusMatrix } from "./ConsensusMatrix";
import { RhetoricPanel } from "./RhetoricPanel";

export const DeliberationView: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <FrameView />
        <ConsensusMatrix />
      </div>
      <RhetoricPanel />
    </div>
  );
};

export * from "./FrameView";
export * from "./ConsensusMatrix";
export * from "./RhetoricPanel";
export * from "./DeliberationView";
export type ActionMode = "VIEW" | "DEBUG"; // Added for routing consistency
