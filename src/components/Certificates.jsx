import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

// --- Optimized Animation Variants ---

// Variants for cards (stagger effect)
const cardVariants = {
  hidden: { opacity: 0, y: 30 }, // Start slightly lower
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08, // Slightly faster stagger delay
      duration: 0.4,  // Slightly faster duration
      ease: "easeOut", // Smooth easing
    },
  }),
};

// Variants for the heading
const headingVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// --- Component ---

const Certificates = () => {
  // Keep your certificates data structure as is
  const certificates = [
    { title: "Intro to AI Engineering", organization: "Scrimba", logo: "scrimba", date: "Mar 2025", credentialId: "4LFT2WY1XS0F", skills: [] },
    { title: "Learn AI Agents", organization: "Scrimba", logo: "scrimba", date: "Mar 2025", credentialId: "EJS513JTFG8J", skills: ["AI", "Python (Programming Language)"] },
    { title: "Crash Course on Python", organization: "Google", logo: "google", date: "Feb 2025", credentialId: "1L69KG93RRQK", skills: ["Python (Programming Language)"] },
    { title: "Generative AI for Software Development", organization: "DeepLearning.AI", logo: "deeplearning", date: "Feb 2025", credentialId: "K1BJJAR8566G", skills: [] },
    { title: "Introduction to Generative AI for Software Development", organization: "DeepLearning.AI", logo: "deeplearning", date: "Jan 2025", credentialId: "X32R8PPX1S70", skills: ["Python (Programming Language)"] },
    { title: "Team Software Engineering with AI", organization: "DeepLearning.AI", logo: "deeplearning", date: "Jan 2025", credentialId: "", skills: ["AI", "Machine Learning"] },
    { title: "Responsive Web Design", organization: "freeCodeCamp", logo: "freecodecamp", date: "Jul 2024", credentialId: "sheikhmuhammadzain-rwd", skills: ["Cascading Style Sheets (CSS)"] }
  ];

  // Helper function to construct credential URL (replace with actual logic if possible)
  const getCredentialUrl = (id, org) => {
    // Example: freeCodeCamp - Adjust structure based on actual URLs
    if (org === 'freeCodeCamp' && id) {
        // Assuming the id might be a username-certification slug
        // Or potentially just the ID needs to be inserted into a standard URL
        return `https://www.freecodecamp.org/certification/${id}`; // Modify this based on actual FCC URL structure
    }
    // Add logic for Scrimba, Google, DeepLearning.AI if verifiable URLs exist
    if (org === 'Scrimba' && id) {
        return `https://scrimba.com/certificate/${id}`; // Hypothetical Scrimba URL
    }
    // Fallback if no specific URL logic or ID is missing
    return '#'; // Keep '#' if no real link can be constructed
  };


  return (
    <div className="border-b border-neutral-800/50 pb-24">
      <motion.h2
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }} // Trigger when 30% visible
        className="my-20 text-center text-4xl font-thin tracking-tight text-neutral-100"
      >
        Certificates
      </motion.h2>

      {/* Grid layout for certificate cards */}
      <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate.title + index} // More robust key
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} // Trigger when 30% visible
            // Optimized Hover effect
            whileHover={{ scale: 1.03, y: -6 }} // Subtle lift/scale
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Fine-tuned spring
            className="
              group relative flex flex-col overflow-hidden rounded-lg
              border border-neutral-700/50 bg-neutral-900/40
              shadow-md backdrop-blur-sm
              hover:shadow-xl hover:shadow-purple-900/20 hover:border-neutral-600
              // --- Optimization: Specific CSS transitions ---
              transition-[border-color,box-shadow] duration-300 ease-in-out
              // Framer Motion handles transform (scale, y) via whileHover
            "
          >
            {/* Logo Section */}
            <div className="relative flex h-36 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 p-4"> {/* Added padding */}
              {/* Logo container uses CSS transition for scale */}
              <div className="relative h-16 w-auto transition-transform duration-300 ease-in-out group-hover:scale-110">
                {getLogo(certificate.logo)}
              </div>
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div> {/* Changed overlay */}
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-6"> {/* Use flex-1 */}
              <h3 className="mb-2 text-xl font-semibold text-neutral-100">
                {certificate.title}
              </h3>
              <p className="mb-1 text-sm font-medium text-neutral-300"> {/* Slightly adjusted margin/weight */}
                {certificate.organization}
              </p>
              <p className="mb-3 text-xs text-neutral-500"> {/* Smaller date text */}
                Issued {certificate.date}
              </p>

              {/* Skills */}
              {certificate.skills.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {certificate.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-purple-400 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

                {/* Credential ID (display only if no link) */}
                {certificate.credentialId && getCredentialUrl(certificate.credentialId, certificate.organization) === '#' && (
                     <p className="mb-4 text-xs text-neutral-500">
                        Credential ID: {certificate.credentialId}
                     </p>
                )}

              {/* Links Section - Pushed to bottom */}
              <div className="mt-auto border-t border-neutral-700/50 pt-4">
                 {/* Show Credential Link */}
                 {certificate.credentialId && getCredentialUrl(certificate.credentialId, certificate.organization) !== '#' ? (
                   <a
                    href={getCredentialUrl(certificate.credentialId, certificate.organization)}
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    className="inline-flex items-center text-sm text-neutral-400 transition-colors duration-200 hover:text-purple-400" // Use inline-flex
                    aria-label={`Show credential for ${certificate.title}`}
                   >
                     <FaExternalLinkAlt className="mr-2 h-4 w-4 shrink-0" /> {/* Added shrink-0 */}
                     Show credential
                   </a>
                 ) : certificate.credentialId ? (
                     // Show ID textually if no link is available but ID exists
                     <p className="text-xs text-neutral-500">
                        Credential ID: {certificate.credentialId}
                     </p>
                 ) : (
                     // Placeholder if no ID and thus no link
                     <span className="text-xs text-neutral-600 italic">No credential link available</span>
                 )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Keep your getLogo function as is
const getLogo = (logo) => {
  switch (logo) {
    case "scrimba": return <img src="https://images.squarespace-cdn.com/content/v1/670e19b4ec92287da728eb2b/861f1806-9999-4aa6-a116-ee67ea1cfce3/Scrimba.png" alt="Scrimba" className="h-full w-auto object-contain filter invert" />;
    case "google": return <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-10 w-auto object-contain" />;
    case "deeplearning": return <img src="https://learn.deeplearning.ai/assets/dlai-logo.png" alt="DeepLearning.AI" className="h-14 w-auto object-contain" />;
    case "freecodecamp": return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/FreeCodeCamp_logo.svg/2560px-FreeCodeCamp_logo.svg.png" alt="freeCodeCamp" className="h-12 w-auto object-contain filter invert" />;
    default: return <div className="h-full w-full bg-neutral-700 rounded-sm"></div>; // Added rounding
  }
};

export default Certificates;