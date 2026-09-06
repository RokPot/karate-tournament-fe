import { Link } from "@/components/ui/text/Link/Link";
import { RouteConfig } from "@/config/route.config";
import { AuthContext } from "@/data/auth/auth.context";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { cx } from "class-variance-authority";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "src/assets/images/logo-4.png";

interface NavbarProps {
  showLogo?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
}

export const Navbar = ({
  showLogo = false,
  showMenuButton = false,
  onMenuClick,
}: NavbarProps) => {
  const { t } = useTranslation();
  const { useLogout } = AuthContext.useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(menuAnchorEl);
  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <header
      className={cx(
        "z-20 flex h-[70px] items-center border-b border-primary-300 bg-primary-200 px-4 text-secondary-500 shadow-1 dark:border-secondary-300 dark:bg-secondary-400 dark:text-white dark:shadow-5",
      )}
    >
      {showMenuButton && (
        <div className="t:hidden">
          <IconButton
            aria-label={t("nav.openMenu")}
            onClick={onMenuClick}
          >
            <FontAwesomeIcon icon={faBars} className="text-tertiary-200" />
          </IconButton>
        </div>
      )}
      {showLogo && (
        <div className="flex items-center">
          <Image src={logo} alt="Logo" width={56} height={56} />
        </div>
      )}

      <div className="ml-auto">
        <Button
          type="button"
          aria-controls={isProfileMenuOpen ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isProfileMenuOpen ? "true" : undefined}
          onClick={handleProfileMenuOpen}
        >
          <FontAwesomeIcon
            size="lg"
            icon={faUser}
            style={{ color: "#B8963E" }}
          />
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
                "mt-2 w-40 rounded-m border border-primary-300 bg-primary-200 text-secondary-500 shadow-lg dark:border-secondary-300 dark:bg-secondary-500 dark:text-white",
            },
          }}
        >
          <MenuItem
            component={Link}
            href={RouteConfig.profile}
            onClick={handleProfileMenuClose}
            className="no-underline! hover:bg-primary-75 dark:hover:bg-secondary-400 hover:text-tertiary-300!"
          >
            {t("profile.title")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              useLogout.mutate();
            }}
            className="hover:bg-primary-75 dark:hover:bg-secondary-400 hover:text-tertiary-300!"
          >
            {t("profile.signOut")}
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};
