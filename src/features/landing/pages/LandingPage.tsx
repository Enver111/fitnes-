import { useEffect } from "react";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import { AnimatedNav } from "../components/AnimatedNav";
import { AnimatedWaveFooter } from "../components/AnimatedWaveFooter";
import { CinematicHero } from "../components/CinematicHero";
import { landingNavItems } from "../config/nav";

export function LandingPage() {
  const { openAuth } = useAuthModal();

  useEffect(() => {
    document.documentElement.classList.add("landing-no-scrollbar");
    return () => {
      document.documentElement.classList.remove("landing-no-scrollbar");
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <AnimatedNav
        items={landingNavItems}
        onItemClick={(item) => {
          if (item.action === "login" || item.action === "register") {
            openAuth(item.action);
            return false;
          }
        }}
      />
      <CinematicHero
        onPrimaryCta={() => openAuth("login")}
        onSecondaryCta={() => openAuth("login")}
      />
      <AnimatedWaveFooter />
    </div>
  );
}
