import uolgpa from "../assets/projects/uolgpacal.png";
import chatbotimg from "../assets/projects/chatbot.png";
import leetcode from '../assets/projects/leetcode.png'
import sheikhstudy from '../assets/projects/sheikhsutdy.png'
import drawmath from '../assets/projects/drawmath.png'
import aiimage from '../assets/projects/aiimage.png'
import uolchat from '../assets/projects/uolchat.png'
import zainco from '../assets/projects/zainco.png'
import chatgptclone from '../assets/projects/chatgptclone.png'
export const HERO_CONTENT = `Full Stack Gen AI Developer specializing in production-ready AI SaaS products from concept to deployment. I build intelligent data analysis tools, AI-powered web applications, and enterprise solutions using Next.js, MongoDB, and modern AI APIs, with strong focus on UX, performance, and rapid iteration.`;

export const ABOUT_TEXT = `Full Stack Gen AI Developer specializing in building production-ready AI SaaS products from concept to deployment. I focus on intelligent data analysis tools, AI-powered web applications, and enterprise solutions using Next.js, MongoDB, and modern AI APIs.

Core Strengths:
• RAG pipelines with LangChain + ChromaDB for document intelligence and semantic search
• ReAct agent architectures with Gemini and OpenAI APIs for reasoning + code generation
• AI chat interfaces, PDF Q&A systems, and real-time data visualization dashboards
• Scalable backends with Next.js API routes and FastAPI, with persistent storage in MongoDB
• Auth, payments, and subscriptions for AI SaaS monetization (NextAuth.js)
• Streaming, caching, and prompt engineering for low-latency inference pipelines`;

export const EXPERIENCES = [
  {
    year: "Oct 2025 - Present",
    role: "Full Stack Gen AI Developer",
    company: "Qubit Dynamics",
    description: `Architect and develop end-to-end AI SaaS products from concept to deployment with focus on UX, optimization, and rapid iteration.`,
    highlights: [
      "Architect and develop end-to-end AI SaaS products using Next.js, MongoDB, and TypeScript, delivering production-ready applications from concept to deployment.",
      "Built AI-powered data analysis tools enabling users to query CSV, Excel, and PDF files using natural language, featuring in-browser Python execution and auto-visualization.",
      "Implement ReAct agent architectures with Gemini AI and OpenAI APIs for intelligent reasoning, automatic code generation, and iterative problem-solving in production applications.",
      "Design and develop RAG pipelines using LangChain and ChromaDB for document intelligence, enabling semantic search and context-aware AI responses.",
      "Build scalable backend services with Next.js API routes and FastAPI, integrating AI endpoints with MongoDB for persistent storage and user management.",
      "Implement authentication flows with NextAuth.js, payment integrations, and subscription management for AI SaaS monetization.",
      "Optimize AI inference pipelines achieving sub-100ms response times through streaming responses, caching strategies, and efficient prompt engineering."
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "Gemini API",
      "OpenAI API",
      "RAG",
      "ReAct Agents",
      "NextAuth.js"
    ],
  },
  {
    year: "Jan 2025 - Oct 2025",
    role: "Junior AI Engineer",
    company: "Cybergen",
    description: `Designed, fine-tuned, and deployed LLM and multimodal solutions with low-latency inference and reliable production integrations.`,
    highlights: [
      "Designed, fine-tuned, and deployed LLMs and multimodal models for enterprise use cases including customer support automation.",
      "Built scalable FastAPI backends to serve AI/ML models with low-latency inference and high availability.",
      "Developed RAG pipelines using LangChain and ChromaDB for domain-specific intelligent chatbots.",
      "Integrated AI endpoints into production systems via secure REST and WebSocket APIs with comprehensive error handling.",
      "Optimized model performance through quantization, batching, and asynchronous request handling techniques.",
      "Collaborated with product teams to ship AI-driven features improving user engagement and decision-making workflows."
    ],
    technologies: [
      "Python",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "RAG",
      "WebSocket",
      "REST APIs",
      "LLMs"
    ],
  },
  {
    year: "Mar 2024 - Dec 2024",
    role: "Full Stack Developer",
    company: "Tech Wizardz",
    description: `Led development and maintenance of multiple web applications and backend APIs with a strong focus on performance and delivery.`,
    highlights: [
      "Led development and maintenance of 5+ web applications using React.js, Node.js, and MongoDB.",
      "Designed and implemented RESTful APIs with optimized database queries reducing response time by 30%.",
      "Collaborated with stakeholders for requirement gathering, sprint planning, and timely project delivery using Agile methodologies.",
      "Implemented responsive UI components and integrated third-party services for enhanced functionality."
    ],
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "REST APIs",
      "JavaScript"
    ],
  },
];

