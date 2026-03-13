'use client';

import { useState, useEffect } from 'react';
import { useUserRole } from '@/lib/providers';
import { 
  getArticleComments, 
  addArticleComment, 
  resolveComment, 
  deleteComment,
  replyToComment 
} from '@/lib/supabase/cms';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageSquare,
  Send,
  Check,
  CheckCircle,
  Circle,
  Trash2,
  Reply,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

function CommentItem({ comment, onResolve, onDelete, onReply, currentUserId, canManage }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const isOwner = comment.user_id === currentUserId;
  // Use user_id to create a simple name since we don't have the join
  const userName = comment.user_id ? `User ${comment.user_id.substring(0, 8)}` : 'Unknown';
  const initials = 'U';
  
  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    setSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className={`group ${comment.is_resolved ? 'opacity-60' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-[#8c52ff]/10 text-[#8c52ff] text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.is_resolved && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </Badge>
            )}
          </div>
          
          <p className="text-sm whitespace-pre-wrap mb-2">
            {comment.content}
          </p>
          
          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!comment.is_resolved && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            
            {canManage && !comment.is_resolved && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-green-600 hover:text-green-700"
                onClick={() => onResolve(comment.id)}
              >
                <Check className="h-3 w-3 mr-1" />
                Resolve
              </Button>
            )}
            
            {(isOwner || canManage) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(comment.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
          </div>
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 ml-0 p-3 bg-muted/50 rounded-lg">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText.trim() || submitting}
                >
                  {submitting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArticleComments({ articleId, className = '' }) {
  const { user, canAccessAdminDashboard } = useUserRole();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(true);
  
  const canManage = canAccessAdminDashboard;
  
  useEffect(() => {
    loadComments();
  }, [articleId]);
  
  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getArticleComments(articleId);
      // Organize comments with replies
      const organized = organizeComments(data);
      setComments(organized);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Organize comments into threads
  const organizeComments = (flatComments) => {
    const commentMap = {};
    const topLevel = [];
    
    // First pass: create map
    flatComments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });
    
    // Second pass: organize into threads
    flatComments.forEach(comment => {
      if (comment.parent_id && commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
      } else {
        topLevel.push(commentMap[comment.id]);
      }
    });
    
    return topLevel;
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    setSubmitting(true);
    try {
      await addArticleComment(articleId, user.id, newComment);
      setNewComment('');
      await loadComments();
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleResolve = async (commentId) => {
    try {
      await resolveComment(commentId, true);
      await loadComments();
      toast.success('Comment resolved');
    } catch (error) {
      toast.error('Failed to resolve comment');
    }
  };
  
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      await loadComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };
  
  const handleReply = async (parentId, content) => {
    if (!user) return;
    await replyToComment(parentId, user.id, content);
    await loadComments();
    toast.success('Reply sent');
  };
  
  const unresolvedCount = comments.filter(c => !c.is_resolved).length;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#8c52ff]" />
            Editorial Notes
            {unresolvedCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unresolvedCount} unresolved
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? 'Hide' : 'Show'}
          </Button>
        </div>
      </CardHeader>
      
      {showComments && (
        <CardContent className="pt-0">
          {/* Add Comment Form */}
          <div className="mb-4 p-3 border rounded-lg bg-muted/30">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a note or feedback for the author..."
              className="min-h-[80px] mb-2"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Notes are visible to editors and the author
              </p>
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim() || submitting || !user}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-1" />
                )}
                Add Note
              </Button>
            </div>
          </div>
          
          {/* Comments List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs">Be the first to add feedback</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <CommentItem
                    comment={comment}
                    onResolve={handleResolve}
                    onDelete={handleDelete}
                    onReply={handleReply}
                    currentUserId={user?.id}
                    canManage={canManage}
                  />
                  
                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-11 mt-3 space-y-3 pl-3 border-l-2 border-muted">
                      {comment.replies.map(reply => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          onResolve={handleResolve}
                          onDelete={handleDelete}
                          onReply={handleReply}
                          currentUserId={user?.id}
                          canManage={canManage}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
