import Link from 'next/link';
import { getPosts } from '@/lib/supabase/queries';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <section>
      <h1 className="title">生活记录</h1>
      <p className="subtitle">一些平凡却闪闪发光的日常瞬间。</p>
      <div className="grid">
        {posts.map((post) => (
          <article className="card" key={post.id}>
            <p className="badge">{post.happened_on ?? post.created_at.slice(0, 10)}</p>
            <h3>{post.title}</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
            <div className="row-wrap">
              {(post.post_images ?? []).map((img) => (
                <img key={img.id} src={img.image_url} alt={post.title} className="cover" style={{ height: 130, width: 130 }} />
              ))}
            </div>
          </article>
        ))}
      </div>
      {posts.length === 0 && <p className="empty">暂无生活记录。</p>}
      <p style={{ marginTop: 16 }}><Link href="/albums" className="btn btn-soft">查看相册</Link></p>
    </section>
  );
}
