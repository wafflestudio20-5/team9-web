import axios from 'axios';

import { apiEndPoint } from './endpoint';

import { Comment, Post } from '@customTypes/BlogTypes';

const BlogAPI = axios.create({
    baseURL: `${apiEndPoint}/blog`,
});

export const createPostAPI = (newPost: FormData, accessToken: string | null) =>
    BlogAPI.post('/post/', newPost, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
        },
    });

export const getMyPostsAPI = (accessToken: string | null) =>
    BlogAPI.get(`/post/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getParticularPostAPI = (
    postId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/post/${postId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const editPostAPI = (
    postId: number,
    newPost: Post,
    accessToken: string | null,
) =>
    BlogAPI.patch(`/post/${postId}/`, newPost, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
        },
    });

export const deletePostAPI = (postId: number, accessToken: string | null) =>
    BlogAPI.delete(`/post/${postId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const createCommentAPI = (
    postId: number,
    newComment: Comment,
    accessToken: string | null,
) =>
    BlogAPI.post(`/post/${postId}/comment/`, newComment, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getEntireCommentAPI = (
    postId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/post/${postId}/comment/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getParticularCommentAPI = (
    postId: number,
    commentId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/post/${postId}/comment/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const editCommentAPI = (
    postId: number,
    commentId: number,
    newComment: Comment,
    accessToken: string | null,
) =>
    BlogAPI.patch(`/post/${postId}/comment/${commentId}/`, newComment, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const deleteCommentAPI = (
    postId: number,
    commentId: number,
    accessToken: string | null,
) =>
    BlogAPI.delete(`/post/${postId}/comment/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getRelatedPosts = (
    scheduleId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/schedule/post/${scheduleId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
