import Link from 'next/link';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import { getAlbumPhotos, getAlbums } from '@/lib/supabase/queries';
import AlbumPhotoGrid from '@/components/AlbumPhotoGrid';

export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  const albums = await getAlbums();
  const album = albums.find((item) => item.id === params.id);
  const photos = await getAlbumPhotos(params.id);

  if (!album) {
    return (
      <section>
        <Text c="dimmed" size="sm">这本相册好像不见了，或者从来还没有被创建过。</Text>
        <Group mt="sm">
          <Button component={Link} href="/albums" variant="light">
            回到相册列表
          </Button>
        </Group>
      </section>
    );
  }

  return (
    <section>
      <Group>
        <Button component={Link} href="/albums" variant="light">
          ← 回到相册列表
        </Button>
      </Group>

      <Card mt="sm">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={1}>{album.title}</Title>
          {album.description && (
              <Text c="dimmed" mt={4}>{album.description}</Text>
          )}
          </div>
          <Text size="sm" c="dimmed">共 {photos.length} 张照片</Text>
        </Group>
      </Card>

      {photos.length === 0 ? (
        <Text c="dimmed" size="sm" mt="md">
          这一册还没有照片。等我们准备好第一张的时候，再一张一张慢慢装进来。
        </Text>
      ) : (
        <div style={{ marginTop: 12 }}>
          <AlbumPhotoGrid photos={photos} albumTitle={album.title} />
        </div>
      )}
    </section>
  );
}
