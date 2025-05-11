import { useEffect, useRef } from 'react';

const ScrollTrigger = ({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0,
  threshold = 0.2
}) => {
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
    if (!ref.current) return;
    
    const element = ref.current;
    
    // Add initial animation class
    element.classList.add('transition-all', 'duration-700', 'ease-out');
    element.classList.add(...getAnimationClass().split(' '));
    
    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.remove(...getAnimationClass().split(' '));
            }, 50);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: '0px',
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [animation, delay, threshold]);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollTrigger; 