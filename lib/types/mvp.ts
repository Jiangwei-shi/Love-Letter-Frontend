export type Profile = {
  id: string;
  nickname?: string | null;
  partner_nickname?: string | null;
  anniversary_date?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_at: string;
  created_by: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  happened_on: string | null;
  created_at: string;
  created_by: string;
  post_images?: PostImage[];
};

export type PostImage = {
  id: string;
  post_id: string;
  image_url: string;
  sort_order: number;
};

export type Album = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  created_by: string;
};

export type AlbumPhoto = {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};
