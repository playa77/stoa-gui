import React from "react";
import { useWorkspaceStore } from "../../stores/deliberation";
import { clsx } from "clsx";
import { Folder, File, ChevronRight, HardDrive } from "lucide-react";

export const FileExplorer: React.FC = () => {
  const { files, currentPath, navigate, readFile } = useWorkspaceStore();

  const handleEntryClick = (file: any) => {
    if (file.isDir) {
      navigate(`${currentPath}/${file.name}`.replace("//", "/"));
    } else {
      readFile(`${currentPath}/${file.name}`.replace("//", "/"));
    }
  };

  return (
    <div className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/40 flex items-center gap-2">
        <HardDrive size={12} className="text-zinc-500" />
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Workspace Assets</h3>
      </div>
      
      <div className="px-3 py-1.5 bg-zinc-900/20 border-b border-zinc-800/50 flex items-center gap-1 overflow-hidden">
        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter shrink-0">PATH:</span>
        <span className="text-[10px] font-mono text-zinc-500 truncate italic">{currentPath}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {files.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest border border-dashed border-zinc-900 py-4">
              Directory Empty
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {files.sort((a, b) => (a.isDir === b.isDir ? a.name.localeCompare(b.name) : a.isDir ? -1 : 1)).map((file) => (
              <div 
                key={file.path}
                onClick={() => handleEntryClick(file)}
                className="group flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-900/60 cursor-pointer rounded transition-colors border border-transparent hover:border-zinc-800/50"
              >
                <span className={clsx("shrink-0", file.isDir ? "text-teal-600" : "text-zinc-600")}>
                  {file.isDir ? <Folder size={14} /> : <File size={14} />}
                </span>
                <span className={clsx(
                  "text-[11px] font-mono truncate flex-1",
                  file.isDir ? "text-zinc-300 font-bold" : "text-zinc-400"
                )}>
                  {file.name}
                </span>
                {!file.isDir && (
                  <span className="text-[9px] font-mono text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                )}
                <ChevronRight size={10} className="text-zinc-800 group-hover:text-zinc-600" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
