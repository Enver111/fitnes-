import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useLocale } from "@/shared/i18n/LocaleContext";
import { Link2, Camera, Briefcase, MessageCircle } from "lucide-react";
import type { FormEvent } from "react";

export function AnimatedWaveFooter() {
  const { t } = useLocale();

  return (
    <footer className="relative bg-linear-to-b from-background to-primary/10 pt-20 pb-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 h-[500px] w-[3600px] animate-wave">
          <svg
            className="h-full w-full"
            viewBox="0 0 3600 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 250C200 150 400 50 600 100C800 150 1000 350 1200 300C1400 250 1600 150 1800 250C2000 150 2200 50 2400 100C2600 150 2800 350 3000 300C3200 250 3400 150 3600 250V500H0V250Z"
              fill="currentColor"
              className="text-primary/5"
            />
            <path
              d="M0 250C200 200 400 100 600 150C800 200 1000 350 1200 300C1400 250 1600 200 1800 250C2000 200 2200 100 2400 150C2600 200 2800 350 3000 300C3200 250 3400 200 3600 250V500H0V250Z"
              fill="currentColor"
              className="text-primary/10"
            />
          </svg>
        </div>
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-2xl font-bold">{t("footer.stayInTouch")}</h2>
            <form
              className="space-y-2"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="footer-email">Email</Label>
                <Input
                  id="footer-email"
                  placeholder={t("footer.emailPlaceholder")}
                  type="email"
                  className="backdrop-blur-xs"
                />
              </div>
              <Button type="submit" className="w-full">
                {t("footer.subscribe")}
              </Button>
            </form>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.navigation")}</h3>
            <nav className="space-y-2 text-sm">
              <a
                href="#home"
                className="block transition-colors hover:text-primary"
              >
                {t("footer.home")}
              </a>
              <a
                href="#about"
                className="block transition-colors hover:text-primary"
              >
                {t("footer.about")}
              </a>
              <a
                href="#blog"
                className="block transition-colors hover:text-primary"
              >
                {t("footer.blog")}
              </a>
              <a
                href="#login"
                className="block transition-colors hover:text-primary"
              >
                {t("footer.login")}
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.contacts")}</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>{t("footer.contactLine")}</p>
              <p>{t("footer.contactBeta")}</p>
              <p>Email: hello@fitnes.app</p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.social")}</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Link2 className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Camera className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Briefcase className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.rights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
