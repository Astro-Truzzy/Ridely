import React, { useEffect, useState } from "react";

const CookieNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("ridely_cookie_accepted");
    if (!accepted) {
      setTimeout(() => setIsVisible(true), 1000); 
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ridely_cookie_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-8 sm:right-8 bg-white border border-gray-200 shadow-lg p-4 rounded-xl z-50 animate-fade-in">
      <p className="text-sm text-gray-700">
        Ridely uses cookies to ensure you get the best experience. By using this
        site, you agree to our use of cookies.{" "}
        <a href="/privacy-policy" className="text-blue-600 underline">
          Learn more
        </a>
        .
      </p>
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleAccept}
          className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-md hover:bg-blue-700 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default CookieNotice;
