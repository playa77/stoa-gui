import React from "react";
import { useResearchStore } from "../../stores/research";
import { Source } from "../../types";
import { Panel } from "../shared/Panel";
import { clsx } from "clsx";
import { FileText, Link, Database } from "lucide-react";

const SourceIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type.toLowerCase()) {
    case "url": return <Link size={12} />;
    case "file": return <FileText size={12} />;
    default: return <Database size={12} />;
  }
};

export const SourceList: React.FC = () => {
  const { sources, loading } = useResearchStore();

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-72 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inbound Sources</h3>
        {loading && <div className="animate-pulse w-2 h-2 bg-teal-500 rounded-full" />}
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {sources.length === 0 ? (
          <div className="text-[10px] font-mono text-zinc-700 p-4 text-center border border-dashed border-zinc-900 mt-2">
            NO SOURCES INGESTED
          </div>
        ) : (
          sources.map((source) => (
            <div 
              key={source.id} 
              className="group px-3 py-2 bg-zinc-900/20 border border-zinc-800/50 hover:border-zinc-700 rounded transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-zinc-500"><SourceIcon type={source.type} /></span>
                <span className="text-[10px] font-mono text-zinc-300 truncate font-bold">
                  {source.title || source.uri || "Untitled"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600">
                <span className="uppercase">{source.type}</span>
                <span>{new Date(source.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
