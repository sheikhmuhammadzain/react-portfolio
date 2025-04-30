"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DefaultCursorSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={25}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}) {
  const [isMoving, setIsMoving] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [glowScale, setGlowScale] = useState(1);
  const [glowOpacity, setGlowOpacity] = useState(0.6);

  useEffect(() => {
    const updateVelocity = (currentPos) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const smoothMouseMove = (e) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2),
      );

      setCursorX(currentPos.x);
      setCursorY(currentPos.y);

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        setRotation(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        setScale(0.95);
        setGlowScale(1.5);
        setGlowOpacity(0.8);
        setIsMoving(true);

        const timeout = setTimeout(() => {
          setScale(1);
          setGlowScale(1);
          setGlowOpacity(0.6);
          setIsMoving(false);
        }, 150);

        return () => clearTimeout(timeout);
      }
    };

    let rafId;
    const throttledMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e);
        rafId = 0;
      });
    };

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Glow effect */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 99,
          pointerEvents: "none",
          willChange: "transform",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116, 66, 255, 0.8) 0%, rgba(120, 119, 198, 0.4) 50%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(8px)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: glowScale,
          opacity: glowOpacity
        }}
        transition={{
          type: "spring",
          stiffness: springConfig.stiffness,
          damping: springConfig.damping,
          mass: springConfig.mass,
        }}
      />
      
      {/* Cursor */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 100,
          pointerEvents: "none",
          willChange: "transform",
        }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: scale,
          rotate: rotation 
        }}
        transition={{
          type: "spring",
          stiffness: springConfig.stiffness,
          damping: springConfig.damping,
          mass: springConfig.mass,
        }}
      >
        {cursor}
      </motion.div>
    </>
  );
}

export default SmoothCursor; 