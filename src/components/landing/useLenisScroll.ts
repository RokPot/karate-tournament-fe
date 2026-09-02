import Lenis from "lenis";
import { useEffect } from "react";

import "lenis/dist/lenis.css";

export const useLenisScroll = () => {
  useEffect(() => {
    const wrapper = document.getElementById("scroll-container");
    if (!wrapper) {
      return () => undefined;
    }

    const content = document.getElementById("landing-scroll-content") ?? wrapper;

    const lenis = new Lenis({
      wrapper,
      content,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);
};