export const PROJECTS = [
   {
    title: "UOL AI Powered CHAT APP",
    image: uolchat,
    description:
      "A modern AI-powered chat application that allows users to communicate with each other in real-time. The application uses AI to enhance the user experience by providing features like Slide to AI Reply, UOL GPT, and more.",
    technologies: ["React", "TypeScript", "Tailwind CSS", 'Vite', 'Stable Diffusion','framer motion'],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://uol-chat-app.vercel.app/",
  },
  {
    title: "University of Lahore GPA Calculator",
    image: uolgpa,
    description:
      "A web application that enables students to calculate their GPA based on their academic records, providing an easy-to-use interface for managing and tracking academic performance.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    githubLink: "https://github.com/sheikhmuhammadzain/uolgpacalculator",
    liveLink: "https://uolgpacalculator.netlify.app/",
  },
  {
    title: "Zain & CO",
    image: zainco,
    description:
      "Zain & CO is a Luxury Ecommerce Website for a Luxury Brand. It is a full responsive website that is built using React, TypeScript, Vite, Tailwind CSS, and Framer Motion. ",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://afzal-elegance-commerce.vercel.app/",
  },
  {
    title: "Chatgpt Clone",
    image: chatgptclone,
    description:
      "Chatgpt Clone is a web application that allows users to chat with a chatbot using AI. The application uses a custom model to generate responses based on the user's input.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "OpenAI", "AI"],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://grey-ghost-chat.vercel.app/",
  },
  
  {
    title: "Studdy Buddy ChatBot",
    image: chatbotimg,
    description:
      "An AI-powered chatbot that simulates human conversation by generating natural language responses to user inputs. Leverages NLP techniques to understand and respond to student questions, providing personalized learning assistance.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "NLP", "AI"],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://studybuddyai.netlify.app/",
  },
  {
    title: "IET Study Hub",
    image: sheikhstudy,
    description:
      "Full Stack Web Application for a study hub that allows students to access a wide range of study materials and resources. All subject notes are available in one place.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "NLP", "AI",'Gemeni AI'],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://ietstudyhub.vercel.app/",
  },
  {
    title: "Drawing Math Solver",
    image: drawmath,
    description:
      "Drawing Math Solver is a web application that allows students to solve math problems by drawing them on a canvas. The application uses a custom model to recognize the math problem and solve it.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Tessaret", "NLP", "AI",'Gemeni AI'],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://drawmathzain.netlify.app/",
  },
  {
    title: "AI Image Generator",
    image: aiimage,
    description:
      "AI Image Generator is a web application that allows users to generate images using AI. The application uses a custom model to generate images based on the user's prompt.",
    technologies: ["React", "TypeScript", "Tailwind CSS", 'Vite', 'Stable Diffusion','framer motion'],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://zainimage.netlify.app/",
  },
  {
    title: "LeetCoders Gang",
    image: leetcode,
    description:
      "LeetCoders Gang is an ai powered platform that allows users to create ai powered posts about leetcode problems. The application uses a custom model to generate posts based on the user's prompt.",
    technologies: ["React", "TypeScript", "Tailwind CSS", 'Vite', 'Gemini','framer motion'],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://leetcodersgang.vercel.app/",
  }
 
];

export const CONTACT = {
  address: "Green Town Lahore ",
  phoneNo: "+92 303 2224501 ",
  email: "zain@zainafzal.dev",
};
