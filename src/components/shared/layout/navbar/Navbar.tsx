import Image from "next/image";
import logo from "../../../../assets/images/logo-4.png";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { Link } from "@/components/ui/text/Link/Link";
import { useMemo } from "react";
import { AuthContext } from "@/data/auth/auth.context";
import { CommonModels } from "@/data/common/common.models";

interface NavbarLinkData {
  href: string;
  label: string;
}

const homeLink: NavbarLinkData = {
  href: "/",
  label: "Home",
}

const tournamentsLink: NavbarLinkData = {
  href: "/tournaments",
  label: "Tournaments",
}


export const Navbar = () => {
  const { user } = AuthContext.useAuth();

  const links = useMemo(() => {
    let userLinks = [];
    userLinks.push(homeLink);
    userLinks.push(tournamentsLink);
    return userLinks;
  }, [])

  return (
    <header className="z-20 flex h-[70px] items-center justify-between bg-secondary-400 shadow-1 dark:shadow-5 dm:py-1 dm:pl-4 t:px-4 t:py-[26px]" >
      <div className="flex items-center gap-2 jsutify-start">
        <Image src={logo} alt="Logo" width={60} height={60} className="" />
        <Typography size="body-paragraph-m" className="text-primary-500"></Typography>
      </div>

      <div className="flex items-center justify-center gap-2">
        {
          links.map((link) => (
            <Link key={link.href} href={link.href} className="no-underline! hover:text-primary-400!">{link.label}</Link>
          ))
        }
      </div>
    </header>
  );
};
