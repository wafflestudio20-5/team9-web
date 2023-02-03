import axios from 'axios';

import { apiEndPoint } from './endpoint';

import { Comment } from '@customTypes/BlogTypes';

const BlogAPI = axios.create({
    baseURL: `${apiEndPoint}/blog`,
});

// FormData: {title: string, content: string, image?: File | '', schedules_json: {pk: number}[]}
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

// FormData: {title: string, content: string, image?: File | '', nested_json: {pk: number}[]}
export const editPostAPI = (
    postId: number,
    newPost: FormData,
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
    commentId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/comment/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const editCommentAPI = (
    commentId: number,
    newComment: Comment,
    accessToken: string | null,
) =>
    BlogAPI.patch(`/comment/${commentId}/`, newComment, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const deleteCommentAPI = (
    commentId: number,
    accessToken: string | null,
) =>
    BlogAPI.delete(`/comment/${commentId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

export const getRelatedPosts = (
    scheduleId: number,
    accessToken: string | null,
) =>
    BlogAPI.get(`/schedule/post/${scheduleId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
