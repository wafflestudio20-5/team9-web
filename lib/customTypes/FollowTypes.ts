export interface Followee {
    pk: number;
    username: string;
    email: string;
}

export interface FollowRequestData {
    approved: string|null;
    created_at: string;
    followee: Followee;
    follower: number;
    id: number;
    updated_at: string;
}