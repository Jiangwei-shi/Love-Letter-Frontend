export type Profile = {
  id: string;
  nickname?: string | null;
  partner_nickname?: string | null;
  anniversary_date?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  intro?: string | null;
  hero_image_url?: string | null;
  created_at: string;
};

export type CoupleProfile = {
  id: string;
  boy_name: string | null;
  boy_avatar: string | null;
  girl_name: string | null;
  girl_avatar: string | null;
  anniversary_date: string | null;
  about_text: string | null;
  boy_message_for_girl: string | null;
  girl_message_for_boy: string | null;
  created_at: string;
  updated_at: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  event_date: string;
  boy_message: string | null;
  girl_message: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  record_time: string;
  author_type: 'boy' | 'girl';
  created_at: string;
  updated_at: string;
  created_by: string;
  post_images?: PostImage[];
  post_likes?: PostLike[];
  post_comments?: PostComment[];
};

export type PostImage = {
  id: string;
  post_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type PostLike = {
  id: string;
  post_id: string;
  created_at: string;
};

export type PostComment = {
  id: string;
  post_id: string;
  visitor_name: string;
  message: string;
  created_at: string;
};
