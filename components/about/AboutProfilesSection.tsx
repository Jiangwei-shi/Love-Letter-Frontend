import { Box, Image, Stack, Text, Title } from '@mantine/core';
import { ARCHIVE, sans, serif } from '@/components/home/constants';

type Props = {
  girlName: string;
  boyName: string;
  girlAvatar?: string | null;
  boyAvatar?: string | null;
  aboutHerText: string;
  aboutHimText: string;
};

function ProfileOrb({
  primary,
  src,
  placeholder,
}: {
  primary: boolean;
  src?: string | null;
  placeholder: string;
}) {
  const size = { base: 256, md: 320 };

  return (
    <Box pos="relative" w={size} mx="auto" className="about-profile-photo-wrap">
      <Box className={primary ? 'about-profile-glow about-profile-glow--primary' : 'about-profile-glow about-profile-glow--secondary'} />
      {src ? (
        <Box pos="relative" style={{ zIndex: 1 }} w={size} h={size}>
          <Image
            src={src}
            alt=""
            w={size}
            h={size}
            radius="50%"
            fit="cover"
            style={{
              border: `4px solid ${ARCHIVE.surfaceContainerLowest}`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
            }}
          />
        </Box>
      ) : (
        <Box
          pos="relative"
          w={size}
          h={size}
          style={{
            zIndex: 1,
            borderRadius: '50%',
            border: `4px solid ${ARCHIVE.surfaceContainerLowest}`,
            boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
            background: ARCHIVE.surfaceContainerHigh,
            display: 'grid',
            placeItems: 'center',
            color: ARCHIVE.onSurfaceVariant,
            fontFamily: sans,
            fontSize: 14,
          }}
        >
          {placeholder}
        </Box>
      )}
    </Box>
  );
}

export default function AboutProfilesSection({
  girlName,
  boyName,
  girlAvatar,
  boyAvatar,
  aboutHerText,
  aboutHimText,
}: Props) {
  return (
    <Box component="section" maw={1280} mx="auto" px={{ base: 24, md: 32 }} mb={{ base: 48, md: 128 }}>
      <Box className="about-profiles-grid">
        {/* Her — left on desktop */}
        <Stack gap={32} align="center" className="about-profile-her" mt={{ md: 48 }}>
          <ProfileOrb primary src={girlAvatar} placeholder="她的照片" />
          <Stack gap="sm" maw={440} ta={{ base: 'center', md: 'left' }} className="about-profile-text about-profile-text--her">
            <Text
              tt="uppercase"
              fz="xs"
              fw={600}
              style={{ letterSpacing: '0.2em', fontFamily: sans, color: ARCHIVE.primary }}
            >
              The Visionary
            </Text>
            <Title order={2} style={{ fontFamily: serif, fontWeight: 400, color: ARCHIVE.onSurface }}>
              About {girlName}
            </Title>
            <Text
              fs="italic"
              fw={300}
              style={{ fontFamily: serif, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.75 }}
            >
              &ldquo;{aboutHerText}&rdquo;
            </Text>
          </Stack>
        </Stack>

        {/* Him — right on desktop, lower */}
        <Stack gap={32} align="center" className="about-profile-him" mt={{ md: 128 }}>
          <ProfileOrb primary={false} src={boyAvatar} placeholder="他的照片" />
          <Stack gap="sm" maw={440} ta={{ base: 'center', md: 'right' }} className="about-profile-text about-profile-text--him">
            <Text
              tt="uppercase"
              fz="xs"
              fw={600}
              style={{ letterSpacing: '0.2em', fontFamily: sans, color: '#1c6392' }}
            >
              The Anchor
            </Text>
            <Title order={2} style={{ fontFamily: serif, fontWeight: 400, color: ARCHIVE.onSurface }}>
              About {boyName}
            </Title>
            <Text
              fs="italic"
              fw={300}
              style={{ fontFamily: serif, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.75 }}
            >
              &ldquo;{aboutHimText}&rdquo;
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
