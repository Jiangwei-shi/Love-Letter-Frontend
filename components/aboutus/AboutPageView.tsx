import { Box, Stack } from '@mantine/core';
import type { CoupleProfile } from '@/lib/types/mvp';
import AboutHeroSection from '@/aboutus/AboutHeroSection';
import AboutProfilesSection from '@/aboutus/AboutProfilesSection';
import AboutSentimentsGrid from '@/aboutus/AboutSentimentsGrid';
import AboutStorySection from '@/aboutus/AboutStorySection';
import SiteFooter from '@/shell/SiteFooter';
import { ARCHIVE } from '@/homepage/constants';

/** Hero banner; asset at `public/aboutUs.jpg`. */
const ABOUT_HERO_IMAGE = '/aboutUs.jpg';

type AboutPageViewProps = {
  profile: CoupleProfile;
};

function splitParagraphs(text: string): string[] {
  return text
    .trim()
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function AboutPageView({ profile }: AboutPageViewProps) {
  const boyName = profile.boy_name || '男生';
  const girlName = profile.girl_name || '女生';
  const anniversary =
    profile.anniversary_date ||
    '还在等待你们写下纪念日';
  const aboutText =
    profile.about_text ||
    '故事还在继续，等你们慢慢把每一个温柔的日子写进这里。';
  const boyMessage =
    profile.boy_message_for_girl ||
    '想对你说的话，会一直认真地放在心里。';
  const girlMessage =
    profile.girl_message_for_boy ||
    '谢谢你出现在我的生活里，也谢谢你一直在。';

  const paras = splitParagraphs(aboutText);
  const firstParagraph = paras[0] ?? aboutText;
  let middleParagraphs: string[] = [];
  let pullQuote: string | undefined;
  if (paras.length === 2) {
    pullQuote = paras[1];
  } else if (paras.length > 2) {
    middleParagraphs = paras.slice(1, -1);
    pullQuote = paras[paras.length - 1];
  }

  const heroSubtitle =
    firstParagraph.length > 220
      ? `${firstParagraph.slice(0, 160).trim()}…`
      : firstParagraph;

  const anniversaryLine =
    profile.anniversary_date
      ? `从 ${anniversary} 起，并肩走过与被写下的每一天，都值得珍藏。`
      : '愿我们并肩向着阳光，慢慢生长。';

  const closingLine =
    paras.length > 0
      ? paras[paras.length - 1]
      : '谢谢你走进我们的小世界。';

  return (
    <Box style={{ background: ARCHIVE.bg }}>
      <AboutHeroSection heroImageSrc={ABOUT_HERO_IMAGE} subtitle={heroSubtitle} />

      <AboutProfilesSection
        girlName={girlName}
        boyName={boyName}
        girlAvatar={profile.girl_avatar}
        boyAvatar={profile.boy_avatar}
        aboutHerText={girlMessage}
        aboutHimText={boyMessage}
      />

      <AboutStorySection
        firstParagraph={firstParagraph}
        middleParagraphs={middleParagraphs}
        pullQuote={pullQuote}
      />

      <Stack gap={0}>
        <AboutSentimentsGrid
          girlName={girlName}
          boyName={boyName}
          girlMessage={girlMessage}
          boyMessage={boyMessage}
          anniversaryLine={anniversaryLine}
          closingLine={closingLine}
        />
        <SiteFooter />
      </Stack>
    </Box>
  );
}
