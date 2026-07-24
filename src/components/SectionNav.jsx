import { useEffect, useState } from "react";
import { SECTIONS } from "../constants";

// Sticky right-edge section nav with scroll-spy.
// Uses IntersectionObserver to track the section in view (the CSS-native
// scroll-target-group / :target-current isn't widely supported yet). A section
// counts as active while it crosses a thin band in the vertical middle of the
// viewport. Desktop only; links work everywhere.
const SectionNav = () => {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Band ~10% tall through the viewport middle: the section crossing it wins.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const els = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="Page sections" className="section-nav hidden lg:flex">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => handleClick(e, id)}
          aria-current={active === id ? "true" : undefined}
          className={`section-nav__link${active === id ? " is-active" : ""}`}
        >
          <span className="section-nav__label">{label}</span>
          <span className="section-nav__dash" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
};

export default SectionNav;
