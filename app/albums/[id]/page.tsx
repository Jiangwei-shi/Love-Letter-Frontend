import Link from 'next/link';
import { getAlbumPhotos, getAlbums } from '@/lib/supabase/queries';
import AlbumPhotoGrid from '@/components/AlbumPhotoGrid';

export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  const albums = await getAlbums();
  const album = albums.find((item) => item.id === params.id);
  const photos = await getAlbumPhotos(params.id);

  if (!album) {
    return (
      <section>
        <p className="empty">这本相册好像不见了，或者从来还没有被创建过。</p>
        <p style={{ marginTop: 12 }}>
          <Link href="/albums" className="btn btn-soft">
            回到相册列表
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <p>
        <Link href="/albums" className="btn btn-soft">
          ← 回到相册列表
        </Link>
      </p>

      <header className="album-header card">
        <div className="album-header-main">
          <h1 className="title">{album.title}</h1>
          {album.description && (
            <p className="subtitle">{album.description}</p>
          )}
        </div>
        <p className="album-header-meta">
          共 {photos.length} 张照片
        </p>
      </header>

      {photos.length === 0 ? (
        <p className="empty">
          这一册还没有照片。等我们准备好第一张的时候，再一张一张慢慢装进来。
        </p>
      ) : (
        <AlbumPhotoGrid photos={photos} albumTitle={album.title} />
      )}
    </section>
  );
}
