import { useEffect, useState } from 'react';

const LINES = [
  '> INITIALIZING NOETIC KERNEL ...',
  '> MOUNTING COGNITIVE FILESYSTEM ............... OK',
  '> LOADING NEURAL LATTICE ............ 42,819 NODES',
  '> INDEXING OBSCURE INTELLECTUAL ARCHIVE ........ OK',
  '> CALIBRATING VISIONARY INDEX ............. 0.9187',
  '> WARMING IDEA SYNTHESIS REACTOR .......... 100%',
  '> SYNCHRONIZING WITH THE NOOSPHERE ....... LINKED',
  '> ACCESS GRANTED — WELCOME, ARCHITECT.',
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= LINES.length) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c + 1), 220 + Math.random() * 240);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div
      className="fixed inset-0 z-[999] bg-[#05060a] text-[#7CFFD8] font-mono text-sm p-8 flex flex-col justify-center cursor-pointer"
      onClick={onDone}
    >
      <div className="max-w-2xl mx-auto w-full space-y-1.5">
        {LINES.slice(0, count).map((l, i) => (
          <div key={i} className="opacity-90 tracking-wide">
            {l}
          </div>
        ))}
        {count < LINES.length && <div className="animate-pulse">▋</div>}
      </div>
      <div className="max-w-2xl mx-auto w-full mt-8 text-[10px] tracking-[0.35em] text-[#7CFFD8]/40">
        CLICK ANYWHERE TO SKIP
      </div>
    </div>
  );
}
