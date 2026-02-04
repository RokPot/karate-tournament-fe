import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { Link } from "@/components/ui/text/Link/Link";

export const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const profileLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
    { href: "/logout", label: "Logout" },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Avatar
        onClick={handleClick}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          cursor: "pointer",
          bgcolor: "#edc000",
          width: 40,
          height: 40,
        }}
      >
        {/* Optional: initials or icon */}
        U
      </Avatar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
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
