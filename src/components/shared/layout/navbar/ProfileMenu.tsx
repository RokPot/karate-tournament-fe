import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { Link } from "@/components/ui/text/Link/Link";

export const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  interface NavbarLinkData {
    href: string;
    label: string;
  }
  const AvatarElements: NavbarLinkData []= [
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
          bgcolor: "#FBBF24;",
          width: 40,
          height: 40,
        }}
      >
        8=D
      </Avatar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {AvatarElements.map((el) => (
          <MenuItem key={el.href} onClick={handleClose}>
            <Link href={el.href} className="w-full">
              {el.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
