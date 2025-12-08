import { Button, Input, TextField } from "@mui/material";

import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <div>
        <Button>Click me</Button>
        <TextField placeholder="Enter your name" variant="outlined" label="Name" />
      </div>
    </AuthGuard>
  );
}
