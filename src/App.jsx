import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SmoothCursor from "./components/SmoothCursor";
import PerformanceMonitor from "./components/PerformanceMonitor";

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
     <Helmet>
  {/* Primary Meta */}
  <title>Muhammad Zain Afzal | Full Stack Gen AI Developer</title>
  <meta
    name="description"
    content="Muhammad Zain Afzal is a Full Stack Gen AI Developer building production-ready AI SaaS products, RAG pipelines, and agentic applications using Next.js, TypeScript, MongoDB, LangChain, ChromaDB, and modern AI APIs."
  />

  {/* Keywords that rank in 2025 */}
  <meta
    name="keywords"
    content="Muhammad Zain Afzal, Full Stack Gen AI Developer, AI SaaS, Next.js, TypeScript, MongoDB, FastAPI, LangChain, ChromaDB, RAG pipeline, ReAct agents, Gemini API, OpenAI API, document Q&A, AI data analysis, Lahore Pakistan"
  />


  <meta name="author" content="Muhammad Zain" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://zainafzal.dev/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />



  {/* Open Graph */}
  <meta property="og:title" content="Muhammad Zain Afzal | Full Stack Gen AI Developer" />
  <meta property="og:description" content="Full Stack Gen AI Developer building AI SaaS products, RAG pipelines, and agentic applications with Next.js, MongoDB, LangChain, and modern AI APIs." />
  <meta property="og:image" content="https://zainafzal.dev/favicon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://zainafzal.dev/" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Muhammad Zain Afzal | Full Stack Gen AI Developer" />
  <meta name="twitter:description" content="Full Stack Gen AI Developer building AI SaaS products, RAG pipelines, and agentic applications with Next.js, MongoDB, LangChain, and modern AI APIs." />
  <meta name="twitter:image" content="https://zainafzal.dev/favicon.png" />
</Helmet>
      <div className="text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900 min-h-screen overflow-hidden">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>

        <SmoothCursor />
        
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
