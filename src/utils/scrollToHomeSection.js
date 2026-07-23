// Scroll to a home-page section anchor (see HOME_SECTIONS in App.jsx),
// navigating home first when invoked from another route.
export const scrollToHomeSection = (navigate, id) => {
  if (window.location.pathname === "/") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  navigate("/");
  // ponytail: fixed delay while Home mounts its anchors; use an effect on
  // location state if this ever proves flaky
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
};
