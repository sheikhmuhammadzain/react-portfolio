import resume from "../assets/resume/my_resume-zain.pdf";
import { RESUME_FILENAME } from "../constants";

// Single source of truth for triggering a resume download with the right filename.
// We fetch into a blob first: a plain <a download> to a .pdf is ignored when the
// browser opens PDFs in a viewer, which leaks the hashed asset name. A blob URL
// always downloads and honors the filename.
export const downloadResume = async () => {
  try {
    const res = await fetch(resume);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = RESUME_FILENAME;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: direct link (may open in a viewer, but better than nothing)
    const a = document.createElement("a");
    a.href = resume;
    a.download = RESUME_FILENAME;
    a.click();
  }
};
