import { motion } from "framer-motion";
import aboutImg from "../assets/about.jpg";
import { ABOUT_TEXT } from "../constants";
const About = () => {
  return (
    <div className="border-b border-neutral-900 pb-16 pt-8">
      <h2 className="text-4xl text-center mb-12">
        About <span className="text-neutral-500">Me</span>
      </h2>
      <div className="flex flex-wrap">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 1, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 lg:p-8"
        >
          <div className="flex items-center justify-center ">
            <img className="rounded-2xl lg:w-96" src={aboutImg} alt="Muhammad Zain - Professional profile photo showing Gen-AI Engineer" />
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 1, x: 100 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex justify-center lg:justify-start">
            <div className="my-2 max-w-xl py-6 space-y-4">
              <p className="text-lg leading-relaxed">
                I'm a <span className="text-purple-400 font-semibold">Gen-AI Engineer</span> and <span className="text-purple-400 font-semibold">full-stack MERN developer</span> building production-grade AI systems that deliver real business value. With 3+ years of experience in LLM pipelines, RAG systems, and modern web development, I help companies transform AI research into scalable applications.
              </p>
              
              <h3 className="text-xl font-semibold text-neutral-200 mt-6 mb-3">
                Key Expertise:
              </h3>
              
              <ul className="space-y-3 ml-4">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span className="text-lg leading-relaxed">
                    <span className="text-purple-400 font-semibold">RAG pipelines</span> & AI agents serving <span className="text-purple-400 font-semibold">1M+ requests</span> with <span className="text-purple-400 font-semibold">99.9% uptime</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span className="text-lg leading-relaxed">
                    Advanced AI techniques: <span className="text-purple-400 font-semibold">LoRA fine-tuning</span>, <span className="text-purple-400 font-semibold">RLHF</span>, vector databases, Triton inference
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span className="text-lg leading-relaxed">
                    Enterprise web services: <span className="text-purple-400 font-semibold">TypeScript</span>, <span className="text-purple-400 font-semibold">Next.js SSR</span>, <span className="text-purple-400 font-semibold">Node.js microservices</span>, Kubernetes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span className="text-lg leading-relaxed">
                    Team leadership delivering AI features with <span className="text-purple-400 font-semibold">sub-200ms latency</span>
                  </span>
                </li>
              </ul>
              
              <p className="text-lg leading-relaxed mt-6">
                I contribute to the AI community through open-source tools and mentoring. Ready to turn your AI vision into production reality? <span className="text-purple-400 font-semibold">Let's collaborate</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
