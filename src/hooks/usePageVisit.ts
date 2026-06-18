import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageVisit } from "../Lib/visit";

export function usePageVisit() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    trackPageVisit(pathname);
  }, [pathname]);
}
