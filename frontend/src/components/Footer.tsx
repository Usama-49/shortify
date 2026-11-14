import { useState } from "react";
import {
  Sparkles,
  X,
  ShieldCheck,
  FileText,
  Terminal,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";

type ModalType = "privacy" | "terms" | "api" | "contact" | null;

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const currentYear = new Date().getFullYear();

  const CONTACT_EMAIL = "usamahere49@gmail.com";
  const WHATSAPP_NUMBER = "923379711200"; // International format without '+' or spaces
  const WHATSAPP_DISPLAY = "+92 337 9711200";

  const modalContent = {
    privacy: {
      title: "Privacy Policy",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      body: [
        "We collect only the essential data required to shorten and redirect your URLs reliably.",
        "Authentication relies on secure, HTTP-only cookies—we never expose session tokens to third-party trackers or ad networks.",
        "Your shortened links and account credentials are stored securely and are never sold or shared with external brokers.",
      ],
    },
    terms: {
      title: "Terms of Service",
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      body: [
        "Shortify is provided for legitimate link sharing, analytics, and personal or commercial project workflows.",
        "You may not use Shortify to mask phishing links, malware, spam, or illegal content. Abusive slugs will be deactivated immediately.",
        "Custom slugs are claimed on a first-come, first-served basis and remain active as long as your account complies with fair-use guidelines.",
      ],
    },
    api: {
      title: "Developer API",
      icon: <Terminal className="w-5 h-5 text-indigo-400" />,
      body: [
        "POST /api/create — Accepts a JSON payload with { url, customSlug? } to generate a short link.",
        "Authenticated sessions automatically unlock custom 3–8 character alphanumeric slugs.",
        "Public programmatic API keys and rate-limit tiers are currently in private beta.",
      ],
    },
  };

  return (
    <>
      <footer className="w-full py-6 px-6 sm:px-10 bg-zinc-950/40 backdrop-blur-xl border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 z-20 relative">
        {/* Brand copyright */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-400">Shortify</span>
          <span>&copy; {currentYear} All rights reserved.</span>
        </div>

        {/* Center badge */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span>Powered with</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Gen URL Architecture</span>
        </div>

        {/* Interactive Links */}
        <div className="flex items-center gap-3 sm:gap-4 text-zinc-500">
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveModal("terms")}
            className="hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Terms
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveModal("api")}
            className="hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            API
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveModal("contact")}
            className="hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Contact
          </button>
        </div>
      </footer>

      {/* Glassmorphism Info / Contact Modal */}
      {activeModal && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-indigo-500/10 text-zinc-200 space-y-4 relative"
          >
            {activeModal === "contact" ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Contact Us
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Close modal"
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Have a question, custom slug inquiry, or feedback? Reach out
                  directly via WhatsApp or Email:
                </p>

                <div className="space-y-3 pt-1">
                  {/* WhatsApp Action Card */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Hi Usama! I'm reaching out regarding Shortify.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/50 transition-all group no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">
                          WhatsApp
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">
                          {WHATSAPP_DISPLAY}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </a>

                  {/* Email Action Card (Opens in a new tab) */}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      "Shortify Inquiry",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-indigo-500/50 transition-all group no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">
                          Email
                        </div>
                        <div className="text-xs text-zinc-400">
                          {CONTACT_EMAIL}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    {modalContent[activeModal].icon}
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {modalContent[activeModal].title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Close modal"
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {modalContent[activeModal].body.map((paragraph, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{paragraph}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
