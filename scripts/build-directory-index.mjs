import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const outFile = path.join(rootDir, 'src', 'data', 'directory.generated.json');

const SECTORS = new Set([
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
]);

const LEGACY_SECTOR_MAP = {
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

function normalizeSector(raw) {
  if (SECTORS.has(raw)) return raw;
  return LEGACY_SECTOR_MAP[raw] ?? 'Government Services';
}

function unquote(val) {
  const trimmed = val.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseArray(raw) {
  const inner = raw.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((item) => unquote(item))
    .filter(Boolean);
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: markdown.trim() };

  const [, yamlBlock, body] = match;
  const data = {};
  const lines = yamlBlock.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;

    const [, key, rawValue] = kv;
    const val = rawValue.trim();

    if (val === '') {
      // Check for YAML multiline list (- item)
      const list = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        i++;
        list.push(unquote(lines[i].replace(/^\s*-\s+/, '')));
      }
      data[key] = list.length > 0 ? list : '';
    } else if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = parseArray(val);
    } else if (val === 'true') {
      data[key] = true;
    } else if (val === 'false') {
      data[key] = false;
    } else {
      data[key] = unquote(val);
    }
  }

  return { data, body: body.trim() };
}

function readCollection(subDir, kind) {
  const dir = path.join(contentDir, subDir);
  if (!fs.existsSync(dir)) return [];

  const entries = [];
  for (const slug of fs.readdirSync(dir).sort()) {
    const mdPath = path.join(dir, slug, 'index.md');
    if (!fs.existsSync(mdPath)) continue;

    const raw = fs.readFileSync(mdPath, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const legacySectors = Array.isArray(data.sectors) ? data.sectors : [];
    const sectors = [...new Set(legacySectors.map(normalizeSector))];
    if (sectors.length === 0) sectors.push('Government Services');

    entries.push({
      slug,
      kind,
      title: data.title || slug,
      summary: data.summary || '',
      status: data.status || 'beta',
      sectors,
      legacySectors,
      tags: Array.isArray(data.tags) ? data.tags : [],
      maintainers: Array.isArray(data.maintainers) ? data.maintainers : [],
      dateAdded: data.dateAdded || '',
      ...(data.lastUpdated ? { lastUpdated: data.lastUpdated } : {}),
      ...(data.owner ? { owner: data.owner } : {}),
      ...(data.repoUrl ? { repoUrl: data.repoUrl } : {}),
      ...(data.website ? { website: data.website } : {}),
      ...(data.demo ? { demo: data.demo } : {}),
      ...(data.license ? { license: data.license } : {}),
      ...(Array.isArray(data.needs) && data.needs.length > 0 ? { needs: data.needs } : {}),
      ...(typeof data.featured === 'boolean' ? { featured: data.featured } : {}),
      ...(body ? { body } : {}),
    });
  }
  return entries;
}

const projects = readCollection('projects', 'project');
const csos = readCollection('csos', 'cso');
const all = [...projects, ...csos];

fs.writeFileSync(outFile, JSON.stringify(all, null, 2) + '\n', 'utf8');
console.log(`Generated ${all.length} directory entries (${projects.length} projects, ${csos.length} CSOs) -> ${path.relative(rootDir, outFile)}`);
