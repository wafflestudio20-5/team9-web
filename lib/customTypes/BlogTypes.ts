import { FullSchedule } from './ScheduleTypes';

export interface Post {
    readonly pid?: number;
    title: string;
    content: string;
    image?: string | null;
    schedules?: { pk: number }[];
}

export interface FullPost extends Readonly<Omit<Post, 'schedules'>> {
    pid: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    schedules: FullSchedule[];
}

export interface Comment {
    readonly cid?: number;
    readonly post: number;
    content: string;
}

export interface FullComment extends Readonly<Omit<Comment, 'post'>> {
    cid: number;
    post: FullPost;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_updated: boolean;
}
