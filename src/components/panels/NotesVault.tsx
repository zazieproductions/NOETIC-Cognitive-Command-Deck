import { useMemo, useState } from 'react';
import { Search, FileText, Link as LinkIcon } from 'lucide-react';
import { generateNotes, TAG_POOL, type Note } from '../../lib/engine';

const ALL_NOTES = generateNotes(260);
const PAGE = 50;

function tagColor(tag: string) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) % 360;
  return `hsl(${h}, 70%, 65%)`;
}

export default function NotesVault() {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [visible, setVisible] = useState(PAGE);
  const [selectedId, setSelectedId] = useState<number>(0);

  const filtered = useMemo(() => {
    return ALL_NOTES.filter((n) => {
      const matchesQuery =
        !query ||
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.body.toLowerCase().includes(query.toLowerCase());
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => n.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const selected: Note | undefined = ALL_NOTES.find((n) => n.id === selectedId);

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    setVisible(PAGE);
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-[54%] shrink-0 border-r border-white/10 flex flex-col min-h-0">
        <div className="p-2.5 border-b border-white/10 space-y-2 shrink-0">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5">
            <Search size={13} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE); }}
              placeholder="search the vault..."
              className="bg-transparent outline-none text-[11px] font-mono text-white/80 placeholder:text-white/30 w-full"
            />
          </div>
          <div className="flex flex-wrap gap-1 max-h-14 overflow-y-auto custom-scroll">
            {TAG_POOL.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors"
                style={{
                  borderColor: activeTags.includes(t) ? tagColor(t) : 'rgba(255,255,255,0.12)',
                  color: activeTags.includes(t) ? tagColor(t) : 'rgba(255,255,255,0.4)',
                  background: activeTags.includes(t) ? `${tagColor(t)}1a` : 'transparent',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-[9px] font-mono text-white/30">{filtered.length} fragments matched</div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll divide-y divide-white/5">
          {filtered.slice(0, visible).map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedId(n.id)}
              className="w-full text-left p-2.5 hover:bg-white/5 transition-colors"
              style={{ background: selectedId === n.id ? 'rgba(247,178,103,0.08)' : undefined }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <FileText size={11} className="text-[#F7B267]/70 shrink-0" />
                <div className="text-[11px] font-display text-white/85 truncate">{n.title}</div>
              </div>
              <div className="text-[10px] text-white/40 font-mono line-clamp-1">{n.body}</div>
              <div className="flex gap-1 mt-1">
                {n.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[8px] font-mono" style={{ color: tagColor(t) }}>#{t}</span>
                ))}
              </div>
            </button>
          ))}
          {visible < filtered.length && (
            <button onClick={() => setVisible((v) => v + PAGE)} className="w-full py-2 text-[10px] font-mono text-[#F7B267]/70 hover:text-[#F7B267]">
              load {Math.min(PAGE, filtered.length - visible)} more ↓
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 overflow-y-auto custom-scroll">
        {selected ? (
          <div className="space-y-3">
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Fragment #{selected.id.toString().padStart(4, '0')} · {selected.day}d ago</div>
            <h2 className="text-lg font-display text-[#F7B267] leading-snug">{selected.title}</h2>
            <div className="flex gap-1.5 flex-wrap">
              {selected.tags.map((t) => (
                <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: `${tagColor(t)}55`, color: tagColor(t) }}>#{t}</span>
              ))}
            </div>
            <p className="text-[12px] leading-relaxed text-white/70 font-mono">{selected.body}</p>
            {selected.links.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-1.5">
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1">
                  <LinkIcon size={10} /> backlinked fragments
                </div>
                {selected.links.map((id) => {
                  const target = ALL_NOTES[id];
                  if (!target) return null;
                  return (
                    <button key={id} onClick={() => setSelectedId(id)} className="block text-left text-[11px] font-mono text-[#F7B267]/70 hover:text-[#F7B267] hover:underline">
                      → {target.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] font-mono text-white/30 italic">Select a fragment to read.</div>
        )}
      </div>
    </div>
  );
}
