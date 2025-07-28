import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Technologies from "./components/Technologies";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import SmoothCursor from "./components/SmoothCursor";
import Certificates from "./components/Certificates";
import { Helmet } from "react-helmet";

const App = () => {
  return (
    <>
     <Helmet>
  {/* Primary Meta */}
  <title>Muhammad Zain | Gen-AI Engineer & Full-Stack MERN Developer</title>
  <meta name="description" content="Muhammad Zain is a Gen-AI Engineer who builds production-grade LLM pipelines, RAG systems, and MERN stack apps. See case studies, open-source work, and contact info." />

  {/* Keywords that rank in 2025 */}
  <meta name="keywords" content="Muhammad Zain, Gen-AI Engineer, Full-Stack MERN Developer, RAG pipeline, LLM fine-tuning, LoRA, RLHF, Next.js SSR, Vector DB, Triton inference, serverless AI, TypeScript Node micro-services, AI portfolio Lahore, open-source AI utilities" />


  <meta name="author" content="Muhammad Zain" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://zainafzal.dev/" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />



  {/* Open Graph */}
  <meta property="og:title" content="Muhammad Zain | Gen-AI Engineer & Full-Stack Developer" />
  <meta property="og:description" content="Portfolio of Muhammad Zain, Gen-AI Engineer and full-stack MERN developer. Explore AI projects, web apps, and more." />
  <meta property="og:image" content="https://zainafzal.dev/assets/zain-VC8MXPkY.jpeg" /> {/* use the actual hero image */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://zainafzal.dev/" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Muhammad Zain | Gen-AI Engineer & Full-Stack Developer" />
  <meta name="twitter:description" content="Portfolio of Muhammad Zain, Gen-AI Engineer and full-stack MERN developer. Explore AI projects, web apps, and more." />
  <meta name="twitter:image" content="https://zainafzal.dev/assets/zain-VC8MXPkY.jpeg" />
</Helmet>
      <div className="text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900 min-h-screen overflow-hidden">
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>

        <SmoothCursor />
        
        <div className="container mx-auto px-4 sm:px-8 max-w-full">
          <Navbar />
          <Hero />
          <About />
          <Technologies />
          <Experience />
          <Projects />
          <Certificates />
          <Contact />
        </div>
      </div>
    </>
  );
};

export default App;
