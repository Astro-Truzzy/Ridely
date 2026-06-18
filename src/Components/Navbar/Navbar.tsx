import { useState, useEffect } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import useScrollDirection from "../../hooks/useScrollDirection";
import MegaMenu from "./MegaMenu";
import ridelyLogo from "../../assets/brand";

const Navbar = () => {
  const showNavbar = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out transform ${
          showNavbar || menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: menuOpen
            ? "transparent"
            : scrolled
              ? "rgba(10, 10, 15, 0.85)"
              : "transparent",
          backdropFilter: menuOpen ? "none" : scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: menuOpen
            ? "none"
            : scrolled
              ? "blur(20px)"
              : "none",
          borderBottom: menuOpen
            ? "1px solid transparent"
            : scrolled
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid transparent",
        }}
      >
        <div className="container flex items-center justify-between py-3 sm:py-4 lg:py-5 px-4 lg:px-8">
          {/* Logo */}
          <a href="#Home" className="flex items-center shrink-0">
            <img
              src={ridelyLogo}
              alt="Ridely"
              className="h-7 sm:h-8 lg:h-10 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMenu}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[#a0a0b0] hover:text-white hover:bg-white/5 transition-colors"
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <HiOutlineMenu className="w-5 h-5" />
              Menu
            </button>

            <a
              href="#Contact"
              className="px-4 py-2 text-sm font-medium text-[#a0a0b0] hover:text-white transition-colors duration-200"
            >
              Support
            </a>

            <a
              href="#Waitlist"
              className="gradient-blue ml-1 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap"
            >
              Join Waitlist →
            </a>
          </nav>

          {/* Mobile: CTA + menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="#Waitlist"
              className="gradient-blue px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
            >
              Join Waitlist
            </a>
            <button
              onClick={toggleMenu}
              className="p-2 text-white"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <MegaMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
};

export default Navbar;
