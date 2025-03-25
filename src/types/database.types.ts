export type ContentType = 'text' | 'image' | 'video' | 'link';
export type VoteType = 'upvote' | 'downvote';
export type StorageType = 'direct' | 'ipfs';

export interface Profile {
    id: string;
    wallet_address: string;
    username: string | null;
    bio: string | null;
    avatar_url: string | null;
    reputation_score: number;
    total_posts: number;
    total_comments: number;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
    icon_url: string | null;
    color: string | null;
    created_at: string;
}

export interface Post {
    id: string;
    author_id: string;
    category_id: string | null;
    title: string;
    content: string;
    content_type: ContentType;
    media_url: string | null;
    upvotes_count: number;
    downvotes_count: number;
    comments_count: number;
    is_edited: boolean;
    created_at: string;
    updated_at: string;
    content_ipfs_hash?: string;
    media_ipfs_hash?: string;
    storage_type: StorageType;
}

export interface Comment {
    id: string;
    post_id: string;
    author_id: string;
    parent_id: string | null;
    content: string;
    upvotes_count: number;
    downvotes_count: number;
    is_edited: boolean;
    created_at: string;
    updated_at: string;
}

export interface Vote {
    id: string;
    user_id: string;
    post_id: string | null;
    comment_id: string | null;
    vote_type: VoteType;
    created_at: string;
}

export interface Bookmark {
    id: string;
    user_id: string;
    post_id: string;
    created_at: string;
}

export interface IPFSMetadata {
    id: string;
    content_hash: string;
    content_type: string;
    size_bytes?: number;
    created_at: string;
    updated_at: string;
}
