
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ClubProfile } from "@/components/profile/ClubProfile";
import { UserProfile } from "@/components/profile/UserProfile";

const ProfilePage = () => {
  return (
  <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md:3, lg: 3 }}>
        <ClubProfile/>
      </Grid>

      <Grid size={{ xs: 12, md:9,lg: 9 }}>
        <UserProfile/>
      </Grid>
    </Grid>
  </Box>
  )
};
export default ProfilePage;
