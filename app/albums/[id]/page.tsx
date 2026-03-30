import Link from 'next/link';
import { getAlbumPhotos, getAlbums } from '@/lib/supabase/queries';

export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  const albums = await getAlbums();
  const album = albums.find((item) => item.id === params.id);
  const photos = await getAlbumPhotos(params.id);

  if (!album) {
    return <p className="empty">��᲻���ڡ�</p>;
  }

  return (
    <section>
      <p><Link href="/albums" className="btn btn-soft">�������</Link></p>
      <h1 className="title">{album.title}</h1>
      <p className="subtitle">{album.description}</p>
      <div className="grid grid-2">
        {photos.map((photo) => (
          <article className="card" key={photo.id}>
            <img src={photo.image_url} alt={photo.caption ?? album.title} className="cover" />
            <p>{photo.caption}</p>
          </article>
        ))}
      </div>
      {photos.length === 0 && <p className="empty">�����ỹû����Ƭ��</p>}
    </section>
  );
}
