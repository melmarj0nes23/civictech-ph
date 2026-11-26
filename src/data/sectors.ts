export const SECTORS = [
  'Disaster & Recovery',
  'Social & Welfare',
  'Government Services',
  'Travel',
  'Health',
  'Education',
  'Business & Economy',
  'Taxes & Finance',
  'Labor & Employment',
  'Law & Justice',
  'Elections & Governance',
  'Transparency & Procurement',
  'Agriculture & Environment',
  'Infrastructure & Transport',
  'Public Safety',
] as const;

export type Sector = (typeof SECTORS)[number];

/**
 * Maps legacy openbayan.org sector labels to Jason Torres's 15 civictech.ph sectors.
 */
const LEGACY_SECTOR_MAP: Record<string, Sector> = {
  'Disaster Management': 'Disaster & Recovery',
  Climate: 'Agriculture & Environment',
  Government: 'Government Services',
  'Local Government': 'Elections & Governance',
  Transparency: 'Transparency & Procurement',
  'Civic Tech': 'Government Services',
  Technology: 'Government Services',
  Finance: 'Taxes & Finance',
  Health: 'Health',
  Education: 'Education',
  'Public Safety': 'Public Safety',
  Infrastructure: 'Infrastructure & Transport',
  'Civil Society': 'Social & Welfare',
  Security: 'Public Safety',
  Other: 'Government Services',
};

export function normalizeSector(raw: string): Sector {
  if ((SECTORS as readonly string[]).includes(raw)) {
    return raw as Sector;
  }
  return LEGACY_SECTOR_MAP[raw] ?? 'Government Services';
}
