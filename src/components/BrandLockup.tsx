// BuLLMaps wordmark (18 Nov 2026, per user): the supplied orange/teal logo with the pin-shaped "a", transparent
// background; the black letters switch to white on the dark theme. Sized by height from `--bl` (brand.css).
import './brand.css'
import { useUi } from '../lib/store'
import light from '../assets/brand-logo-light.png'
import dark from '../assets/brand-logo-dark.png'

export function BrandLockup({ className = '' }: { className?: string }) {
  const theme = useUi(s => s.theme)
  return <img className={`brand-lockup ${className}`} src={theme === 'dark' ? dark : light} alt="BuLLMaps" />
}
