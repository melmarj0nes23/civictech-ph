import rawDirectory from './directory.generated.json';
import type { DirectoryEntry } from './schema';

export const DIRECTORY_ENTRIES = rawDirectory as DirectoryEntry[];

export const PROJECT_ENTRIES = DIRECTORY_ENTRIES.filter((e) => e.kind === 'project');
export const CSO_ENTRIES = DIRECTORY_ENTRIES.filter((e) => e.kind === 'cso');
