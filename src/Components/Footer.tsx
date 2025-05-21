import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa"; 
import { motion } from "framer-motion"; 

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Company Information Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Ridely</h2>
            <p className="text-sm mb-2">19, Ewanbor str, Benin-city, Nigeria.</p>
            <p className="text-sm mb-2">Email: Ridely.inc@gmail.com</p>
            <p className="text-sm mb-2">Phone: +234 916 503 2925</p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a
                href="https://www.facebook.com/ridely"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaFacebook className="w-6 h-6 text-blue-500 hover:text-blue-600 transition" />
                </motion.div>
              </a>
              <a
                href="https://twitter.com/ridely"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter className="w-6 h-6 text-blue-400 hover:text-blue-500 transition" />
                </motion.div>
              </a>
              <a
                href="https://www.instagram.com/ridely"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaInstagram className="w-6 h-6 text-pink-500 hover:text-pink-600 transition" />
                </motion.div>
              </a>
              <a
                href="https://www.linkedin.com/company/ridely"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedin className="w-6 h-6 text-blue-700 hover:text-blue-800 transition" />
                </motion.div>
              </a>
              <a
                href="https://github.com/ridely"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub className="w-6 h-6 text-gray-500 hover:text-gray-600 transition" />
                </motion.div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>© 2025 Ridely. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
