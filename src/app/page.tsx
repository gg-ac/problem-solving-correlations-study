"use client"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen">
     <span className="py-10 text-2xl">Problem-Solving Cognitive Correlations Study</span>
     <a href="/tasks/go-nogo">Go/No-Go</a>
     <a href="/tasks/visual-search">Visual Search</a>
     <a href="/tasks/memory-span">Memory Span</a>
     <a href="/tasks/matrix-reasoning">Matrix Reasoning</a>
    </div>
  );
}
