// constants/api.ts
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = '8080';

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '');
}

function getExpoDevHost() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] ?? null;
}

function resolveApiBaseUrl() {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envBaseUrl) {
    return trimTrailingSlash(envBaseUrl);
  }

  const expoDevHost = getExpoDevHost();
  if (expoDevHost) {
    return `http://${expoDevHost}:${API_PORT}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();

export const API_ENDPOINTS = {
  // 인증/계정 관련 (UserController)
  LOGIN: "/api/users/auth/login",
  SIGNUP: "/api/users/auth/signup",
  REFRESH_TOKEN: "/api/users/auth/refresh-token",
  LOGOUT: "/api/users/auth/logout",
  FIND_ID_BY_EMAIL: "/api/users/auth/find-id",

  // 사용자 설정/프로필 (UserController)
  GET_USER_SETTINGS: "/api/users/me/settings",
  UPDATE_USER_SETTINGS: "/api/users/me/settings",
  GET_USER_PROFILE: "/api/users/me/profile",
  UPDATE_USER_PROFILE: "/api/users/me/profile",
  UPDATE_EMAIL: "/api/users/me/email",
  UPDATE_PASSWORD: "/api/users/me/password",
  UPDATE_EQUIPPED_ITEMS: "/api/users/me/equipped-items",
  UPDATE_COINS: "/api/users/me/coins",
  PURCHASE_ITEM: "/api/store/purchase",
  // 질문 (QuestionController)
  GET_QUESTION: "/api/questions/for-me",
  GET_ON_DEMAND_QUESTION: "/api/questions/on-demand",
  CHAT_COMPLETIONS: "/api/chat/completions",

  // 답변 (AnswerController)
  SAVE_ANSWER: "/api/answers",
  GET_MY_ANSWERS: "/api/answers/my-records",

  // 게시글 (PostController)
  GET_POSTS_LIST: "/api/posts/list",
  CREATE_POST: "/api/posts/write",
  GET_POST_DETAIL: (postId: number | string) => `/api/posts/${postId}`,
  UPDATE_POST: (postId: number | string) => `/api/posts/${postId}`,
  DELETE_POST: (postId: number | string) => `/api/posts/${postId}`,

  // 댓글 (CommentController)
  GET_COMMENTS_FOR_POST: (postId: number | string) =>
    `/api/posts/${postId}/comments`,
  CREATE_COMMENT: (postId: number | string) => `/api/posts/${postId}/comments`,
  UPDATE_COMMENT: (commentId: number | string) => `/api/comments/${commentId}`,
  DELETE_COMMENT: (commentId: number | string) => `/api/comments/${commentId}`,
};
