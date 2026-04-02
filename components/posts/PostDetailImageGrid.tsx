'use client';

import { useMemo, useState } from 'react';
import { Image, SimpleGrid, UnstyledButton } from '@mantine/core';
import type { PostImage } from '@/lib/types/mvp';
import { ARCHIVE } from '@/homepage/constants';
import PostImagePreviewModal from '@/posts/PostImagePreviewModal';

type Props = {
  images: PostImage[];
  title: string;
};

export default function PostDetailImageGrid({ images, title }: Props) {
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const urls = useMemo(() => images.map((img) => img.image_url), [images]);

  if (images.length === 0) return null;

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {images.map((img, idx) => (
          <UnstyledButton
            key={img.id}
            type="button"
            onClick={() => setViewer({ open: true, index: idx })}
            aria-label={`查看大图：${title}`}
            style={{
              padding: 0,
              border: 'none',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'zoom-in',
              display: 'block',
              width: '100%',
              background: ARCHIVE.surfaceContainerHigh,
            }}
          >
            <Image src={img.image_url} alt={title} radius="md" h={220} w="100%" fit="cover" />
          </UnstyledButton>
        ))}
      </SimpleGrid>
      <PostImagePreviewModal
        urls={urls}
        initialIndex={viewer.index}
        opened={viewer.open}
        onClose={() => setViewer((v) => ({ ...v, open: false }))}
        alt={title}
      />
    </>
  );
}
