import { motion } from "framer-motion";
import aboutImg from "../assets/about.jpg";
import { ABOUT_TEXT } from "../constants";
const About = () => {
  return (
    <div className="border-b border-neutral-900 pb-16 pt-8">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="text-4xl text-center mb-12"
      >
        About <span className="text-neutral-500">Me</span>
      </motion.h2>
      <div className="flex flex-wrap">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:w-1/2 lg:p-8"
        >
          <div className="flex items-center justify-center ">
            <img className="rounded-2xl lg:w-96" src={aboutImg} alt="Muhammad Zain - Professional profile photo showing Gen-AI Engineer" />
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex justify-center lg:justify-start">
            <div className="my-2 max-w-xl py-6 space-y-2">
              <p className="text-sm font-light leading-tight">
                I'm a <span className="text-purple-400 font-medium">Gen-AI Engineer</span> and <span className="text-purple-400 font-medium">full-stack MERN developer</span> building production-grade AI systems that deliver real business value. With 3+ years of experience in LLM pipelines, RAG systems, and modern web development, I help companies transform AI research into scalable applications.
              </p>
              
              <h3 className="text-base font-medium text-neutral-200 mt-4 mb-2">
                Key Expertise:
              </h3>
              
              <ul className="space-y-1 ml-4">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                  <span className="text-sm font-light leading-tight">
                    <span className="text-purple-400 font-medium">RAG pipelines</span> & AI agents serving <span className="text-purple-400 font-medium">1M+ requests</span> with <span className="text-purple-400 font-medium">99.9% uptime</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                  <span className="text-sm font-light leading-tight">
                    Advanced AI techniques: <span className="text-purple-400 font-medium">LoRA fine-tuning</span>, <span className="text-purple-400 font-medium">RLHF</span>, vector databases, Triton inference
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                  <span className="text-sm font-light leading-tight">
                    <span className="text-purple-400 font-medium">Data analysis agent expert</span> & <span className="text-purple-400 font-medium">chatbot expert</span> specializing in conversational AI
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                  <span className="text-sm font-light leading-tight">
                    <span className="text-purple-400 font-medium">n8n workflow automation</span> & agent orchestration for enterprise solutions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                  <span className="text-sm font-light leading-tight">
                    Enterprise web services: <span className="text-purple-400 font-medium">TypeScript</span>, <span className="text-purple-400 font-medium">Next.js SSR</span>, <span className="text-purple-400 font-medium">Node.js microservices</span>, Kubernetes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5 text-xs">•</span>
                  <span className="text-sm font-light leading-tight">
                    Team leadership delivering AI features with <span className="text-purple-400 font-medium">sub-200ms latency</span>
                  </span>
                </li>
              </ul>
              
              <p className="text-sm font-light leading-tight mt-4">
                I contribute to the AI community through open-source tools and mentoring. Ready to turn your AI vision into production reality? <span className="text-purple-400 font-medium">Let's collaborate</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
