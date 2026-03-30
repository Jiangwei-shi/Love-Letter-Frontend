import Link from 'next/link';
import { getAlbums } from '@/lib/supabase/queries';

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <section>
      <h1 className="title">相册</h1>
      <p className="subtitle">把所有可爱的回忆，装进一个个相册里。</p>
      <div className="grid grid-2">
        {albums.map((album) => (
          <article className="card" key={album.id}>
            {album.cover_url ? <img src={album.cover_url} alt={album.title} className="cover" /> : <div className="cover" />}
            <h3>{album.title}</h3>
            <p>{album.description}</p>
            <Link href={`/albums/${album.id}`} className="btn">查看详情</Link>
          </article>
        ))}
      </div>
      {albums.length === 0 && <p className="empty">暂无相册。</p>}
    </section>
  );
}
