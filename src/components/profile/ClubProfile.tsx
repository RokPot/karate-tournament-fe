'use client';

import { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image, { StaticImageData } from 'next/image';

import defaultLogo from 'src/assets/images/ClubLogo.png';

interface Club {
  name: string;
  founded: string;
  type: string;
  logo: StaticImageData;
}

export const ClubProfile: React.FC = () => {
  const [club] = useState<Club>({
    name: 'Karate Roki Poki',
    founded: '1996',
    type: 'Slovenia KZS',
    logo: defaultLogo,
  });

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={club.logo}
          alt="Club Logo"
          width={110}
          height={110}
        />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          {club.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Founded: {club.founded}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {club.type}
        </Typography>
      </Box>
    </Card>
  );
};
