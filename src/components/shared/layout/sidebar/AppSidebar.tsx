import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { isAppNavLinkActive } from "@/config/app-shell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cx } from "class-variance-authority";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "src/assets/images/logo-4.png";

import { useAppNavLinks } from "../useAppNavLinks";

interface AppSidebarProps {
  onNavigate?: () => void;
}

export const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const router = useRouter();
  const links = useAppNavLinks();

  return (
    <div className="flex h-full flex-col bg-secondary-75 px-3 py-4">
      <div className="mb-6 flex items-center px-2">
        <Image src={logo} alt="Logo" width={56} height={56} />
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = isAppNavLinkActive(link.href, router.pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cx(
                "flex flex-row items-center gap-3 rounded-m px-3 py-2 no-underline!",
                isActive
                  ? "bg-secondary-200 text-primary-300 shadow-1"
                  : "text-neutral-400 hover:bg-secondary-100 hover:text-primary-300!",
              )}
            >
              <FontAwesomeIcon icon={link.icon} className="w-4" />
              <Typography size="body-paragraph-s" as="span">
                {link.label}
              </Typography>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
