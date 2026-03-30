'use client';

import { Card, Image, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import type { AlbumPhoto } from '@/lib/types/mvp';

export default function AlbumPhotoGrid({
  photos,
  albumTitle,
}: {
  photos: AlbumPhoto[];
  albumTitle: string;
}) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }}>
      {photos.map((photo) => (
        <UnstyledButton
          type="button"
          key={photo.id}
          onClick={() => window.open(photo.image_url, '_blank')}
        >
          <Card>
            <Image
            src={photo.image_url}
            alt={photo.caption ?? albumTitle}
              radius="md"
              h={180}
              fit="cover"
            />
            {photo.caption && (
              <Text size="xs" c="dimmed" mt={4}>
                {photo.caption}
              </Text>
            )}
          </Card>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}

