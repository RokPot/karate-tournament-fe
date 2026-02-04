import Image from "next/image";
import { Link } from "@/components/ui/text/Link/Link";
import { useMemo } from "react";
import logo from "src/assets/images/logo-4.png";
import { ProfileMenu } from "./ProfileMenu";

interface NavbarLinkData {
  href: string;
  label: string;
}

const homeLink: NavbarLinkData = { href: "/", label: "Home" };
const tournamentsLink: NavbarLinkData = { href: "/tournaments", label: "Tournaments" };

export const Navbar = () => {
  const links = useMemo(() => [homeLink, tournamentsLink], []);

  return (
    <header className="z-20 flex h-[70px] items-center justify-between bg-secondary-400 shadow-1 dark:shadow-5 dm:py-1 dm:pl-4 t:px-4 t:py-[26px]">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src={logo} alt="Logo" width={60} height={60} />
      </div>

      {/* Main navigation links */}
      <div className="flex items-center justify-center gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="no-underline! hover:text-primary-400!"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <ProfileMenu />
    </header>  );
};
