import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

const lenisOptions = {
  lerp: 0.1,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  syncTouch: false,
}

export default function SmoothScrollProvider({ children }) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  )
}
