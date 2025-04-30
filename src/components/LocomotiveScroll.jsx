import { createContext, useEffect, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export const SmoothScrollContext = createContext({
  scroll: null,
});

export const SmoothScrollProvider = ({ children }) => {
  const containerRef = useRef(null);
  const [scroll, setScroll] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const locomotiveScroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      multiplier: 1,
      class: 'is-revealed',
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    setScroll(locomotiveScroll);

    // Clean up the scroll instance when component unmounts
    return () => {
      locomotiveScroll.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scroll }}>
      <div id="smooth-wrapper">
        <div id="smooth-content" ref={containerRef}>
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider; 