import { useRef } from "react";
import PropTypes from "prop-types";

const MAX_TILT_DEG = 8;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pointer-tracked 3D tilt card. Writes transforms straight to the DOM inside
// requestAnimationFrame - zero React re-renders while hovering, so it stays
// smooth even with many cards on screen. Touch and reduced-motion users get a
// static card.
const TiltCard = ({ className = "", children }) => {
  const ref = useRef(null);
  const frame = useRef(0);

  const handlePointerMove = (e) => {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const py = (clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * MAX_TILT_DEG * 2).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG * 2).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
};

TiltCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default TiltCard;
