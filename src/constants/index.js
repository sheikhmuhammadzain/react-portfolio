import uolgpa from "../assets/projects/uolgpacal.png";
import chatbotimg from "../assets/projects/chatbot.png";
import leetcode from '../assets/projects/leetcode.png'
import sheikhstudy from '../assets/projects/sheikhsutdy.png'
import drawmath from '../assets/projects/drawmath.png'
import aiimage from '../assets/projects/aiimage.png'
import uolchat from '../assets/projects/uolchat.png'
import zainco from '../assets/projects/zainco.png'
import chatgptclone from '../assets/projects/chatgptclone.png'
export const HERO_CONTENT = `I’m a Gen-AI Engineer and full-stack MERN developer who turns complex ideas into profitable, human-centric products. From fine-tuning 7-to-70 B models to shipping React/Node apps on serverless infra, I’ve spent 3+ years closing the gap between cutting-edge research and real-world ROI.`;

export const ABOUT_TEXT = `My day starts with coffee and a GPU cluster, and ends with clean commits and a dashboard full of happier users.  
Over the past three years I’ve:

• Designed and deployed RAG pipelines, autonomous agents, and diffusion tools that serve 1 M+ requests per week.  
• Married transformer magic (LoRA/RLHF, vector DBs, Triton inference) to bullet-proof web services (TypeScript, Next.js SSR, Node micro-services, PostgreSQL/Mongo, K8s, Terraform).  
• Led cross-functional squads in two-week sprints, turning white-board sketches into revenue-generating features while keeping latency <200 ms and SLAs >99.9 %.  

Beyond code, I open-source prompt-engineering utilities, mentor junior devs, and stay sharp through papers and hackathons. If you’re ready to ship AI that works as beautifully as it looks, let’s talk.`;

export const EXPERIENCES = [
  {
    year: "2025 - Present",
    role: "AI Engineer",
    company: "Cybergen",
    description: `Developed and deployed machine learning models and NLP solutions for various business applications. Created and optimized neural networks using TensorFlow and PyTorch. Integrated AI solutions with web applications using RESTful APIs. Collaborated with cross-functional teams to implement AI-driven features that enhanced user experience and business outcomes.`,
    technologies: ["Python", "TensorFlow", "PyTorch", "NLP", "RESTful APIs", "Docker"],
  },
  {
    year: "2024 - 2025",
    role: "Full Stack Developer",
    company: "Tech Wizardz",
    description: `Led a team in developing and maintaining web applications using JavaScript, React.js, and Node.js. Implemented RESTful APIs and integrated with MongoDB databases. Collaborated with stakeholders to define project requirements and timelines.`,
    technologies: ["Javascript", "React.js", "Next.js", "Node.js", "MongoDB"],
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
  email: "zain.afzal@cybergen.com",
};
