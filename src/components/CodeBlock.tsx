interface CodeBlockProps {
  code: string;
  language?: string;
}

interface TokenMatch {
  type: string;
  index: number;
  prefix: string;
  token: string;
  suffix: string;
}

// Simple syntax highlighting via line-by-line token coloring
function highlightLine(line: string): JSX.Element {
  // Comment lines
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-cream-500 italic">{line}</span>;
  }

  const tokens: { text: string; className: string }[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    // Try to match a double-quoted string
    const strMatch = remaining.match(/^([^"]*?)("(?:[^"\\]|\\.)*")/);
    if (strMatch) {
      if (strMatch[1]) tokens.push({ text: strMatch[1], className: '' });
      tokens.push({ text: strMatch[2], className: 'text-green-400' });
      remaining = remaining.slice(strMatch[1].length + strMatch[2].length);
      continue;
    }

    // Try to match a single-quoted string
    const sqMatch = remaining.match(/^([^']*?)('(?:[^'\\]|\\.)*')/);
    if (sqMatch) {
      if (sqMatch[1]) tokens.push({ text: sqMatch[1], className: '' });
      tokens.push({ text: sqMatch[2], className: 'text-green-400' });
      remaining = remaining.slice(sqMatch[1].length + sqMatch[2].length);
      continue;
    }

    // Try to match HTTP methods / keywords
    const kwMatch = remaining.match(/^(.*?)\b(curl|POST|GET|PUT|DELETE|Content-Type|X-API-Key)\b/);
    if (kwMatch) {
      if (kwMatch[1]) tokens.push({ text: kwMatch[1], className: '' });
      tokens.push({ text: kwMatch[2], className: 'text-sky-400 font-semibold' });
      remaining = remaining.slice(kwMatch[1].length + kwMatch[2].length);
      continue;
    }

    // Try to match URLs
    const urlMatch = remaining.match(/^(.*?)(https?:\/\/[^\s"'\\]+)/);
    if (urlMatch) {
      if (urlMatch[1]) tokens.push({ text: urlMatch[1], className: '' });
      tokens.push({ text: urlMatch[2], className: 'text-sky-300' });
      remaining = remaining.slice(urlMatch[1].length + urlMatch[2].length);
      continue;
    }

    // No match — push the rest
    tokens.push({ text: remaining, className: '' });
    remaining = '';
  }

  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={t.className}>{t.text}</span>
      ))}
    </>
  );
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className="relative rounded-xl overflow-hidden">
      {language && (
        <div className="bg-navy-700 px-4 py-1.5 text-xs text-cream-400 font-mono border-b border-navy-600">
          {language}
        </div>
      )}
      <div className="bg-navy-900 p-5 overflow-x-auto">
        <pre className="text-sm text-cream-300 leading-relaxed font-mono whitespace-pre">
          {lines.map((line, i) => (
            <div key={i}>{line ? highlightLine(line) : '\u00A0'}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}
