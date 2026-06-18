import { useState, FormEvent } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router";
import ridelyLogo from "../assets/brand";

const companyLinks = [
  { label: "Home", href: "#Home" },
  { label: "About Us", href: "#Timeline" },
  { label: "Services", href: "#Services" },
  { label: "Blogs", href: "#Blogs" },
];

type FooterLink =
  | { label: string; href: string; to?: never }
  | { label: string; to: string; href?: never };

const supportLinks: FooterLink[] = [
  { label: "Contact", href: "#Contact" },
  { label: "FAQs", href: "#FAQs" },
  { label: "Waitlist", href: "#Waitlist" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

const socialLinks = [
  { href: "https://www.facebook.com/ridely", icon: FaFacebook },
  { href: "https://twitter.com/ridely", icon: FaTwitter },
  { href: "https://www.instagram.com/ridely", icon: FaInstagram },
  { href: "https://www.linkedin.com/company/ridely", icon: FaLinkedin },
  { href: "https://github.com/Ridely-LTD", icon: FaGithub },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent("Ridely Newsletter Signup");
    const body = encodeURIComponent(
      `Please add me to the Ridely newsletter: ${email}`,
    );
    window.location.href = `mailto:Ridely.inc@gmail.com?subject=${subject}&body=${body}`;
    setEmail("");
  };

  return (
    <footer
      style={{ background: "#050508" }}
      className="text-white pt-16 pb-8 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <img
              src={ridelyLogo}
              alt="Ridely"
              className="h-16 md:h-20 w-auto mb-5"
            />
            <p className="text-sm mb-4" style={{ color: "#a0a0b0" }}>
              Fast, reliable, and trackable package delivery — built for
              Nigerian streets.
            </p>
            <p className="text-sm" style={{ color: "#a0a0b0" }}>
              19, Ewanbor str, Benin-city, Nigeria.
            </p>
            <p className="text-sm mt-1" style={{ color: "#a0a0b0" }}>
              Ridely.inc@gmail.com
            </p>
            <p className="text-sm" style={{ color: "#a0a0b0" }}>
              +234 916 503 2925
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#175aff] transition-colors"
                    style={{ color: "#a0a0b0" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="hover:text-[#175aff] transition-colors"
                      style={{ color: "#a0a0b0" }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-[#175aff] transition-colors"
                      style={{ color: "#a0a0b0" }}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Stay Updated
            </h3>
            <p className="text-sm mb-4" style={{ color: "#a0a0b0" }}>
              Get launch updates and delivery tips in your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#175aff]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-bold text-white flex-shrink-0"
                style={{ background: "#175aff" }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-6">
            {socialLinks.map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div whileHover={{ scale: 1.15, y: -2 }}>
                  <Icon
                    className="w-5 h-5 hover:text-[#175aff] transition-colors"
                    style={{ color: "#a0a0b0" }}
                  />
                </motion.div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-sm" style={{ color: "#a0a0b0" }}>
              Made with ♥ in Nigeria
            </span>
            <div
              className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
              style={{
                background: "rgba(23,90,255,0.15)",
                color: "#175aff",
                border: "1px solid rgba(23,90,255,0.3)",
              }}
            >
              Techstars Alumni
            </div>
          </div>

          <p className="text-sm" style={{ color: "#a0a0b0" }}>
            © 2025 Ridely. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
