import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ridelyLogo from "../../assets/brand";
import {
  ChevronRight,
  Package,
  Bike,
  Building2,
  ClipboardList,
  MapPin,
  Mail,
  HelpCircle,
  BookOpen,
} from "lucide-react";

type MenuTab = "services" | "partner" | "company" | "support";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LinkItem {
  label: string;
  href: string;
  bold?: boolean;
}

interface LinkColumn {
  heading: string;
  links: LinkItem[];
}

interface SidebarCta {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  href: string;
}

const TABS: { id: MenuTab; label: string; shortLabel?: string }[] = [
  { id: "services", label: "Services" },
  { id: "partner", label: "Partner with Ridely", shortLabel: "Partner" },
  { id: "company", label: "Company" },
  { id: "support", label: "Support" },
];

const MENU_CONTENT: Record<MenuTab, LinkColumn[]> = {
  services: [
    {
      heading: "Delivery",
      links: [
        { label: "Express delivery", href: "#Services", bold: true },
        { label: "Same-day delivery", href: "#Services" },
        { label: "Doorstep delivery", href: "#Services" },
        { label: "Bulk delivery", href: "#Services" },
      ],
    },
    {
      heading: "Tracking",
      links: [
        { label: "Real-time tracking", href: "#Services", bold: true },
        { label: "Live GPS updates", href: "#Services" },
        { label: "Delivery notifications", href: "#Services" },
        { label: "Order history", href: "#Services" },
      ],
    },
    {
      heading: "Payments",
      links: [
        { label: "Flexible payments", href: "#Services", bold: true },
        { label: "Cards & mobile money", href: "#Services" },
        { label: "Cash on delivery", href: "#Services" },
        { label: "Business billing", href: "#Services" },
      ],
    },
    {
      heading: "Safety",
      links: [
        { label: "Package insurance", href: "#Services", bold: true },
        { label: "Verified riders", href: "#Services" },
        { label: "Secure handling", href: "#Services" },
        { label: "Report an issue", href: "#Contact" },
      ],
    },
  ],
  partner: [
    {
      heading: "Riders",
      links: [
        { label: "Become a rider", href: "#Waitlist", bold: true },
        { label: "How to join", href: "#Process" },
        { label: "Rider benefits", href: "#Waitlist" },
        { label: "Safety guidelines", href: "#FAQs" },
      ],
    },
    {
      heading: "Business",
      links: [
        { label: "Ridely for Business", href: "#Services", bold: true },
        { label: "Bulk delivery", href: "#Services" },
        { label: "Merchant onboarding", href: "#Waitlist" },
        { label: "Partnership inquiry", href: "#Contact" },
      ],
    },
    {
      heading: "Fleet",
      links: [
        { label: "Fleet owners", href: "#Waitlist", bold: true },
        { label: "Fleet management", href: "#Waitlist" },
        { label: "Insurance partners", href: "#Contact" },
        { label: "Partner FAQ", href: "#FAQs" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "How it works", href: "#Process", bold: true },
        { label: "Join waitlist", href: "#Waitlist" },
        { label: "Contact partnerships", href: "#Contact" },
        { label: "Support", href: "#Contact" },
      ],
    },
  ],
  company: [
    {
      heading: "About",
      links: [
        { label: "Our story", href: "#Home", bold: true },
        { label: "Mission", href: "#Home" },
        { label: "Timeline", href: "#Timeline" },
        { label: "How it works", href: "#Process" },
      ],
    },
    {
      heading: "News",
      links: [
        { label: "Blog", href: "#Blogs", bold: true },
        { label: "Product updates", href: "#Blogs" },
        { label: "Press", href: "#Contact" },
        { label: "Announcements", href: "#Blogs" },
      ],
    },
    {
      heading: "Community",
      links: [
        { label: "Testimonials", href: "#Home", bold: true },
        { label: "Coverage map", href: "#Home" },
        { label: "Cities", href: "#Home" },
        { label: "Join waitlist", href: "#Waitlist" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy-policy", bold: true },
        { label: "Terms of service", href: "/privacy-policy" },
        { label: "Cookie policy", href: "/privacy-policy" },
        { label: "Contact", href: "#Contact" },
      ],
    },
  ],
  support: [
    {
      heading: "Help centre",
      links: [
        { label: "FAQ", href: "#FAQs", bold: true },
        { label: "How it works", href: "#Process" },
        { label: "Track a package", href: "#Services" },
        { label: "Report an issue", href: "#Contact" },
      ],
    },
    {
      heading: "Account",
      links: [
        { label: "Join waitlist", href: "#Waitlist", bold: true },
        { label: "Sign up", href: "#Waitlist" },
        { label: "Rider onboarding", href: "#Waitlist" },
        { label: "Business accounts", href: "#Contact" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "Contact us", href: "#Contact", bold: true },
        { label: "Partnership support", href: "#Contact" },
        { label: "Press inquiries", href: "#Contact" },
        { label: "General help", href: "#FAQs" },
      ],
    },
    {
      heading: "Guides",
      links: [
        { label: "Delivery guide", href: "#Process", bold: true },
        { label: "Payment options", href: "#Services" },
        { label: "Insurance info", href: "#Services" },
        { label: "Safety tips", href: "#FAQs" },
      ],
    },
  ],
};

const SIDEBAR_CTAS: SidebarCta[] = [
  {
    icon: <Bike className="w-4 h-4" />,
    iconBg: "bg-violet-500/15 text-violet-400",
    title: "Become a rider",
    description: "Earn on your own schedule",
    href: "#Waitlist",
  },
  {
    icon: <ClipboardList className="w-4 h-4" />,
    iconBg: "bg-[#175aff]/15 text-[#4d7dff]",
    title: "Join the waitlist",
    description: "Be first to experience Ridely",
    href: "#Waitlist",
  },
  {
    icon: <Building2 className="w-4 h-4" />,
    iconBg: "bg-emerald-500/15 text-emerald-400",
    title: "Ridely for Business",
    description: "Scale your deliveries effortlessly",
    href: "#Services",
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    iconBg: "bg-amber-500/15 text-amber-400",
    title: "Track a package",
    description: "Real-time GPS updates",
    href: "#Services",
  },
  {
    icon: <Mail className="w-4 h-4" />,
    iconBg: "bg-sky-500/15 text-sky-400",
    title: "Contact support",
    description: "We're here to help",
    href: "#Contact",
  },
];

const TAB_ICONS: Record<MenuTab, React.ReactNode> = {
  services: <Package className="w-3.5 h-3.5" />,
  partner: <Bike className="w-3.5 h-3.5" />,
  company: <BookOpen className="w-3.5 h-3.5" />,
  support: <HelpCircle className="w-3.5 h-3.5" />,
};

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const [activeTab, setActiveTab] = useState<MenuTab>("services");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0a0a0f]/98 backdrop-blur-xl overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="border-b border-white/[0.06]">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 flex items-center justify-between py-4">
              <a
                href="#Home"
                onClick={handleLinkClick}
                className="flex items-center shrink-0"
              >
                <img
                  src={ridelyLogo}
                  alt="Ridely"
                  className="h-14 sm:h-16 w-auto"
                />
              </a>

              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href="#Contact"
                  onClick={handleLinkClick}
                  className="hidden sm:block text-sm font-medium text-[#a0a0b0] hover:text-white transition-colors"
                >
                  Support
                </a>
                <a
                  href="#Waitlist"
                  onClick={handleLinkClick}
                  className="gradient-blue px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap"
                >
                  Join Waitlist
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full text-[#a0a0b0] hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Contained menu panels */}
          <div className="max-w-5xl mx-auto px-5 sm:px-6 py-5 sm:py-6">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Left panel — tabs + link grid */}
              <motion.div
                className="flex-1 min-w-0 bg-[#111118] border border-white/[0.08] rounded-2xl p-4 sm:p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                {/* Tab bar */}
                <div className="flex flex-wrap gap-1 mb-5">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-[#a0a0b0] hover:text-white"
                      }`}
                    >
                      {TAB_ICONS[tab.id]}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">
                        {tab.shortLabel ?? tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Link columns */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {MENU_CONTENT[activeTab].map((column) => (
                      <div key={column.heading}>
                        <ul className="space-y-2">
                          {column.links.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.href}
                                onClick={handleLinkClick}
                                className={`block text-[13px] leading-snug transition-colors hover:text-[#4d7dff] ${
                                  link.bold
                                    ? "font-semibold text-white"
                                    : "text-[#a0a0b0] font-normal"
                                }`}
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Right sidebar — CTAs */}
              <motion.div
                className="lg:w-64 xl:w-72 shrink-0 bg-[#111118] border border-white/[0.08] rounded-2xl p-3 sm:p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                <ul className="space-y-0.5">
                  {SIDEBAR_CTAS.map((cta) => (
                    <li key={cta.title}>
                      <a
                        href={cta.href}
                        onClick={handleLinkClick}
                        className="group flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                      >
                        <span
                          className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${cta.iconBg}`}
                        >
                          {cta.icon}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-semibold text-white leading-tight">
                            {cta.title}
                          </span>
                          <span className="block text-[11px] text-[#a0a0b0] mt-0.5 leading-snug line-clamp-2">
                            {cta.description}
                          </span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#a0a0b0]/60 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
