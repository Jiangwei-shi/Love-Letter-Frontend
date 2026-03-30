import Link from 'next/link';
import { getPosts } from '@/lib/supabase/queries';

function getFirstImage(post: Awaited<ReturnType<typeof getPosts>>[number]) {
  return (post.post_images ?? [])[0]?.image_url ?? null;
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <section>
      <h1 className="title">生活记录</h1>
      <p className="subtitle">
        这里不是宏大的故事，只是一些普通又特别的小日子。
      </p>

      {posts.length === 0 ? (
        <p className="empty">
          还没有写下一篇生活记录。等想起某个想分享给未来自己的瞬间，就可以从这里开始写啦。
        </p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => {
            const imageUrl = getFirstImage(post);
            const date = post.happened_on ?? post.created_at.slice(0, 10);
            const summary =
              post.content.length > 90
                ? `${post.content.slice(0, 90)}...`
                : post.content;

            return (
              <Link
                href={`/posts/${post.id}`}
                key={post.id}
                className="card post-item"
              >
                {imageUrl && (
                  <div className="post-thumb">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="post-thumb-img"
                    />
                  </div>
                )}
                <div className="post-body">
                  <p className="badge">{date}</p>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-summary">{summary}</p>
                  <p className="post-meta">小小的生活札记</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p style={{ marginTop: 24 }}>
        <Link href="/albums" className="btn btn-soft">
          去相册里看看这些日子被拍下来的样子
        </Link>
      </p>
    </section>
  );
}
