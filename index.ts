export type UserRole = 'listener' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_image: string;
  created_at: string;
  status: UserStatus;
}

export type StoryStatus = 'published' | 'unpublished' | 'archived';
export type AccessType = 'free' | 'premium';

export interface Story {
  id: string;
  title: string;
  short_description: string;
  synopsis: string;
  cover_image_url: string;
  banner_image_url?: string;
  author: string;
  narrator: string;
  category_id: string;
  language: string;
  status: StoryStatus;
  access_type: AccessType;
  release_date: string;
  total_views: number;
  rating: number;
  review_count: number;
  is_featured?: boolean;
  is_trending?: boolean;
  created_at: string;
}

export type EpisodeStatus = 'published' | 'draft';

export interface Episode {
  id: string;
  story_id: string;
  episode_number: number;
  title: string;
  description: string;
  audio_url: string;
  cover_image_url?: string;
  duration: number; // in seconds
  status: EpisodeStatus;
  access_type: AccessType;
  release_date: string;
  play_count: number;
  narration_text?: string;
}

export interface ListeningProgress {
  id: string;
  user_id: string;
  story_id: string;
  episode_id: string;
  current_position: number; // in seconds
  duration: number;
  completed: boolean;
  updated_at: string;
}

export interface UserStoryRelation {
  id: string;
  user_id: string;
  story_id: string;
  is_favorite: boolean;
  is_followed: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  story_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  display_order: number;
}

export interface AppSettings {
  app_name: string;
  tagline: string;
  logo_url: string;
  supported_languages: string[];
  audio_upload_limit_mb: number;
  maintenance_mode: boolean;
  terms_of_service: string;
  privacy_policy: string;
  featured_story_ids: string[];
}

export interface DownloadedEpisode {
  episode_id: string;
  story_id: string;
  episode: Episode;
  story: Story;
  audio_blob: Blob;
  size_bytes: number;
  downloaded_at: string;
}

export type NavTab = 'home' | 'discover' | 'library' | 'profile' | 'admin' | 'story-detail';
