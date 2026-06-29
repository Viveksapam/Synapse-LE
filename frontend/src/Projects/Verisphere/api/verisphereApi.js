import { API_BASE } from '../../../api/config';
import { mockCommunities, mockComments, mapBlogToPost } from './verisphereMocks';

const VIVEK_USER_ID = 3;

const blogIdFromString = (idOrString) => {
  const strId = String(idOrString);
  return strId.startsWith('blog_') ? parseInt(strId.replace('blog_', ''), 10) : parseInt(strId, 10);
};

const noCacheHeaders = { 'Cache-Control': 'no-cache', Pragma: 'no-cache' };

export const fetchCommunities = async () => mockCommunities;

export const fetchCommunityDetail = async (numId) => {
  const objCommunity = mockCommunities.find((c) => c.id === parseInt(numId, 10));
  if (!objCommunity) throw new Error('Community not found');
  return objCommunity;
};

export const postCreateCommunity = async (objCommunityData) => {
  const objNew = { id: Date.now(), ...objCommunityData, member_count: 1 };
  mockCommunities.push(objNew);
  return objNew;
};

export const postJoinCommunity = async () => ({ status: 'joined' });

export const fetchPosts = async (numCommunityId = null) => {
  try {
    const objResponse = await fetch(`${API_BASE}/verisphere/blogs/`, { headers: noCacheHeaders });
    if (!objResponse.ok) return [];
    const arrBlogs = await objResponse.json();
    let arrPosts = arrBlogs.map(mapBlogToPost);
    arrPosts.sort((a, b) => b.numUpvotes - a.numUpvotes);
    if (numCommunityId) {
      arrPosts = arrPosts.filter(
        (p) => p.objCommunity === parseInt(numCommunityId, 10) || p.objCommunity === String(numCommunityId)
      );
    }
    return arrPosts;
  } catch (objErr) {
    console.error('Failed to fetch blogs for verisphere', objErr);
    return [];
  }
};

export const postToggleFeatured = async (numPostId, boolCurrentlyFeatured, strToken) => {
  const numBlogId = blogIdFromString(numPostId);
  try {
    const objResponse = await fetch(`${API_BASE}/verisphere/blogs/featured/${numBlogId}`, {
      method: boolCurrentlyFeatured ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${strToken}` },
    });
    return objResponse.ok;
  } catch (objErr) {
    console.error('Failed to toggle featured status', objErr);
    return false;
  }
};

export const fetchPostDetail = async (idOrString) => {
  const numBlogId = blogIdFromString(idOrString);
  const objResponse = await fetch(`${API_BASE}/verisphere/blogs/`, { headers: noCacheHeaders });
  if (!objResponse.ok) throw new Error('Post not found');
  const arrBlogs = await objResponse.json();
  const objBlog = arrBlogs.find((b) => b.id === numBlogId);
  if (!objBlog) throw new Error('Post not found');
  return { ...mapBlogToPost(objBlog), comments: mockComments };
};

export const postCreatePost = async (objPostData) => ({
  id: `blog_${Date.now()}`,
  ...objPostData,
  author_name: 'CurrentUser',
  created_at: new Date().toISOString(),
  score: 0, comments_count: 0,
});

export const postCreateSource = async (numPostId, objSourceData) => ({
  id: Date.now(), ...objSourceData, reliability_score: 80,
});

export const postCreateComment = async (numPostId, objCommentData) => {
  const objNew = {
    id: Date.now(), ...objCommentData,
    author_name: 'CurrentUser',
    created_at: new Date().toISOString(), score: 0,
  };
  mockComments.push(objNew);
  return objNew;
};

export const postVote = async () => ({ success: true });

export const fetchPostReactions = async (numPostId) => {
  const numBlogId = blogIdFromString(numPostId);
  try {
    const objResponse = await fetch(`${API_BASE}/verisphere/blogs/${numBlogId}/reactions?user_id=${VIVEK_USER_ID}`);
    if (objResponse.ok) return await objResponse.json();
  } catch (objErr) {
    console.error('Failed to fetch reactions', objErr);
  }
  return { reactions: {}, user_reacted: {} };
};

export const postToggleReaction = async (numPostId, strEmoji) => {
  const numBlogId = blogIdFromString(numPostId);
  try {
    const objResponse = await fetch(`${API_BASE}/verisphere/blogs/${numBlogId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji: strEmoji, user_id: VIVEK_USER_ID }),
    });
    if (objResponse.ok) return await objResponse.json();
  } catch (objErr) {
    console.error('Failed to toggle reaction', objErr);
  }
  return { status: 'error' };
};

export const postAnalyzeContext = async () => ({ summary: 'Mock AI analysis of the post context.' });
export const postAnalyzeComment = async () => ({ analysis: 'Mock AI analysis of the comment logic.', is_fallacy: false });
