import uolgpa from "../assets/projects/uolgpacal.png";
import todoimg from "../assets/projects/todomodern.png";
import chatbotimg from "../assets/projects/chatbot.png";
import sheikhstudy from '../assets/projects/sheikhsutdy.png'
import drawmath from '../assets/projects/drawmath.png'
import aitask from '../assets/projects/aitask.png'
import aiimage from '../assets/projects/aiimage.png'
export const HERO_CONTENT = `I am a passionate AI Engineer and Full Stack Developer with 3+ years of hands-on experience. I have honed my skills in AI technologies like TensorFlow, PyTorch, and NLP, along with front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative AI-powered solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `I am a dedicated and versatile AI Engineer and Full Stack Developer with a passion for creating intelligent and user-friendly applications. With 3+ years of professional experience, I have worked with a variety of technologies, including machine learning frameworks like TensorFlow and PyTorch, as well as web technologies such as React, Next.js, Node.js, MySQL, PostgreSQL, and MongoDB. My journey began with a deep curiosity for AI and software development, which has evolved into a career where I continuously strive to learn and adapt to new challenges in the rapidly evolving field of artificial intelligence. I thrive in collaborative environments and enjoy solving complex problems to deliver high-quality, AI-driven solutions. Outside of coding, I enjoy staying active, exploring new technologies, and contributing to open-source projects.`;

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
    title: "University of Lahore GPA Calculator",
    image: uolgpa,
    description:
      "A web application that enables students to calculate their GPA based on their academic records, providing an easy-to-use interface for managing and tracking academic performance.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    githubLink: "https://github.com/sheikhmuhammadzain/uolgpacalculator",
    liveLink: "https://uolgpacalculator.netlify.app/",
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
    title: "AI Task Manager",
    image: aitask,
    description:
      "AI Task Manager is a web application that allows users to manage their tasks using AI. The application uses a custom model to generate tasks based on the user's prompt.",
    technologies: ["React", "TypeScript", "Tailwind CSS", 'Vite', 'Stable Diffusion','framer motion'],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://aitodozain.netlify.app/",
  },
];

export const CONTACT = {
  address: "Green Town Lahore ",
  phoneNo: "+92 303 2224501 ",
  email: "zainsheikh3462@gmail.com",
};
