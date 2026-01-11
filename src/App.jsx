import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SmoothCursor from "./components/SmoothCursor";
import PerformanceMonitor from "./components/PerformanceMonitor";
import Chatbot from "./components/Chatbot";

// Lazy load components below the fold
const About = lazy(() => import("./components/About"));
const Technologies = lazy(() => import("./components/Technologies"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Certificates = lazy(() => import("./components/Certificates"));
const Contact = lazy(() => import("./components/Contact"));

const App = () => {
  return (
    <>
      <PerformanceMonitor />
      {/* Primary Meta */}
      {/* Keywords that rank in 2025 */}
      {/* Open Graph */}
      {/* Twitter Card */}
      <div className="text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900 min-h-screen overflow-hidden">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>

        <SmoothCursor />
        <Chatbot />
        
        <div className="container mx-auto px-4 sm:px-8 max-w-full">
          <Navbar />
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
        </div>
      </div>
    </>
  );
};

export default App;
