'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Group, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
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
      <Card radius="lg" shadow="sm">
        <Title order={3}>相册管理</Title>
        <Text size="sm" c="dimmed" mt={4}>
          创建不同主题的相册，把照片分门别类地装进去。
        </Text>
        <form onSubmit={onCreateAlbum}>
          <Stack gap="sm" mt="md">
            <TextInput
              label="相册标题"
              placeholder="例如：第一次旅行"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
            <Textarea
              label="相册描述"
              placeholder="简单写写这本相册大概会放些什么（可选）"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              autosize
              minRows={2}
            />
            <Button type="submit">
              创建相册
            </Button>
          </Stack>
        </form>

        <Stack gap="xs" mt="md">
          {albums.map((album) => (
            <Group key={album.id} justify="space-between">
              <Button
                variant={albumId === album.id ? 'filled' : 'light'}
                size="xs"
                onClick={() => setAlbumId(album.id)}
              >
                {album.title}
              </Button>
              <Button
                color="red"
                variant="light"
                size="xs"
                onClick={() => onDeleteAlbum(album.id)}
              >
                删除
              </Button>
            </Group>
          ))}
          {albums.length === 0 && (
            <Text size="sm" c="dimmed">
              还没有任何相册，先创建一册吧。
            </Text>
          )}
        </Stack>
      </Card>

      <Card radius="lg" shadow="sm">
        <Title order={4}>上传相册照片</Title>
        <form onSubmit={onUpload}>
          <Stack gap="sm" mt="md">
            <Select
              label="选择相册"
              placeholder="请选择相册"
              data={albums.map((album) => ({ value: album.id, label: album.title }))}
              value={albumId}
              onChange={(value) => setAlbumId(value ?? '')}
              required
            />
            <TextInput
              type="file"
              component="input"
              onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)}
              required
            />
            <TextInput
              label="照片说明"
              placeholder="可以写一句话记录这个画面（可选）"
              value={caption}
              onChange={(e) => setCaption(e.currentTarget.value)}
            />
            <Button type="submit">
              上传照片
            </Button>
          </Stack>
        </form>

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          {photos.map((photo) => (
            <Card key={photo.id} radius="md" shadow="xs">
              <img className="cover" src={photo.image_url} alt={photo.caption ?? 'photo'} />
              <Text size="sm" mt={4}>{photo.caption}</Text>
              <Button
                color="red"
                variant="light"
                size="xs"
                mt="xs"
                onClick={() => onDeletePhoto(photo.id)}
              >
                删除照片
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </section>
  );
}
