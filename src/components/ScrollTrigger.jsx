import { useEffect, useRef } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

const ScrollTrigger = ({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0,
  threshold = 0.2
}) => {
  const { scroll } = useSmoothScroll();
  const ref = useRef(null);
  
  // Available animations: fade-up, fade-down, fade-left, fade-right, zoom-in
  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-8';
      case 'fade-down':
        return 'opacity-0 -translate-y-8';
      case 'fade-left':
        return 'opacity-0 translate-x-8';
      case 'fade-right':
        return 'opacity-0 -translate-x-8';
      case 'zoom-in':
        return 'opacity-0 scale-95';
      default:
        return 'opacity-0';
    }
  };

  useEffect(() => {
    if (!scroll || !ref.current) return;
    
    const element = ref.current;
    
    // Add initial animation class
    element.classList.add('transition-all', 'duration-700', 'ease-out');
    element.classList.add(...getAnimationClass().split(' '));
    
    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }
    
    // Update callback when the element comes into view
    scroll.on('call', (value, way, obj) => {
      if (value === 'reveal' && way === 'enter') {
        setTimeout(() => {
          obj.el.classList.remove(...getAnimationClass().split(' '));
        }, 50);
      }
    });
    
    // Add data attributes to the element for locomotive-scroll
    element.setAttribute('data-scroll', '');
    element.setAttribute('data-scroll-call', 'reveal');
    element.setAttribute('data-scroll-offset', `${threshold * 100}%`);
    
    // Re-update scroll to detect the new elements
    scroll.update();
    
    return () => {
      scroll.off('call');
    };
  }, [scroll, animation, delay, threshold]);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollTrigger; 