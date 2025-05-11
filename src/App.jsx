import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Technologies from "./components/Technologies";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import SmoothCursor from "./components/SmoothCursor";
import Certificates from "./components/Certificates";

const App = () => {
  return (
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
  );
};

export default App;
