/**
 * GSAP plugin registration — import this module ONCE, at app boot.
 * Any file that needs gsap or ScrollTrigger should import from here
 * so plugins are registered before use.
 *
 * NOTE: useGSAP is a React hook, NOT a GSAP plugin — do not pass it
 * to gsap.registerPlugin(). Import it directly from @gsap/react.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
