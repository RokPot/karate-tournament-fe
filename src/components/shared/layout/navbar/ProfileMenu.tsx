import * as React from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from "@/components/ui/text/Link/Link";

export const ProfileMenu: React.FC = () => {
  // State for menu open/close
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Hard-coded menu links (black box)
  const profileLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
    { href: "/logout", label: "Logout" },
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        <FontAwesomeIcon size="lg" icon={faUser} style={{ color: "#edc000" }} />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {profileLinks.map((link) => (
          <MenuItem key={link.href} onClick={handleClose}>
            <Link href={link.href} className="w-full">
              {link.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
