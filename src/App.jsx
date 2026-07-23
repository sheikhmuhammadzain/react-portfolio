import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { OPEN_CHAT_EVENT } from "./constants";

// Lazy load components below the fold
const About = lazy(() => import("./components/About"));
const Technologies = lazy(() => import("./components/Technologies"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Certificates = lazy(() => import("./components/Certificates"));
const Contact = lazy(() => import("./components/Contact"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Chatbot = lazy(() => import("./components/Chatbot"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const CustomContextMenu = lazy(() => import("./components/CustomContextMenu"));

let isGoogleAnalyticsReady = false;

const runWhenIdle = (callback) => {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 2000 });
  }

  return window.setTimeout(callback, 1000);
};

const cancelIdleTask = (id) => {
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
};

const SectionFallback = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="animate-pulse text-neutral-500">Loading...</div>
  </div>
);

// id anchors are used by the voice agent's navigate_to_section tool and the
// ⌘K palette / context menu scroll actions.
const HOME_SECTIONS = [
  ["about", About],
  ["technologies", Technologies],
  ["experience", Experience],
  ["projects", Projects],
  ["certificates", Certificates],
  ["contact", Contact],
];

const Home = () => {
  return (
    <>
      <Hero />
      {HOME_SECTIONS.map(([id, Section]) => (
        <section key={id} id={id} className="scroll-mt-20">
          <Suspense fallback={<SectionFallback />}>
            <Section />
          </Suspense>
        </section>
      ))}
    </>
  );
};

const App = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [areInteractiveToolsReady, setAreInteractiveToolsReady] = useState(false);

  useEffect(() => {
    const idleId = runWhenIdle(async () => {
      try {
        const { default: ReactGA } = await import("react-ga4");
        if (!isGoogleAnalyticsReady) {
          ReactGA.initialize("G-E3CMSHL3CZ");
          isGoogleAnalyticsReady = true;
        }
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
      } catch (error) {
        console.error("Google Analytics failed to load:", error);
      }
    });

    return () => cancelIdleTask(idleId);
  }, [location]);

  useEffect(() => {
    const idleId = runWhenIdle(() => setAreInteractiveToolsReady(true));

    return () => cancelIdleTask(idleId);
  }, []);

  // Voice agent's open_chat tool (and anything else) can open the chatbot via this event
  useEffect(() => {
    const openChat = () => setIsChatOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openChat);
  }, []);

  return (
    <>
      {/* Primary Meta */}
      {/* Keywords that rank in 2025 */}
      {/* Open Graph */}
      {/* Twitter Card */}
      <div className="text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900 min-h-screen">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>


        {areInteractiveToolsReady && (
          <Suspense fallback={null}>
            <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
            <CommandPalette openChat={() => setIsChatOpen(true)} />
            <CustomContextMenu openChat={() => setIsChatOpen(true)} />
          </Suspense>
        )}
        
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
          <Navbar />
          <Suspense fallback={<div className="min-h-screen pt-20 text-center text-neutral-500">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default App;
