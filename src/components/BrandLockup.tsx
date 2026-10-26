// BuLLMaps wordmark: "Bu" orange, "LLMaps" logo blue (lighter in dark mode). Used in the top bar (with the muted
// "marketing workflows" tag beside it) and on login. Sized from one font size (`--bl`).
import './brand.css'

export function BrandLockup({ className = '', tag }: { className?: string; tag?: string }) {
  return (
    <span className={`brand-lockup ${className}`} role="img" aria-label={tag ? `BuLLMaps, ${tag}` : 'BuLLMaps'}>
      <span className="brand-mark" aria-hidden><span className="brand-bu">Bu</span><span className="brand-llm">LLMaps</span></span>
      {tag && <span className="brand-tag" aria-hidden>{tag}</span>}
    </span>
  )
}
