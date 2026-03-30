'use client';

import type { AlbumPhoto } from '@/lib/types/mvp';

export default function AlbumPhotoGrid({
  photos,
  albumTitle,
}: {
  photos: AlbumPhoto[];
  albumTitle: string;
}) {
  return (
    <div className="album-photos-grid">
      {photos.map((photo) => (
        <button
          type="button"
          key={photo.id}
          className="album-photo-item"
          onClick={() => window.open(photo.image_url, '_blank')}
        >
          <img
            src={photo.image_url}
            alt={photo.caption ?? albumTitle}
            className="album-photo-img"
          />
          {photo.caption && (
            <p className="album-photo-caption">{photo.caption}</p>
          )}
        </button>
      ))}
    </div>
  );
}

