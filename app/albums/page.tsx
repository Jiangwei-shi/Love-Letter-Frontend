import Link from 'next/link';
import { getAlbums } from '@/lib/supabase/queries';

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <section>
      <h1 className="title">回忆相册</h1>
      <p className="subtitle">
        把照片装进相册里，以后翻开每一册，都是当时的心情在打招呼。
      </p>
      {albums.length === 0 ? (
        <p className="empty">
          还没有创建任何相册。等有第一组想好好保存的照片时，就从这里开始吧。
        </p>
      ) : (
        <div className="grid grid-2 album-grid">
          {albums.map((album) => (
            <article className="card album-card" key={album.id}>
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.title}
                  className="album-cover"
                />
              ) : (
                <div className="album-cover album-cover-placeholder">
                  还没有设置封面，但故事已经在路上了。
                </div>
              )}
              <div className="album-body">
                <h3 className="album-title">{album.title}</h3>
                {album.description && (
                  <p className="album-desc">{album.description}</p>
                )}
                <Link href={`/albums/${album.id}`} className="btn btn-soft">
                  打开这一册
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
