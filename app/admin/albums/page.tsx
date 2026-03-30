'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { uploadAlbumPhoto } from '@/lib/supabase/upload';
import type { Album, AlbumPhoto } from '@/lib/types/mvp';

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [albumId, setAlbumId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const loadAlbums = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
    const list = (data ?? []) as Album[];
    setAlbums(list);
    if (!albumId && list[0]) setAlbumId(list[0].id);
  };

  const loadPhotos = async (id: string) => {
    if (!id) return;
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from('album_photos').select('*').eq('album_id', id).order('sort_order', { ascending: true });
    setPhotos((data ?? []) as AlbumPhoto[]);
  };

  useEffect(() => { void loadAlbums(); }, []);
  useEffect(() => { void loadPhotos(albumId); }, [albumId]);

  const onCreateAlbum = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    await supabase.from('albums').insert({ title, description });
    setTitle('');
    setDescription('');
    await loadAlbums();
  };

  const onUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !albumId) return;
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const imageUrl = await uploadAlbumPhoto(file, data.user.id);
    await supabase.from('album_photos').insert({ album_id: albumId, image_url: imageUrl, caption, sort_order: photos.length });
    setFile(null);
    setCaption('');
    await loadPhotos(albumId);

    const selected = albums.find((a) => a.id === albumId);
    if (selected && !selected.cover_url) {
      await supabase.from('albums').update({ cover_url: imageUrl }).eq('id', albumId);
      await loadAlbums();
    }
  };

  const onDeleteAlbum = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('albums').delete().eq('id', id);
    await loadAlbums();
  };

  const onDeletePhoto = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('album_photos').delete().eq('id', id);
    await loadPhotos(albumId);
  };

  return (
    <section className="grid">
      <article className="card">
        <h1 className="title">������</h1>
        <form className="form-grid" onSubmit={onCreateAlbum}>
          <input className="input" placeholder="�����" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="textarea" placeholder="����" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn" type="submit">�������</button>
        </form>
        <div style={{ marginTop: 12 }}>
          {albums.map((album) => (
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }} key={album.id}>
              <button className="btn btn-soft" onClick={() => setAlbumId(album.id)}>{album.title}</button>
              <button className="btn btn-danger" onClick={() => onDeleteAlbum(album.id)}>ɾ��</button>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>�ϴ������Ƭ</h2>
        <form className="form-grid" onSubmit={onUpload}>
          <select className="select" value={albumId} onChange={(e) => setAlbumId(e.target.value)} required>
            <option value="">��ѡ�����</option>
            {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
          </select>
          <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
          <input className="input" placeholder="��Ƭ˵������ѡ��" value={caption} onChange={(e) => setCaption(e.target.value)} />
          <button className="btn" type="submit">�ϴ���Ƭ</button>
        </form>

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          {photos.map((photo) => (
            <article className="card" key={photo.id}>
              <img className="cover" src={photo.image_url} alt={photo.caption ?? 'photo'} />
              <p>{photo.caption}</p>
              <button className="btn btn-danger" onClick={() => onDeletePhoto(photo.id)}>ɾ����Ƭ</button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}
