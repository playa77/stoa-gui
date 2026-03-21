import React from "react";
import { Timeline } from "./Timeline";
import { EventInspector } from "./EventInspector";

export const ReplayView: React.FC = () => {
  return (
    <div className="flex h-full w-full bg-zinc-950 overflow-hidden">
      <Timeline />
      <EventInspector />
    </div>
  );
};

export * from "./Timeline";
export * from "./EventInspector";
export * from "./ReplayView";
