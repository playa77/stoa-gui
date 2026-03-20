export interface FileInfo {
  path: string;
  name: string;
  isDir: boolean;
  size: number;
  modifiedAt: string;
}

export interface FileContent {
  path: string;
  content: string;
  encoding: string;
}

export interface DiffHunk {
  header: string;
  lines: string[];
}

export interface DiffResult {
  pathA: string;
  pathB: string;
  hunks: DiffHunk[];
}

export interface PatchHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  content: string;
}

export interface PatchProposal {
  id: string;
  targetPath: string;
  hunks: PatchHunk[];
  description: string;
  reversible: boolean;
}

export interface ExecutionResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
}
