import axios from 'axios';

import { apiEndPoint } from './endpoint';

import { Comment, Post } from '@customTypes/BlogTypes';

const BlogAPI = axios.create({
    baseURL: `${apiEndPoint}/blog/post`,
});

export const createPostAPI = (newPost: Post, accessToken: string | null) =>
    BlogAPI.post('/', newPost, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getPostAPI = (postId: number, accessToken: string | null) =>
    BlogAPI.get(`/${postId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const editPostAPI = (
    postId: number,
    newPost: Post,
    accessToken: string | null,
) =>
    BlogAPI.patch(`/${postId}/`, newPost, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const deletePostAPI = (postId: number, accessToken: string | null) =>
    BlogAPI.delete(`/${postId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const createCommentAPI = (
    postId: number,
    newComment: Comment,
    accessToken: string | null,
) =>
    BlogAPI.post(`/${postId}/comment/`, newComment, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getCommentAPI = (
    postId: number,
    commentId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/${postId}/comment/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const editCommentAPI = (
    postId: number,
    commentId: number,
    newComment: Comment,
    accessToken: string | null,
) =>
    BlogAPI.patch(`/${postId}/comment/${commentId}/`, newComment, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const deleteCommentAPI = (
    postId: number,
    commentId: number,
    accessToken: string | null,
) =>
    BlogAPI.delete(`/${postId}/comment/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
