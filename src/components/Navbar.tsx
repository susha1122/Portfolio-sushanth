import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

// Smoother replacement using Lenis — API compatible with original ScrollSmoother usage
export const smoother = {
  _paused: true,
  scrollTop: (val?: number) => {
    if (val !== undefined) {
      window.scrollTo({ top: val });
    }
    return lenisInstance?.scroll ?? window.scrollY;
  },
  paused: (val?: boolean) => {
    if (val !== undefined) {
      smoother._paused = val;
      if (val) {
        lenisInstance?.stop();
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.body.style.overflowX = "hidden";
        lenisInstance?.start();
      }
    }
    return smoother._paused;
  },
  scrollTo: (target: string, smooth?: boolean, _position?: string) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        immediate: !smooth,
        offset: 0,
      });
    }
  },
};

const Navbar = () => {
  useEffect(() => {
    // Create Lenis smooth scroll instance (window-based)
    lenisInstance = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      autoResize: true,
    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for Lenis animation loop
    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section) {
            smoother.scrollTo(section, true, "top top");
          }
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });

    return () => {
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          Sushanth.dev
        </a>
        <a
          href="mailto:sushanth.athakur@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          sushanth.athakur@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

