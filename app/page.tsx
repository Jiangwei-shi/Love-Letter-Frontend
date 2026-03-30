import Link from 'next/link';
import { Badge, Button, Card, Group, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { getCoupleProfile, getTimelineEvents, getPosts } from '@/lib/supabase/queries';

function calcDaysFrom(dateStr?: string | null) {
  if (!dateStr) return null;
  const start = new Date(dateStr);
  if (Number.isNaN(start.getTime())) return null;
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return dateStr;
}

export default async function HomePage() {
  const profile = await getCoupleProfile();

  const [events, posts] = await Promise.all([
    getTimelineEvents(),
    getPosts(),
  ]);

  const anniversaryDays = calcDaysFrom(profile?.anniversary_date ?? null);

  const recentTimeline = events.slice(-3).reverse();
  const recentPosts = posts.slice(0, 3);

  return (
    <section className="home-root">
      <section className="hero">
        <Card className="hero-main">
          <div className="hero-text">
            <Badge color="pink" variant="light">情侣纪念网站 · 我们的小宇宙</Badge>
            <Title order={1} className="hero-title">
              {profile?.boy_name ?? '我们'} 与 {profile?.girl_name ?? 'TA'}
            </Title>
            <Text className="hero-subtitle">
              {profile?.about_text
                ?? '从相遇到现在，每一个普通的日子，都因为有你而变得值得被记住。'}
            </Text>
            {profile?.anniversary_date && (
              <Text className="hero-meta">
                相恋始于 <span>{profile.anniversary_date}</span>
              </Text>
            )}
            <Group className="hero-actions">
              <Button component={Link} href="/timeline">
                查看我们的故事
              </Button>
              <Button component={Link} href="/posts" variant="light">
                查看生活记录
              </Button>
            </Group>
          </div>
          <div className="hero-photo">
            {profile?.boy_avatar ? (
              <Image
                src={profile.boy_avatar}
                alt="我们的合照"
                className="hero-photo-img"
                radius="lg"
              />
            ) : (
              <div className="hero-photo-placeholder">
                <span>这里以后可以放一张只属于我们的照片</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="hero-side">
          <Title order={3} className="card-title">关于我们</Title>
          <Text className="card-line">
            {profile?.boy_name ?? '我'} ❤️ {profile?.girl_name ?? '你'}
          </Text>
          {profile?.anniversary_date && (
            <Text className="card-line">
              纪念日：{formatDate(profile.anniversary_date)}
            </Text>
          )}
          <Text className="card-muted">
            {profile?.girl_message_for_boy ?? profile?.boy_message_for_girl
              ?? '这是一个只想慢慢装满的小角落，写给现在和未来的我们看。'}
          </Text>
        </Card>
      </section>

      <section className="home-section grid">
        <Card className="days-card">
          <Title order={3} className="card-title">我们已经在一起</Title>
          <Text className="days-number">
            {anniversaryDays !== null ? (
              <>
                <span>{anniversaryDays}</span> 天
              </>
            ) : (
              <span>还没设置纪念日</span>
            )}
          </Text>
          <Text className="card-muted">
            无论今天过得怎样，它都在悄悄累加成“我们”的一部分。
          </Text>
        </Card>

        <Card>
          <Title order={3} className="card-title">重要日子</Title>
          {profile?.anniversary_date ? (
            <>
              <Text className="card-line">
                初次相恋：{formatDate(profile.anniversary_date)}
              </Text>
              <Text className="card-muted">
                每一个纪念日，其实都是在提醒我们——那天之后，你就住进了我的生活里。
              </Text>
            </>
          ) : (
            <Text className="card-muted">
              还没有设置纪念日，但没有被写下的日子，也在悄悄变成我们的故事。
            </Text>
          )}
        </Card>
      </section>

      <section className="home-section">
        <Group className="section-header">
          <div>
            <Title order={2} className="section-title">最近发生的故事</Title>
            <Text className="section-subtitle">把重要的节点和日常的小碎片放在一起看。</Text>
          </div>
          <Group className="row-wrap">
            <Button component={Link} href="/timeline" variant="light">
              打开时间线
            </Button>
            <Button component={Link} href="/posts" variant="light">
              查看生活记录
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Card>
            <Title order={3} className="card-title">时间线上的脚印</Title>
            {recentTimeline.length === 0 && (
              <Text className="empty">
                时间线上还空空的，等第一段故事落笔，这里就会慢慢被填满。
              </Text>
            )}
            {recentTimeline.map((item) => (
              <div key={item.id} className="story-item">
                <Badge color="pink" variant="light">{item.event_date}</Badge>
                <Text fw={600} className="story-title">{item.title}</Text>
                {(item.boy_message || item.girl_message) && (
                  <Text className="story-text">{item.boy_message ?? item.girl_message}</Text>
                )}
                <Text className="story-meta">记录于时间线</Text>
              </div>
            ))}
            </Card>

            <Card>
            <Title order={3} className="card-title">生活里的小片段</Title>
            {recentPosts.length === 0 && (
              <Text className="empty">
                还没有写下哪怕一小段日常。没关系，从某一天的一个瞬间开始就好。
              </Text>
            )}
            {recentPosts.map((post) => (
              <Card key={post.id} component={Link} href={`/posts/${post.id}`} className="story-item story-link" withBorder>
                <Badge color="pink" variant="light">
                  {(post.record_time || '').replace('T', ' ').slice(0, 10)}
                </Badge>
                <Text fw={600} className="story-title">{post.title}</Text>
                <Text className="story-text">
                  {post.content.length > 60
                    ? `${post.content.slice(0, 60)}...`
                    : post.content}
                </Text>
                <Text className="story-meta">生活记录</Text>
              </Card>
            ))}
            </Card>
        </SimpleGrid>
      </section>

      <footer className="site-footer">
        <Text size="sm" c="dimmed">我们的故事仍在继续，愿以后翻开这里时，都会觉得今天也很值得被记住。</Text>
      </footer>
    </section>
  );
}
