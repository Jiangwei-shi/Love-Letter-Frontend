import Link from 'next/link';
import { getSupabasePublicServerClient } from '@/lib/supabase/server';
import { getTimelineEvents, getPosts, getLatestPhotos } from '@/lib/supabase/queries';
import type { Profile } from '@/lib/types/mvp';

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
  const supabase = getSupabasePublicServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .maybeSingle<Profile>();

  const [events, posts, latestPhotos] = await Promise.all([
    getTimelineEvents(),
    getPosts(),
    getLatestPhotos(6),
  ]);

  const anniversaryDays = calcDaysFrom(profile?.anniversary_date ?? null);

  const recentTimeline = events.slice(-3).reverse();
  const recentPosts = posts.slice(0, 3);

  return (
    <section className="home-root">
      <section className="hero">
        <div className="hero-main card">
          <div className="hero-text">
            <p className="badge">情侣纪念网站 · 我们的小宇宙</p>
            <h1 className="hero-title">
              {profile?.nickname ?? '我们'} 与 {profile?.partner_nickname ?? 'TA'}
            </h1>
            <p className="hero-subtitle">
              {profile?.bio
                ?? '从相遇到现在，每一个普通的日子，都因为有你而变得值得被记住。'}
            </p>
            {profile?.anniversary_date && (
              <p className="hero-meta">
                相恋始于 <span>{profile.anniversary_date}</span>
              </p>
            )}
            <div className="hero-actions">
              <Link href="/timeline" className="btn">
                查看我们的故事
              </Link>
              <Link href="/albums" className="btn btn-soft">
                翻看相册
              </Link>
            </div>
          </div>
          <div className="hero-photo">
            {profile?.hero_image_url ? (
              <img
                src={profile.hero_image_url}
                alt="我们的合照"
                className="hero-photo-img"
              />
            ) : (
              <div className="hero-photo-placeholder">
                <span>这里以后可以放一张只属于我们的照片</span>
              </div>
            )}
          </div>
        </div>

        <div className="hero-side card">
          <h2 className="card-title">关于我们</h2>
          <p className="card-line">
            {profile?.nickname ?? '我'} ❤️ {profile?.partner_nickname ?? '你'}
          </p>
          {profile?.anniversary_date && (
            <p className="card-line">
              纪念日：{formatDate(profile.anniversary_date)}
            </p>
          )}
          <p className="card-muted">
            {profile?.intro
              ?? '这是一个只想慢慢装满的小角落，写给现在和未来的我们看。'}
          </p>
        </div>
      </section>

      <section className="home-section grid">
        <article className="card days-card">
          <h2 className="card-title">我们已经在一起</h2>
          <p className="days-number">
            {anniversaryDays !== null ? (
              <>
                <span>{anniversaryDays}</span> 天
              </>
            ) : (
              <span>还没设置纪念日</span>
            )}
          </p>
          <p className="card-muted">
            无论今天过得怎样，它都在悄悄累加成“我们”的一部分。
          </p>
        </article>

        <article className="card">
          <h2 className="card-title">重要日子</h2>
          {profile?.anniversary_date ? (
            <>
              <p className="card-line">
                初次相恋：{formatDate(profile.anniversary_date)}
              </p>
              <p className="card-muted">
                每一个纪念日，其实都是在提醒我们——那天之后，你就住进了我的生活里。
              </p>
            </>
          ) : (
            <p className="card-muted">
              还没有设置纪念日，但没有被写下的日子，也在悄悄变成我们的故事。
            </p>
          )}
        </article>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">最近的瞬间</h2>
            <p className="section-subtitle">从最近的照片里，偷看几眼我们的日常。</p>
          </div>
          <Link href="/albums" className="btn btn-soft">
            打开全部相册
          </Link>
        </div>
        {latestPhotos.length === 0 ? (
          <p className="empty">
            还没有上传照片。等有了第一张，我们的回忆墙就会慢慢亮起来。
          </p>
        ) : (
          <div className="recent-photos-grid">
            {latestPhotos.map((photo) => (
              <Link
                href={`/albums/${photo.album_id}`}
                key={photo.id}
                className="recent-photo-item"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption ?? '我们的照片'}
                  className="recent-photo-img"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">最近发生的故事</h2>
            <p className="section-subtitle">把重要的节点和日常的小碎片放在一起看。</p>
          </div>
          <div className="row-wrap">
            <Link href="/timeline" className="btn btn-soft">
              打开时间线
            </Link>
            <Link href="/posts" className="btn btn-soft">
              查看生活记录
            </Link>
          </div>
        </div>

        <div className="stories-grid">
          <article className="card">
            <h3 className="card-title">时间线上的脚印</h3>
            {recentTimeline.length === 0 && (
              <p className="empty">
                时间线上还空空的，等第一段故事落笔，这里就会慢慢被填满。
              </p>
            )}
            {recentTimeline.map((item) => (
              <div key={item.id} className="story-item">
                <p className="badge">{item.event_date}</p>
                <p className="story-title">{item.title}</p>
                {item.description && (
                  <p className="story-text">{item.description}</p>
                )}
                <p className="story-meta">记录于时间线</p>
              </div>
            ))}
          </article>

          <article className="card">
            <h3 className="card-title">生活里的小片段</h3>
            {recentPosts.length === 0 && (
              <p className="empty">
                还没有写下哪怕一小段日常。没关系，从某一天的一个瞬间开始就好。
              </p>
            )}
            {recentPosts.map((post) => (
              <Link
                href={`/posts/${post.id}`}
                key={post.id}
                className="story-item story-link"
              >
                <p className="badge">
                  {post.happened_on ?? post.created_at.slice(0, 10)}
                </p>
                <p className="story-title">{post.title}</p>
                <p className="story-text">
                  {post.content.length > 60
                    ? `${post.content.slice(0, 60)}...`
                    : post.content}
                </p>
                <p className="story-meta">生活记录</p>
              </Link>
            ))}
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <p>我们的故事仍在继续，愿以后翻开这里时，都会觉得今天也很值得被记住。</p>
      </footer>
    </section>
  );
}
