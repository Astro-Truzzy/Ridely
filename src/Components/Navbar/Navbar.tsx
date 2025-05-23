import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { MdHome, MdInfoOutline, MdArticle, MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";
import { FcFaq } from "react-icons/fc";
import { FaTimeline } from "react-icons/fa6";
import blacklogo from "../../assets/Images/black_logo-removebg-preview.png";
import useScrollDirection from "../../hooks/useScrollDirection";
const MenuLinks = [
  {
    id: 1,
    name: "Home",
    link: "#Home",
    icon: MdHome,
  },
  {
    id: 2,
    name: "Services",
    link: "#Services",
    icon: MdInfoOutline,
  },
  {
    id: 3,
    name: "Blogs",
    link: "#Blogs",
    icon: MdArticle,
  },
  {
    id: 4,
    name: "Contact",
    link: "#Contact",
    icon: MdOutlineConnectWithoutContact,
  },
];

const DropdownLinks = [
  {
    id: 1,
    name: "FAQs",
    link: "#FAQs",
    icon: FcFaq,
  },
  {
    id: 2,
    name: "Timeline",
    link: "#Timeline",
    icon: FaTimeline,
  },
  {
    id: 3,
    name: "Waitlist",
    link: "#Waitlist",
    icon: FaClipboardList,
  },
];

const Navbar = () => {
  const showNavbar = useScrollDirection();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-white z-50 shadow-md transition-transform duration-300 ease-in-out transform ${
        showNavbar || sidebarOpen ? "" : "-translate-y-full"
      }`}
    >
      <div className="py-4">
        <div className="container flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center px-3">
            <div className="h-16 w-38 flex items-center justify-center object-contain">
              <a href="#" className="block">
                <img
                  src={blacklogo}
                  alt="Ridely Logo"
                  className="w-[350px] logo"
                />
              </a>
            </div>
          </div>

          {/* Menu Links (Desktop) */}
          <div className="hidden lg:flex items-center">
            <ul className="flex items-center gap-4">
              {MenuLinks.map((data) => {
                const Icon = data.icon;
                return (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-flex items-center gap-1 px-4 font-semibold text-black hover:text-gray-500 duration-200"
                    >
                      <Icon className="text-xl" />
                      {data.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links Dropdown (Desktop) */}
          <div className="hidden lg:flex items-center px-3">
            <div className="relative group">
              <a
                href="#"
                className="flex items-center gap-2 font-semibold text-black py-2 hover:text-gray-500"
              >
                Quick Links
                <FaCaretDown className="group-hover:rotate-180 duration-300" />
              </a>
              <div className="absolute right-0 z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white shadow-md p-2 text-[#175AFF]">
                <ul className="space-y-2">
                  {DropdownLinks.map((data) => (
                    <li key={data.id}>
                      <a
                        className="flex items-center gap-2 w-full p-2 rounded-md font-semibold hover:bg-[#175AFF]/10 hover:text-[#175AFF] duration-200"
                        href={data.link}
                      >
                        {data.icon && <data.icon className="text-xl" />}
                        {data.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden px-3">
            <button
              onClick={toggleSidebar}
              className="p-2"
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? (
                <HiX className="w-6 h-6 text-black" />
              ) : (
                <HiOutlineMenu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={toggleSidebar}
          ></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-[#175AFF] shadow-lg p-6 transform transition-transform ease-out duration-500">
            <button
              onClick={toggleSidebar}
              className="mb-4"
              aria-label="Close Sidebar"
            >
              <HiX className="w-6 h-6 text-white" />
            </button>
            <ul>
              {MenuLinks.map((data) => {
                const Icon = data.icon;
                return (
                  <li key={data.id} className="mb-4">
                    <a
                      href={data.link}
                      className="flex items-center gap-2 px-4 py-2 font-semibold text-white hover:text-gray-300 duration-200"
                      onClick={toggleSidebar}
                    >
                      <Icon className="text-xl" />
                      {data.name}
                    </a>
                  </li>
                );
              })}
              <li className="mt-4">
                <div className="font-semibold text-white mb-2">Quick Links</div>
                <ul className="ml-4">
                  {DropdownLinks.map((data) => (
                    <li key={data.id} className="mb-2">
                      <a
                        href={data.link}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white hover:text-gray-300 duration-200"
                        onClick={toggleSidebar}
                      >
                        {data.icon && <data.icon className="text-xl" />}
                        {data.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
