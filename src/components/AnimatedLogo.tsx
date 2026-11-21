import { Link } from "react-router-dom";
import logoImage from "@/assets/growww-logo-full.png";

/** Site logo - always sits flush left in the navbar. */
export const AnimatedLogo = () => (
  <Link to="/" aria-label="GrowWWW home" className="flex flex-shrink-0 items-center justify-start">
    <img
      src={logoImage}
      alt="GrowWWW"
      className="block h-16 w-auto object-contain object-left sm:h-[72px]"
      style={{ filter: "brightness(1.3) contrast(1.05)" }}
    />
  </Link>
);
