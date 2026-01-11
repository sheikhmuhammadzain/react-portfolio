import { useEffect, useRef } from 'react';

// Shared observer instance to reduce overhead
let sharedObserver = null;

const ScrollTrigger = ({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0,
  threshold = 0.2
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
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
    
    const element = ref.current;
    
    // Add initial animation class
    element.classList.add('transition-all', 'duration-700', 'ease-out');
    element.classList.add(...getAnimationClass().split(' '));
    
    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }
    
    // Use shared observer to reduce overhead
    if (!sharedObserver) {
      sharedObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const targetElement = entry.target;
              const animationClasses = targetElement.dataset.animationClasses?.split(' ') || [];
              setTimeout(() => {
                targetElement.classList.remove(...animationClasses);
              }, 50);
              sharedObserver.unobserve(targetElement);
            }
          });
        },
        {
          threshold: threshold,
          rootMargin: '0px',
        }
      );
    }
    
    // Store animation classes for cleanup
    element.dataset.animationClasses = getAnimationClass();
    sharedObserver.observe(element);
    
    return () => {
      if (element && sharedObserver) {
        sharedObserver.unobserve(element);
      }
    };
  }, [animation, delay, threshold]);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollTrigger; 