export interface Post {
    readonly id?: number;
    title: string;
    content: string;
}

export interface FullPost extends Readonly<Post> {
    id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    readonly id?: number;
    readonly post: number;
    content: string;
}

export interface FullComment extends Readonly<Omit<Comment, 'post'>> {
    id: number;
    post: FullPost;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_updated: boolean;
}
