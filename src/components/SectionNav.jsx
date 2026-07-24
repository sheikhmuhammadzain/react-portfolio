import { SECTIONS } from "../constants";

// Sticky right-edge section nav with native CSS scroll-spy.
// `scroll-target-group: auto` (see index.css) makes the browser mark the link
// whose section is in view with :target-current and aria-current - no JS,
// no IntersectionObserver. Desktop only; the links themselves work everywhere,
// the active-highlight is a progressive enhancement (Chrome 146+).
const SectionNav = () => {
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
          className="section-nav__link"
        >
          <span className="section-nav__label">{label}</span>
          <span className="section-nav__dash" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
};

export default SectionNav;
