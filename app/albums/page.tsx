import Link from 'next/link';
import { getAlbums } from '@/lib/supabase/queries';
import { Button, Card, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <section>
      <Title order={1}>回忆相册</Title>
      <Text c="dimmed" mt={6} mb="md">
        把照片装进相册里，以后翻开每一册，都是当时的心情在打招呼。
      </Text>
      {albums.length === 0 ? (
        <Text c="dimmed" size="sm">
          还没有创建任何相册。等有第一组想好好保存的照片时，就从这里开始吧。
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {albums.map((album) => (
            <div key={album.id}>
              <Card>
              {album.cover_url ? (
                <Image
                  src={album.cover_url}
                  alt={album.title}
                  radius="md"
                  h={220}
                  fit="cover"
                />
              ) : (
                <Card withBorder bg="pink.0">
                  <Text c="dimmed" size="sm">还没有设置封面，但故事已经在路上了。</Text>
                </Card>
              )}
              <Stack gap={6} mt="sm">
                <Title order={3}>{album.title}</Title>
                {album.description && (
                  <Text c="dimmed" size="sm">{album.description}</Text>
                )}
                <Button component={Link} href={`/albums/${album.id}`} variant="light">
                  打开这一册
                </Button>
              </Stack>
              </Card>
            </div>
          ))}
        </SimpleGrid>
      )}
    </section>
  );
}
