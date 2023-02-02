export interface FollowUser {
    pk: number;
    username: string;
    email: string;
}

export interface FollowRequestData {
    approved: string | null;
    created_at: string;
    followee: FollowUser;
    follower: FollowUser;
    id: number;
    updated_at: string;
}
