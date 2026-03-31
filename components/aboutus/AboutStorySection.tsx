import { Box, Stack, Text, Title } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';
import { ARCHIVE, sans, serif } from '@/homepage/constants';

type Props = {
  firstParagraph: string;
  middleParagraphs: string[];
  pullQuote?: string;
};

export default function AboutStorySection({ firstParagraph, middleParagraphs, pullQuote }: Props) {
  return (
    <Box component="section" py={{ base: 48, md: 128 }} style={{ background: ARCHIVE.surfaceContainerLow }} className="about-story-section">
      <Box maw={896} mx="auto" px={{ base: 24, md: 32 }}>
        <Stack align="center" gap="md" mb={48}>
          <IconSparkles size={36} color={ARCHIVE.primary} style={{ opacity: 0.45 }} />
          <Title order={2} fw={300} style={{ fontFamily: serif, color: ARCHIVE.onSurface, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Our Story
          </Title>
        </Stack>

        <Stack gap={48}>
          <Text
            component="p"
            fw={300}
            fz={{ base: 'lg', md: 'xl' }}
            style={{
              fontFamily: sans,
              color: `${ARCHIVE.onSurface}cc`,
              lineHeight: 1.85,
            }}
            className="about-story-dropcap"
          >
            {firstParagraph}
          </Text>

          {middleParagraphs.map((p, i) => (
            <Text
              key={`story-mid-${i}`}
              component="p"
              fw={300}
              fz={{ base: 'lg', md: 'xl' }}
              style={{
                fontFamily: sans,
                color: `${ARCHIVE.onSurface}cc`,
                lineHeight: 1.85,
              }}
            >
              {p}
            </Text>
          ))}

          {pullQuote ? (
            <Box pos="relative" py={16}>
              <Box
                pos="absolute"
                left={0}
                top="50%"
                w={48}
                h={1}
                style={{ background: ARCHIVE.outlineVariant, transform: 'translateY(-50%)' }}
              />
              <Text
                pl={{ base: 56, sm: 64 }}
                fs="italic"
                fz="xl"
                style={{ fontFamily: serif, color: ARCHIVE.primary, lineHeight: 1.5 }}
              >
                &ldquo;{pullQuote}&rdquo;
              </Text>
            </Box>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
