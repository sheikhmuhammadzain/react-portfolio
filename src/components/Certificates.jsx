import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";

const certificates = [
  { title: "Intro to AI Engineering", organization: "Scrimba", logo: "scrimba", date: "Mar 2025", credentialId: "4LFT2WY1XS0F", skills: [] },
  { title: "Learn AI Agents", organization: "Scrimba", logo: "scrimba", date: "Mar 2025", credentialId: "EJS513JTFG8J", skills: ["AI", "Python"] },
  { title: "Crash Course on Python", organization: "Google", logo: "google", date: "Feb 2025", credentialId: "1L69KG93RRQK", skills: ["Python"] },
  { title: "Generative AI for Software Development", organization: "DeepLearning.AI", logo: "deeplearning", date: "Feb 2025", credentialId: "K1BJJAR8566G", skills: [] },
  { title: "Intro to Generative AI for Software Dev", organization: "DeepLearning.AI", logo: "deeplearning", date: "Jan 2025", credentialId: "X32R8PPX1S70", skills: ["Python"] },
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
    case "freecodecamp": return <img src="https://cdn.simpleicons.org/freecodecamp/e5e5e5" alt="freeCodeCamp" className="h-10 w-auto object-contain" />;
    default: return <div className="h-full w-full rounded-sm bg-neutral-700" />;
  }
};

const CertificateCard = ({ cert }) => {
  const url = getCredentialUrl(cert.credentialId, cert.organization);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-neutral-900/90">
      <div className="flex h-28 shrink-0 items-center justify-center px-8 pt-2">
        <div className="h-12 w-auto">{getLogo(cert.logo)}</div>
      </div>
      <div className="flex flex-1 flex-col px-8 pb-8">
        <h3 className="mb-1.5 text-lg font-semibold leading-snug text-neutral-100">{cert.title}</h3>
        <p className="text-sm font-medium text-neutral-300">{cert.organization}</p>
        <p className="mb-4 text-xs text-neutral-500">Issued {cert.date}</p>

        {cert.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {cert.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-neutral-800/80 px-3 py-1 text-xs font-medium text-neutral-200">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3">
          {url !== "#" ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-neutral-400 transition-colors hover:text-neutral-200"
            >
              <HugeiconsIcon icon={LinkSquare02Icon} size={15} strokeWidth={1.8} className="mr-1.5 shrink-0" />
              Show credential
            </a>
          ) : cert.credentialId ? (
            <p className="text-xs text-neutral-500">ID: {cert.credentialId}</p>
          ) : (
            <span className="text-xs italic text-neutral-600">No credential link</span>
          )}
        </div>
      </div>
    </div>
  );
};

const css = `
  .certs-swiper {
    width: 100%;
    padding-bottom: 3.5rem !important;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%);
  }
  .certs-swiper .swiper-slide {
    width: 380px;
    max-width: 85vw;
    height: 360px;
    border-radius: 1.5rem;
    overflow: hidden;
  }
  .certs-swiper .swiper-pagination-bullet {
    background-color: #525252 !important;
    opacity: 1;
  }
  .certs-swiper .swiper-pagination-bullet-active {
    background-color: #e5e5e5 !important;
  }
  .cert-nav {
    align-items: center;
    justify-content: center;
    height: 2.75rem;
    width: 2.75rem;
    flex-shrink: 0;
    border-radius: 9999px;
    color: #a3a3a3;
    background: rgba(255, 255, 255, 0.04);
    transition: color 0.2s ease, background-color 0.2s ease;
  }
  .cert-nav:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.09);
  }
`;

const Certificates = () => {
  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <style>{css}</style>
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Certificates
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mx-auto flex w-full max-w-6xl items-center justify-center gap-1 px-2 sm:gap-4 sm:px-4"
      >
        {/* Arrows sit outside the deck as flex siblings so they never overlap the cards */}
        <button type="button" aria-label="Previous certificate" className="cert-prev cert-nav hidden sm:flex">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView="auto"
          spaceBetween={0}
          coverflowEffect={{ rotate: 40, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
          pagination={{ clickable: true }}
          navigation={{ nextEl: ".cert-next", prevEl: ".cert-prev" }}
          className="certs-swiper min-w-0 flex-1"
          modules={[EffectCoverflow, Pagination, Navigation]}
        >
          {certificates.map((cert) => (
            <SwiperSlide key={cert.title}>
              <CertificateCard cert={cert} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button type="button" aria-label="Next certificate" className="cert-next cert-nav hidden sm:flex">
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </motion.div>
    </div>
  );
};

export default Certificates;
