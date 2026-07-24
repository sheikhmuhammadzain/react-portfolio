import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import freecodecampLogo from "../assets/freecodecamp.webp";

const SCALE_STEP = 0.04; // each card buried scales down by this much

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const certificates = [
  { title: "Intro to AI Engineering", organization: "Scrimba", logo: "scrimba", date: "Mar 2025", credentialId: "4LFT2WY1XS0F", skills: [] },
  { title: "Learn AI Agents", organization: "Scrimba", logo: "scrimba", date: "Mar 2025", credentialId: "EJS513JTFG8J", skills: ["AI", "Python"] },
  { title: "Crash Course on Python", organization: "Google", logo: "google", date: "Feb 2025", credentialId: "1L69KG93RRQK", skills: ["Python"] },
  { title: "Generative AI for Software Development", organization: "DeepLearning.AI", logo: "deeplearning", date: "Feb 2025", credentialId: "K1BJJAR8566G", skills: [] },
  { title: "Introduction to Generative AI for Software Development", organization: "DeepLearning.AI", logo: "deeplearning", date: "Jan 2025", credentialId: "X32R8PPX1S70", skills: ["Python"] },
  { title: "Team Software Engineering with AI", organization: "DeepLearning.AI", logo: "deeplearning", date: "Jan 2025", credentialId: "", skills: ["AI", "Machine Learning"] },
  { title: "Responsive Web Design", organization: "freeCodeCamp", logo: "freecodecamp", date: "Jul 2024", credentialId: "sheikhmuhammadzain-rwd", skills: ["CSS"] },
];

const getCredentialUrl = (id, org) => {
  if (org === "freeCodeCamp" && id) return `https://www.freecodecamp.org/certification/${id}`;
  if (org === "Scrimba" && id) return `https://scrimba.com/certificate/${id}`;
  return "#";
};

const getLogo = (logo) => {
  switch (logo) {
    case "scrimba": return <img src="https://images.squarespace-cdn.com/content/v1/670e19b4ec92287da728eb2b/861f1806-9999-4aa6-a116-ee67ea1cfce3/Scrimba.png" alt="Scrimba" className="h-full w-auto object-contain filter invert" />;
    case "google": return <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-9 w-auto object-contain" />;
    case "deeplearning": return <img src="https://learn.deeplearning.ai/assets/dlai-logo.png" alt="DeepLearning.AI" className="h-12 w-auto object-contain" />;
    case "freecodecamp": return <img src={freecodecampLogo} alt="freeCodeCamp" className="h-11 w-auto object-contain filter invert" />;
    default: return <div className="h-full w-full rounded-sm bg-neutral-700" />;
  }
};

const CertificateCard = ({ cert }) => {
  const url = getCredentialUrl(cert.credentialId, cert.organization);
  return (
    <div className="flex h-[360px] flex-col overflow-hidden rounded-2xl border border-neutral-700/50 bg-neutral-900 shadow-2xl">
      <div className="flex h-28 shrink-0 items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 p-6">
        <div className="h-12 w-auto">{getLogo(cert.logo)}</div>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="mb-1 text-lg font-semibold text-neutral-100 sm:text-xl">{cert.title}</h3>
        <p className="text-sm font-medium text-neutral-300">{cert.organization}</p>
        <p className="mb-4 text-xs text-neutral-500">Issued {cert.date}</p>

        {cert.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {cert.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-purple-400">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto border-t border-neutral-700/50 pt-4">
          {url !== "#" ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-neutral-400 transition-colors hover:text-purple-400"
            >
              <HugeiconsIcon icon={LinkSquare02Icon} size={16} strokeWidth={1.8} className="mr-2 shrink-0" />
              Show credential
            </a>
          ) : cert.credentialId ? (
            <p className="text-xs text-neutral-500">Credential ID: {cert.credentialId}</p>
          ) : (
            <span className="text-xs italic text-neutral-600">No credential link</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Sticky card that pins to the top and scales down as the next card scrolls over
// it, building a stacked deck. Adapted from Skiper UI's StickyCard_003.
const StickyCard = ({ cert, index, total }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });
  // Cards further down the stack (lower index) end up smaller; the top card stays 1.
  const targetScale = 1 - (total - 1 - index) * SCALE_STEP;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={container} className="sticky top-0 flex h-screen items-center justify-center">
      <motion.div
        style={{ scale, top: `calc(-4vh + ${index * 20}px)` }}
        className="relative w-full max-w-2xl"
      >
        <CertificateCard cert={cert} />
      </motion.div>
    </div>
  );
};

const Certificates = () => {
  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Certificates
      </motion.h2>

      {prefersReducedMotion ? (
        // Static, readable fallback - no scroll-driven motion
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4">
          {certificates.map((cert) => (
            <CertificateCard key={cert.title} cert={cert} />
          ))}
        </div>
      ) : (
        <div className="px-4">
          {certificates.map((cert, index) => (
            <StickyCard key={cert.title} cert={cert} index={index} total={certificates.length} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
