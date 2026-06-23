import { Link } from "@/components/ui/text/Link/Link";
import { RouteConfig } from "@/config/route.config";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBuilding, faEnvelope, faHome, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Menu, MenuItem } from "@mui/material";
import { cx } from "class-variance-authority";
import Image from "next/image";
import { useMemo, useState } from "react";
import logo from "src/assets/images/logo-4.png";

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
  href: RouteConfig.tournaments,
  label: "Tournaments",
  icon: faTrophy,
};

const clubsLink: NavbarLinkData = {
  href: RouteConfig.clubs,
  label: "Clubs",
  icon: faBuilding,
};

const invitationsLink: NavbarLinkData = {
  href: RouteConfig.invitations,
  label: "Invitations",
  icon: faEnvelope,
};

const categoriesLink: NavbarLinkData = {
  href: RouteConfig.categories,
  label: "Categories",
};

const profileLinks: NavbarLinkData[] = [
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/logout", label: "Logout" },
];

export const Navbar = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(menuAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const { isClubOwner, isAdmin } = useAuthRoles();
  const links = useMemo(() => {
    const userLinks = [];
    if (isAdmin) {
      userLinks.push(homeLink);
      userLinks.push(clubsLink);
      userLinks.push(invitationsLink);
      userLinks.push(categoriesLink);
      userLinks.push(tournamentsLink);
      return userLinks;
    }
    if (isClubOwner) {
      userLinks.push(homeLink);
      userLinks.push(categoriesLink);
      return userLinks;
    }
    return [];
  }, [isAdmin, isClubOwner]);



  return (
    <header
      className={cx(
        "z-20 flex h-[70px] items-center border-b border-primary-300 bg-primary-200 text-secondary-500 shadow-1 dark:border-secondary-300 dark:bg-secondary-400 dark:text-white dark:shadow-5",
        "md:px-10 lg:px-20"
      )}
    >

      <div className="flex items-center gap-2 justify-start">
        <Image src={logo} alt="Logo" width={60} height={60} />
      </div>

      <div className="flex items-center justify-start gap-2 ml-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-row items-center font-weight-500 justify-center no-underline! hover:text-tertiary-300! text-tertiary-200!"
          >
            {link.label}
          </Link>
        ))}
      </div>



      <div>
        <Button
          type="button"
          aria-controls={isProfileMenuOpen ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isProfileMenuOpen ? "true" : undefined}
          onClick={handleProfileMenuOpen}
        >
          <FontAwesomeIcon size="lg" icon={faUser} style={{ color: "#B8963E" }} />
        </Button>

        <Menu
          id="profile-menu"
          anchorEl={menuAnchorEl}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              className:
                "mt-2 w-40 rounded-md border border-primary-300 bg-primary-200 text-secondary-500 shadow-lg dark:border-secondary-300 dark:bg-secondary-500 dark:text-white",
            },
          }}
        >
          {profileLinks.map((link) => (
            <MenuItem
              key={link.href}
              component={Link}
              href={link.href}
              onClick={handleProfileMenuClose}
              className="no-underline! hover:bg-primary-75 dark:hover:bg-secondary-400 hover:text-tertiary-300!"
            >
              {link.label}
            </MenuItem>
          ))}
        </Menu>
      </div>

    </header>
  );
};
