import type { Sector } from './sectors';

export const STATUSES = ['planning', 'alpha', 'beta', 'stable', 'archived'] as const;
export type Status = (typeof STATUSES)[number];

export const ENTRY_KINDS = ['project', 'cso'] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

/** Kinds of help a project or CSO can ask for. */
export const NEEDS = [
  'developers',
  'designers',
  'researchers',
  'data',
  'testers',
  'writers',
] as const;

export const LIMITS = {
  title: 80,
  summary: 240,
  description: 1200,
  license: 40,
  tag: 30,
  tags: 8,
} as const;

export interface DirectoryEntry {
  slug: string;
  kind: EntryKind;
  title: string;
  summary: string;
  status: Status;
  sectors: Sector[];
  legacySectors: string[];
  tags: string[];
  maintainers: string[];
  dateAdded: string;
  lastUpdated?: string;
  owner?: string;
  repoUrl?: string;
  website?: string;
  demo?: string;
  license?: string;
  needs?: string[];
  featured?: boolean;
  body?: string;
}
