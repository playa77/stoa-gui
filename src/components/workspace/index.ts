import React from "react";
import { FileExplorer } from "./FileExplorer";
import { EditorView } from "./EditorView";
import { DiffViewer } from "./DiffViewer";

export const WorkspaceView: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer />
        <EditorView />
      </div>
      <DiffViewer />
    </div>
  );
};

export * from "./FileExplorer";
export * from "./EditorView";
export * from "./DiffViewer";
export * from "./WorkspaceView";
