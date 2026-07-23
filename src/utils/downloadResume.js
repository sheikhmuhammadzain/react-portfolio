import resume from "../assets/resume/my_resume-zain.pdf";
import { RESUME_FILENAME } from "../constants";

// Single source of truth for triggering a resume download with the right filename.
export const downloadResume = () => {
  const a = document.createElement("a");
  a.href = resume;
  a.download = RESUME_FILENAME;
  a.click();
};
