import { useCommentStore } from '@/store/useCommentStore ';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';

const CommentInput = ({
  postId,
  editingComment,
  onSubmitSuccess,
  replyTo,
  onClearReply,
}) => {
  const { commentPost, updateComment } = useCommentStore();

  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingComment) setContent(editingComment.content);
    else setContent("");
  }, [editingComment]);

  const handleSubmit = async (e) => {
    if (!content.trim()) {
      return;
    }

    try {
      if (editingComment) {
        await updateComment(editingComment.id, { content });
      } else {
        await commentPost(postId, { 
          content, 
          parentId: replyTo ? replyTo.id : null,
         });
      }

      setContent("");
      onClearReply();
      onSubmitSuccess();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi bình luận!");
      console.error("Create post error:", error);
    }
  };

  return (
    <div className="border-t flex flex-col gap-1 p-3">
      {replyTo && (
        <div className="text-xs text-gray-500 mb-1">
          Đang trả lời <span className="font-medium">@{replyTo.username}</span>
          <button
            onClick={onClearReply}
            className="ml-2 text-red-500 hover:underline text-xs"
          >
            Hủy
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleSubmit}
        >
          {editingComment ? "Cập nhật" : "Gửi"}
        </Button>
      </div>
    </div>
  );
};

export default CommentInput
