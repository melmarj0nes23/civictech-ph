import { Fragment, type ReactNode } from 'react';

const ACCENT = '#0B3D91';

function isSafeUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  return /^https?:\/\//i.test(trimmed);
}

/** Parse inline Markdown (**bold**, *italic*, `code`, [label](url)) into React nodes without HTML injection. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] !== undefined && match[3] !== undefined) {
      const label = match[2];
      const href = match[3].trim();
      if (isSafeUrl(href)) {
        const external = /^https?:\/\//i.test(href);
        nodes.push(
          <a
            key={key++}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            style={{
              color: ACCENT,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            {label}
          </a>
        );
      } else {
        nodes.push(label);
      }
    } else if (match[4] !== undefined) {
      nodes.push(
        <strong key={key++} style={{ fontWeight: 700 }}>
          {match[4]}
        </strong>
      );
    } else if (match[5] !== undefined) {
      nodes.push(<em key={key++}>{match[5]}</em>);
    } else if (match[6] !== undefined) {
      nodes.push(
        <code
          key={key++}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '0.86em',
            background: '#F4F6FA',
            padding: '2px 5px',
          }}
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}

interface RichBodyProps {
  blocks: string[];
  dropCap?: boolean;
}

export function RichBody({ blocks, dropCap = false }: RichBodyProps) {
  let usedDropCap = false;

  return (
    <>
      {blocks.map((rawBlock, idx) => {
        const block = rawBlock.trim();
        if (!block) return null;

        // Horizontal rule
        if (/^---+$/.test(block)) {
          return (
            <hr
              key={idx}
              style={{
                border: 'none',
                borderTop: '1px solid #E5E5E5',
                margin: '32px 0',
              }}
            />
          );
        }

        // Subheadings (## or ###)
        if (block.startsWith('### ')) {
          return (
            <h3 key={idx} className="rich-h3">
              {renderInline(block.slice(4).trim())}
            </h3>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h2 key={idx} className="rich-h2">
              {renderInline(block.slice(3).trim())}
            </h2>
          );
        }

        // Blockquote (> ...)
        const lines = block.split('\n');
        if (lines.every((l) => l.trim().startsWith('> '))) {
          const quoteText = lines.map((l) => l.trim().slice(2)).join(' ');
          return (
            <blockquote key={idx} className="rich-quote">
              {renderInline(quoteText)}
            </blockquote>
          );
        }

        // Unordered list (- ... or * ...)
        if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
          return (
            <ul key={idx} className="rich-list">
              {lines.map((l, liIdx) => (
                <li key={liIdx}>{renderInline(l.trim().replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        // Ordered list (1. ...)
        if (lines.every((l) => /^\d+\.\s+/.test(l.trim()))) {
          return (
            <ol key={idx} className="rich-list">
              {lines.map((l, liIdx) => (
                <li key={liIdx}>{renderInline(l.trim().replace(/^\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        // Plain paragraph (apply drop cap only on the very first plain paragraph if enabled)
        const shouldDropCap = dropCap && !usedDropCap && idx === 0 && /^[A-Za-z0-9]/.test(block);
        if (shouldDropCap) {
          usedDropCap = true;
          const firstChar = block.charAt(0);
          const rest = block.slice(1);
          return (
            <p key={idx}>
              <span
                className="article-dropcap"
                style={{
                  float: 'left',
                  fontSize: 76,
                  lineHeight: 0.85,
                  fontWeight: 600,
                  padding: '8px 10px 0 0',
                  color: ACCENT,
                }}
              >
                {firstChar}
              </span>
              {renderInline(rest)}
            </p>
          );
        }

        return <p key={idx}>{renderInline(block)}</p>;
      })}
    </>
  );
}
