import uolgpa from "../assets/projects/uolgpacal.png";
import todoimg from "../assets/projects/todomodern.png";
import chatbotimg from "../assets/projects/chatbot.png";
export const HERO_CONTENT = `I am a passionate Full Stack Developer with 3+ years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `I am a dedicated and versatile Full Stack developer with a passion for creating efficient and user-friendly web applications. With 2+ years of professional experience, I have worked with a variety of technologies, including React, Next.js, Node.js, MySQL, PostgreSQL, and MongoDB. My journey in web development began with a deep curiosity for how things work, and it has evolved into a career where I continuously strive to learn and adapt to new challenges. I thrive in collaborative environments and enjoy solving complex problems to deliver high-quality solutions. Outside of coding, I enjoy staying active, exploring new technologies, and contributing to open-source projects.`;

export const EXPERIENCES = [
  {
    year: "2023 - Present",
    role: "React Intern",
    company: "Tech Wizardz",
    description: `Led a team in developing and maintaining web applications using JavaScript, React.js, and Node.js. Implemented RESTful APIs and integrated with MongoDB databases. Collaborated with stakeholders to define project requirements and timelines.`,
    technologies: ["Javascript", "React.js", "Next.js", "mongoDB"],
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
    title: "Modern Todo App",
    image: todoimg,
    description:
      "A modern and responsive todo app built with react typescript for efficient task management.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    githubLink: "https://github.com/sheikhmuhammadzain/modernTodo",
    liveLink: "https://wondrous-begonia-10b6f9.netlify.app/",
  },
  {
    title: "Studdy Buddy ChatBot",
    image: chatbotimg,
    description:
      "A chatbot is a computer program that simulates human conversation by generating natural language responses to user inputs. Chatbots are used in various applications, such as customer service, knowledgebases, and virtual assistants.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    githubLink: "https://github.com/sheikhmuhammadzain",
    liveLink: "https://studybuddyai.netlify.app/",
  },
];

export const CONTACT = {
  address: "Green Town Lahore ",
  phoneNo: "+92 303 2224501 ",
  email: "zainsheikh3462@gmail.com",
};
