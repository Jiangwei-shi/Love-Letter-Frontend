import { Box, Paper, Stack, Text, Title } from '@mantine/core';
import { IconBook, IconDroplet, IconHeartFilled, IconLeaf } from '@tabler/icons-react';
import { ARCHIVE, sans, serif } from '@/homepage/constants';

type Props = {
  girlName: string;
  boyName: string;
  girlMessage: string;
  boyMessage: string;
  anniversaryLine: string;
  closingLine: string;
};

const cardHover = {
  transition: 'transform 0.3s ease',
};

export default function AboutSentimentsGrid({
  girlName,
  boyName,
  girlMessage,
  boyMessage,
  anniversaryLine,
  closingLine,
}: Props) {
  return (
    <Box component="section" maw={1280} mx="auto" px={{ base: 24, md: 32 }} py={{ base: 64, md: 128 }}>
      <Stack align="center" gap="md" mb={{ base: 48, md: 64 }}>
        <Title
          order={2}
          fw={300}
          ta="center"
          style={{ fontFamily: serif, color: ARCHIVE.onSurface, fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          To Each Other
        </Title>
        <Box
          h={4}
          w={96}
          mx="auto"
          style={{ background: ARCHIVE.primaryContainer, borderRadius: 999 }}
        />
      </Stack>

      <Box className="about-sentiments-bento">
        <Box className="about-sentiments-bento__a">
          <Paper
            p={{ base: 28, md: 40 }}
            radius="md"
            style={{
              background: ARCHIVE.surfaceContainerLowest,
              boxShadow: ARCHIVE.cardShadowSoft,
              ...cardHover,
            }}
            className="about-bento-card"
          >
            <IconHeartFilled size={28} color={ARCHIVE.primary} style={{ marginBottom: 20 }} />
            <Text
              fs="italic"
              fz={{ base: 'lg', md: 'xl' }}
              style={{ fontFamily: serif, color: ARCHIVE.onSurface, lineHeight: 1.65, marginBottom: 24 }}
            >
              &ldquo;{girlMessage}&rdquo;
            </Text>
            <Text
              tt="uppercase"
              fz="xs"
              c="dimmed"
              style={{ letterSpacing: '0.16em', fontFamily: sans }}
            >
              — {girlName}
            </Text>
          </Paper>
        </Box>

        <Box className="about-sentiments-bento__b">
          <Paper
            p={{ base: 28, md: 40 }}
            radius="md"
            style={{
              background: 'rgba(142, 202, 255, 0.12)',
              border: `1px solid rgba(28, 99, 146, 0.12)`,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ...cardHover,
            }}
            className="about-bento-card"
          >
            <IconDroplet size={28} color="#1c6392" style={{ marginBottom: 20 }} />
            <Text
              fs="italic"
              fz="md"
              style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.75, marginBottom: 24 }}
            >
              &ldquo;{boyMessage}&rdquo;
            </Text>
            <Text
              tt="uppercase"
              fz="xs"
              c="dimmed"
              style={{ letterSpacing: '0.16em', fontFamily: sans }}
            >
              — {boyName}
            </Text>
          </Paper>
        </Box>

        <Box className="about-sentiments-bento__c">
          <Paper
            p={{ base: 28, md: 40 }}
            radius="md"
            style={{
              background: 'rgba(97, 194, 135, 0.12)',
              border: `1px solid rgba(0, 109, 62, 0.12)`,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ...cardHover,
            }}
            className="about-bento-card"
          >
            <IconLeaf size={28} color={ARCHIVE.tertiary} style={{ marginBottom: 20 }} />
            <Text
              fs="italic"
              fz="md"
              style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.75, marginBottom: 24 }}
            >
              &ldquo;{anniversaryLine}&rdquo;
            </Text>
            <Text
              tt="uppercase"
              fz="xs"
              c="dimmed"
              style={{ letterSpacing: '0.16em', fontFamily: sans }}
            >
              — Both of Us
            </Text>
          </Paper>
        </Box>

        <Box className="about-sentiments-bento__d">
          <Paper
            p={{ base: 28, md: 40 }}
            radius="md"
            style={{
              background: ARCHIVE.surfaceContainerLowest,
              boxShadow: ARCHIVE.cardShadowSoft,
              ...cardHover,
            }}
            className="about-bento-card"
          >
            <IconBook size={28} color={ARCHIVE.primary} style={{ marginBottom: 20 }} />
            <Text
              fs="italic"
              fz={{ base: 'lg', md: 'xl' }}
              style={{ fontFamily: serif, color: ARCHIVE.onSurface, lineHeight: 1.65, marginBottom: 24 }}
            >
              &ldquo;{closingLine}&rdquo;
            </Text>
            <Text
              tt="uppercase"
              fz="xs"
              c="dimmed"
              style={{ letterSpacing: '0.16em', fontFamily: sans }}
            >
              — Forever
            </Text>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
