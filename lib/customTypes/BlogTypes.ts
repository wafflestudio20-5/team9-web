import { FullSchedule } from './ScheduleTypes';

export interface FullPost {
    pid: number;
    title: string;
    content: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    image?: string | null;
    schedules: FullSchedule[];
}

export interface Comment {
    post?: number;
    content: string;
}

export interface FullComment extends Readonly<Comment> {
    cid: number;
    post: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    is_updated: boolean;
}
