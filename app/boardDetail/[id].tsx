// app/boardDetail/[id].tsx
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL, API_ENDPOINTS } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

interface PostDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  userId: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
}

const BoardDetail = () => {
  const { id: postIdFromParams } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { token } = useAuth();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload).sub;
    } catch (e) {
      console.error("Failed to decode token or get user ID (boardDetail.tsx):", e);
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  const fetchPostDetail = useCallback(async () => {
    if (!postIdFromParams) return;
    try {
      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.GET_POST_DETAIL(postIdFromParams)}`;
      const res = await axios.get<PostDetail>(apiUrl);
      setPost(res.data);
    } catch (error) {
      console.error('게시글 상세 정보 로딩 실패 (boardDetail.tsx):', error);
      Alert.alert("오류", "게시글 정보를 불러오는 데 실패했습니다.");
    }
  }, [postIdFromParams]);

  const fetchComments = useCallback(async () => {
    if (!postIdFromParams) return;
    try {
      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.GET_COMMENTS_FOR_POST(postIdFromParams)}`;
      const res = await axios.get<Comment[]>(apiUrl);
      setComments(res.data);
    } catch (error) {
      console.error('댓글 목록 로딩 실패 (boardDetail.tsx):', error);
    }
  }, [postIdFromParams]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPostDetail();
      await fetchComments();
      setLoading(false);
    };
    if (postIdFromParams) {
      loadData();
    } else {
      Alert.alert("오류", "게시글 ID가 올바르지 않습니다.");
      if(navigation.canGoBack()) router.back(); else router.replace('/board');
      setLoading(false);
    }
  }, [postIdFromParams, fetchPostDetail, fetchComments, navigation, router]);

  const handleApiError = (error: any, action: '작성' | '수정') => {
    let errMsg = '';
    const data = error.response?.data;

    if (typeof data === 'string') {
        errMsg = data;
    } else if (data && typeof data === 'object') {
        const errData = data as any;
        if (errData.message) {
            errMsg = errData.message;
            if (errData.reason) {
                errMsg += `\n사유: ${errData.reason}`;
            }
        } else {
            errMsg = `댓글 ${action} 중 오류가 발생했습니다.`;
        }
    } else {
        errMsg = `댓글 ${action} 중 알 수 없는 오류가 발생했습니다.`;
    }
    Alert.alert(`작업 실패`, errMsg);
  };

  const handleSubmitComment = async () => {
    if (!commentInput.trim() || !token || !postIdFromParams) {
        Alert.alert("입력 오류", "댓글 내용을 입력해주세요.");
        return;
    }
    if (isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.CREATE_COMMENT(postIdFromParams)}`;
      await axios.post(
        apiUrl,
        { content: commentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInput('');
      Keyboard.dismiss();
      await fetchComments();
    } catch (error: any) {
      console.error('댓글 작성 실패 (boardDetail.tsx):', error.response?.data || error.message);
      handleApiError(error, '작성');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditPost = () => {
    if (!postIdFromParams) return;
        router.push(`/boardEdit/${postIdFromParams}` as any);
  };

  const handleDeletePost = async () => {
    if (!token || !postIdFromParams) return;
    Alert.alert("게시글 삭제", "정말로 이 게시글을 삭제하시겠습니까?",
      [{ text: "취소", style: "cancel" },
       { text: "삭제", style: "destructive", onPress: async () => {
            try {
              const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.DELETE_POST(postIdFromParams)}`;
              await axios.delete(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
              Alert.alert("성공", "게시글이 삭제되었습니다.");
              router.back();
            } catch (error: any) {
              console.error('게시글 삭제 실패 (boardDetail.tsx):', error.response?.data || error.message);
              Alert.alert("오류", error.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;
     Alert.alert("댓글 삭제", "정말로 이 댓글을 삭제하시겠습니까?",
      [{ text: "취소", style: "cancel" },
       { text: "삭제", style: "destructive", onPress: async () => {
            try {
              const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.DELETE_COMMENT(commentId)}`;
              await axios.delete(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
              await fetchComments();
            } catch (error: any) {
              console.error('댓글 삭제 실패 (boardDetail.tsx):', error.response?.data || error.message);
              Alert.alert("오류", error.response?.data?.message || "댓글 삭제 실패");
            }
          },
        },
      ]
    );
  };

  const handleUpdateComment = async () => {
    if (!editedCommentContent.trim() || editingCommentId === null || !token) {
        Alert.alert("입력 오류", "수정할 댓글 내용을 입력해주세요.");
        return;
    }
    if(isUpdatingComment) return;
    setIsUpdatingComment(true);
    try {
      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_COMMENT(editingCommentId)}`;
      await axios.put(apiUrl, { content: editedCommentContent }, { headers: { Authorization: `Bearer ${token}` } });
      setEditingCommentId(null);
      setEditedCommentContent('');
      await fetchComments();
    } catch (error: any) {
      console.error('댓글 수정 실패 (boardDetail.tsx):', error.response?.data || error.message);
      handleApiError(error, '수정');
    } finally {
        setIsUpdatingComment(false);
    }
  };

  const isPostAuthor = post?.userId === currentUserId;

  const renderCommentItem = ({ item }: { item: Comment }) => {
    const isCommentAuthor = item.userId === currentUserId;
    return (
      <View style={styles.commentBox}>
        <View style={styles.commentHeaderRow}>
            <Text style={styles.commentUser}>{item.userId}</Text>
            <Text style={styles.commentMeta}>
            {' · '}{new Date(item.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
        {editingCommentId === item.id ? (
          <>
            <TextInput value={editedCommentContent} onChangeText={setEditedCommentContent} style={styles.inputInline} multiline placeholder="댓글 수정..." placeholderTextColor="#A0522D" autoFocus />
            <View style={styles.editCommentActions}>
              <TouchableOpacity style={[styles.smallButton, styles.saveButton]} onPress={handleUpdateComment} disabled={isUpdatingComment}>
                <Text style={styles.buttonText}>{isUpdatingComment ? "저장중..." : "저장"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={() => { setEditingCommentId(null); setEditedCommentContent(''); }} disabled={isUpdatingComment}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.commentContent}>{item.content}</Text>
            {isCommentAuthor && (
              <View style={styles.iconButtonGroup}>
                <TouchableOpacity onPress={() => { setEditingCommentId(item.id); setEditedCommentContent(item.content); }} style={styles.iconButton}>
                    <Feather name="edit-3" size={18} color="#8FBC8F" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteComment(item.id)} style={styles.iconButton}>
                    <Feather name="trash-2" size={18} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  if (loading || !post) {
    return (
      <SafeAreaView style={styles.loadingOrErrorContainer}>
        <ImageBackground
          source={require('../../assets/images/chat_tree.png')}
          resizeMode="cover"
          style={styles.backgroundImageFill}
        >
            <View style={styles.screenOverlayForLoading} />
            <ActivityIndicator size="large" color="#A0522D" />
            <Text style={styles.loadingText}>정보를 불러오는 중...</Text>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (!postIdFromParams) {
    return (
      <SafeAreaView style={styles.loadingOrErrorContainer}>
         <ImageBackground
          source={require('../../assets/images/chat_tree.png')}
          resizeMode="cover"
          style={styles.backgroundImageFill}
        >
            <View style={styles.screenOverlayForLoading} />
            <Text style={styles.errorText}>게시글 정보를 불러올 수 없습니다.</Text>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/images/chat_tree.png')}
        resizeMode="cover"
        style={styles.backgroundImageFill}
      >
        <View style={styles.screenOverlay} />
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <FlatList
            ListHeaderComponent={() => (
              <View style={styles.postOuterContainer}>
                <View style={styles.postInnerContainer}>
                    <View style={styles.titleRow}>
                        <View style={styles.categoryBadge}>
                        <Image source={require('../../assets/images/chat_apple.png')} style={styles.smallAppleIcon} />
                        <Text style={styles.categoryText}>{post.category}</Text>
                        </View>
                        <Text style={styles.title}>{post.title}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>작성자: {post.userId}</Text>
                        <Text style={styles.metaText}>
                        {new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Text>
                    </View>
                    {isPostAuthor && (
                        <View style={styles.authorActionsContainer}>
                        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEditPost}>
                            <Feather name="edit" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeletePost}>
                            <Feather name="trash" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>삭제</Text>
                        </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.contentDivider} />
                    <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContentContainer}>
                        <Text style={styles.body}>{post.content}</Text>
                    </ScrollView>
                    <View style={styles.contentDivider} />
                    <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
                </View>
              </View>
            )}
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.commentsListContainer}
            ListEmptyComponent={
              <View style={styles.emptyCommentsContainer}>
                  <Text style={styles.emptyCommentsText}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
          {editingCommentId === null && (
            <View style={styles.commentInputSection}>
              <TextInput
                placeholder="따뜻한 댓글을 남겨주세요 :)"
                style={styles.input}
                value={commentInput}
                onChangeText={setCommentInput}
                multiline
                placeholderTextColor="#B08D57"
              />
              <TouchableOpacity
                style={[styles.submitButton, (isSubmittingComment || !commentInput.trim()) && styles.submitButtonDisabled]}
                onPress={handleSubmitComment}
                disabled={isSubmittingComment || !commentInput.trim()}
              >
                <Text style={styles.submitButtonText}>{isSubmittingComment ? "등록중" : "등록"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BoardDetail;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backgroundImageFill: { flex: 1 },
  screenOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 247, 240, 0.85)', zIndex: 0 },
  screenOverlayForLoading: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 247, 240, 0.95)', zIndex: 0 },
  keyboardAvoidingContainer: { flex: 1, zIndex: 1 },
  loadingOrErrorContainer: { flex: 1 },
  loadingText: { marginTop: 15, fontSize: 16, color: '#A0522D', textAlign: 'center', zIndex: 1 },
  errorText: { color: '#A0522D', fontSize: 16, textAlign: 'center', padding: 20, zIndex: 1 },
  postOuterContainer: {},
  postInnerContainer: { backgroundColor: 'rgba(255, 253, 250, 0.75)', marginHorizontal: 15, borderRadius: 15, paddingVertical: 15, marginTop: 20, marginBottom: 10, shadowColor: '#B08D57', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  titleRow: { paddingHorizontal: 15, paddingTop: 5, flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFDAB9', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 12, marginRight: 10 },
  smallAppleIcon: { width: 14, height: 14, marginRight: 5 },
  categoryText: { fontSize: 13, color: '#A0522D', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#5D4037', flexShrink: 1 },
  metaRow: { paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0E0D0', paddingBottom: 12 },
  metaText: { fontSize: 12, color: '#8C7B70' },
  authorActionsContainer: { paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginVertical: 10, gap: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 8 },
  editButton: { backgroundColor: '#8FBC8F' },
  deleteButton: { backgroundColor: '#E74C3C' },
  actionButtonText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 5 },
  contentDivider: { marginHorizontal: 15, height: 1, backgroundColor: '#F0E0D0', marginVertical: 15 },
  bodyScroll: { maxHeight: 300 },
  bodyContentContainer: { paddingHorizontal: 15 },
  body: { fontSize: 16, color: '#6B4F4F', lineHeight: 26 },
  commentsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 16, color: '#5D4037', paddingHorizontal: 15 },
  commentsListContainer: { paddingHorizontal: 15, paddingBottom: Platform.OS === 'ios' ? 170 : 150 },
  commentBox: { marginBottom: 16, padding: 15, backgroundColor: 'rgba(255, 250, 245, 0.85)', borderRadius: 10, borderWidth: 1, borderColor: '#F5E5D5', shadowColor: '#B08D57', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2 },
  commentHeaderRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  commentUser: { fontSize: 14, fontWeight: 'bold', color: '#A0522D' },
  commentMeta: { fontSize: 11, color: '#B08D57', marginLeft: 4 },
  commentContent: { fontSize: 14, color: '#6B4F4F', lineHeight: 21 },
  iconButtonGroup: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 12 },
  iconButton: { padding: 4 },
  inputInline: { backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#5D4037', borderRadius: 6, borderWidth: 1, borderColor: '#E0CFC0', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, minHeight: 50, textAlignVertical: 'top', marginBottom: 10 },
  editCommentActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  smallButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  saveButton: { backgroundColor: '#66BB6A' },
  cancelButton: { backgroundColor: '#BDBDBD' },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  commentInputSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0E0D0', backgroundColor: 'rgba(255, 247, 240, 0.95)' },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E0CFC0', paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 12 : 8, marginRight: 10, color: '#5D4037', minHeight: 40, maxHeight: 100, fontSize: 15 },
  submitButton: { backgroundColor: '#D9534F', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#FFB88C' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  emptyCommentsContainer: { paddingVertical: 30, alignItems: 'center' },
  emptyCommentsText: { color: '#B08D57', fontSize: 15 }
});