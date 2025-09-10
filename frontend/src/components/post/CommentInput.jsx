import { useCommentStore } from '@/store/useCommentStore ';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';

const CommentInput = ({ postId, editingComment, onSubmitSuccess }) => {

    const { commentPost, updateComment } = useCommentStore();

    const [content, setContent] = useState("");

    useEffect(() => {
        if (editingComment) setContent(editingComment.content);
        else setContent("");
    }, [editingComment])

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!content.trim()) {
        return;
      }

      try {
        if (editingComment) {
            await updateComment(postId, { content });
        } else {
            await commentPost(postId, { content });
        }

        setContent("");
        onSubmitSuccess();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi bình luận!");
        console.error("Create post error:", error);
      }
    }; 

  return (
    <div className="border-t flex items-center p-3 gap-2">
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
  );
}

export default CommentInput
