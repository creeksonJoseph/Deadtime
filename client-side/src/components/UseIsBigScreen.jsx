import { useState, useEffect } from "react";

export function useIsBigScreen() {
  const [isBig, setIsBig] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsBig(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isBig;
}
