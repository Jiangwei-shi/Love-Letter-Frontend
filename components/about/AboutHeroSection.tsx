import { Box, Image, Stack, Text, Title } from '@mantine/core';
import { ARCHIVE, sans, serif } from '@/components/home/constants';

type Props = {
  heroImageSrc?: string | null;
  subtitle: string;
};

export default function AboutHeroSection({ heroImageSrc, subtitle }: Props) {
  return (
    <Box
      component="header"
      pos="relative"
      w="100%"
      mih={{ base: 420, md: 640, lg: 720 }}
      mah={870}
      mb={{ base: 48, md: 96 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <Box pos="absolute" inset={0} style={{ zIndex: 0 }}>
        {heroImageSrc ? (
          <Image
            src={heroImageSrc}
            alt=""
            h="100%"
            w="100%"
            fit="cover"
            style={{ opacity: 0.9, transform: 'scale(1.05)', objectPosition: 'center' }}
          />
        ) : (
          <Box
            h="100%"
            w="100%"
            className="about-hero-gradient-fallback"
            style={{
              background: `linear-gradient(135deg, ${ARCHIVE.primary}33, ${ARCHIVE.primaryContainer}55, ${ARCHIVE.secondaryContainer}44)`,
            }}
          />
        )}
        <Box
          pos="absolute"
          inset={0}
          style={{
            background: `linear-gradient(180deg, ${ARCHIVE.bg}33 0%, transparent 40%, ${ARCHIVE.bg} 100%)`,
          }}
        />
      </Box>
      <Stack pos="relative" style={{ zIndex: 1 }} ta="center" px={24} gap="md" maw={900}>
        <Title
          order={1}
          fw={300}
          style={{
            fontFamily: serif,
            letterSpacing: '-0.03em',
            color: ARCHIVE.onSurface,
            fontSize: 'clamp(2.25rem, 6vw, 5.25rem)',
            lineHeight: 1.05,
          }}
        >
          Two Souls,{' '}
          <Text span fs="italic" c={ARCHIVE.primary} inherit>
            One Archive.
          </Text>
        </Title>
        <Text
          maw={620}
          mx="auto"
          size="lg"
          fw={300}
          style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.65 }}
        >
          {subtitle}
        </Text>
      </Stack>
    </Box>
  );
}
