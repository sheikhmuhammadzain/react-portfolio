import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// Initialize Google Analytics
// TODO: Replace "G-XXXXXXXXXX" with your actual Measurement ID from Google Analytics
ReactGA.initialize("G-E3CMSHL3CZ");
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PerformanceMonitor from "./components/PerformanceMonitor";
import Chatbot from "./components/Chatbot";
import CommandPalette from "./components/CommandPalette";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import CustomContextMenu from "./components/CustomContextMenu";

// Lazy load components below the fold
const About = lazy(() => import("./components/About"));
const Technologies = lazy(() => import("./components/Technologies"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Certificates = lazy(() => import("./components/Certificates"));
const Contact = lazy(() => import("./components/Contact"));

const Home = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-neutral-500">Loading...</div></div>}>
        <About />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-neutral-500">Loading...</div></div>}>
        <Technologies />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-neutral-500">Loading...</div></div>}>
        <Experience />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-neutral-500">Loading...</div></div>}>
        <Projects />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-neutral-500">Loading...</div></div>}>
        <Certificates />
      </Suspense>
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-neutral-500">Loading...</div></div>}>
        <Contact />
      </Suspense>
    </>
  );
};

const App = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Track page views
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return (
    <>
      <PerformanceMonitor />
      {/* Primary Meta */}
      {/* Keywords that rank in 2025 */}
      {/* Open Graph */}
      {/* Twitter Card */}
      <div className="text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900 min-h-screen overflow-x-hidden">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>


        <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <CommandPalette openChat={() => setIsChatOpen(true)} />
        <CustomContextMenu openChat={() => setIsChatOpen(true)} />
        
        <div className="container mx-auto px-4 sm:px-8 max-w-full">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
