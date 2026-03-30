import Link from 'next/link';
import { getPostById } from '@/lib/supabase/queries';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return (
      <section>
        <p className="empty">
          这篇生活记录好像找不到了，也许被时光悄悄藏了起来。
        </p>
        <p style={{ marginTop: 12 }}>
          <Link href="/posts" className="btn btn-soft">
            回到生活记录
          </Link>
        </p>
      </section>
    );
  }

  const date = post.happened_on ?? post.created_at.slice(0, 10);

  return (
    <section className="card">
      <p>
        <Link href="/posts" className="btn btn-soft">
          ← 回到生活记录
        </Link>
      </p>
      <p className="badge">{date}</p>
      <h1 className="title">{post.title}</h1>
      <p className="subtitle">这一小段记忆，被认真地写给以后看的我们。</p>

      <article style={{ whiteSpace: 'pre-wrap', marginTop: 12, marginBottom: 16 }}>
        {post.content}
      </article>

      {(post.post_images ?? []).length > 0 && (
        <div className="post-detail-photos">
          {(post.post_images ?? []).map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={post.title}
              className="post-detail-photo"
            />
          ))}
        </div>
      )}

      <p className="post-meta" style={{ marginTop: 16 }}>
        这一天，就这样被温柔地收进了我们的故事里。
      </p>
    </section>
  );
}

