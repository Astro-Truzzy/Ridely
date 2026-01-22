import { useState, useEffect, memo, useCallback } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when the user scrolls down 300px
  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Scroll to the top of the page
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Add scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <div className="fixed bottom-10 right-10 z-[9999]">
      {isVisible && (
        <button
          onClick={scrollToTop}
          title="Scroll to top"
          className="p-3 bg-black/50 text-white hover:text-white rounded-full shadow-md hover:bg-black/5 transition-all duration-300
          dark:bg-white/75 dark:text-black text-[20px]"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;
