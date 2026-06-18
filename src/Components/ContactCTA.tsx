import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const socialLinks = [
  { href: "https://www.facebook.com/ridely", icon: FaFacebook, label: "Facebook" },
  { href: "https://twitter.com/ridely", icon: FaTwitter, label: "Twitter" },
  { href: "https://www.instagram.com/ridely", icon: FaInstagram, label: "Instagram" },
  { href: "https://www.linkedin.com/company/ridely", icon: FaLinkedin, label: "LinkedIn" },
  { href: "https://github.com/Ridely-LTD", icon: FaGithub, label: "GitHub" },
];

export default function ContactCTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Ridely Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:Ridely.inc@gmail.com?subject=${subject}&body=${body}`;
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#ffffff",
  };

  return (
    <section
      id="Contact"
      className="w-full py-20 px-6 md:px-12"
      style={{ background: "#0a0a0f" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left */}
        <div>
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{
              color: "#175aff",
              background: "rgba(23,90,255,0.12)",
              border: "1px solid rgba(23,90,255,0.3)",
            }}
          >
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Let's Build the Future of{" "}
            <span style={{ color: "#175aff" }}>Delivery Together</span>
          </h2>
          <p className="text-lg mb-8" style={{ color: "#a0a0b0" }}>
            Have questions, partnership ideas, or feedback? We'd love to hear
            from you. Reach out and our team will get back to you promptly.
          </p>

          <div className="flex gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                aria-label={label}
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(23,90,255,0.15)",
                    color: "#175aff",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* Right — inline form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 md:p-8 space-y-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium text-white mb-2"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#175aff] transition"
              style={inputStyle}
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#175aff] transition"
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-white mb-2"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#175aff] transition resize-none"
              style={inputStyle}
              placeholder="How can we help?"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-bold py-3 rounded-full text-white"
            style={{
              background: "linear-gradient(135deg, #175aff, #4d7dff)",
              boxShadow: "0 0 24px rgba(23,90,255,0.3)",
            }}
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </section>
  );
}
