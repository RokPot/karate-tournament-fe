import Image from "next/image";
import { Link } from "@/components/ui/text/Link/Link";
import { useMemo, useState, useRef, useEffect } from "react";
import logo from "src/assets/images/logo-4.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEnvelope, faHome, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface NavbarLinkData {
  href: string;
  label: string;
  icon?: IconProp;
}

const homeLink: NavbarLinkData = {
  href: "/",
  label: "Home",
  icon: faHome,
};

const tournamentsLink: NavbarLinkData = {
  href: "/tournaments",
  label: "Tournaments",
  icon: faTrophy,
};

const clubsLink: NavbarLinkData = {
  href: "/clubs",
  label: "Clubs",
  icon: faBuilding,
};

const invitationsLink: NavbarLinkData = {
  href: "/invitations",
  label: "Invitations",
  icon: faEnvelope,
};

const profileLinks: NavbarLinkData[] = [
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/logout", label: "Logout" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isClubOwner, isAdmin } = useAuthRoles();
  const links = useMemo(() => {
    const userLinks = [];
    if (isAdmin) {
      userLinks.push(homeLink);
      userLinks.push(clubsLink);
      userLinks.push(invitationsLink);
      userLinks.push(tournamentsLink);
      return userLinks;
    }
    if (isClubOwner) {
      userLinks.push(homeLink);
      return userLinks;
    }
    return [];
  }, [isAdmin, isClubOwner]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="z-20 flex h-[70px] items-center  bg-secondary-400 shadow-1 dark:shadow-5 dm:py-1 dm:pl-4 t:px-4 t:py-[26px]">

      <div className="flex items-center gap-2 jsutify-start">
        <Image src={logo} alt="Logo" width={60} height={60} />
      </div>

      <div className="flex items-center justify-start gap-2 ml-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="no-underline! hover:text-primary-400! flex flex-row items-center justify-center"
          >
            {link.icon && <FontAwesomeIcon icon={link.icon} />}
            {link.label}
          </Link>
        ))}
      </div>



      <div className="relative ml-auto" ref={dropdownRef}>
        <button type="button" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon size="lg" icon={faUser} style={{ color: "#edc000", }} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-secondary-500 shadow-lg rounded-md  hover:text-primary-400!">
            {profileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 hover:bg-secondary-300 no-underline!"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

    </header>
  );
};
