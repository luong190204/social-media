import { usePostStore } from '@/store/usePostStore';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DeletePost = ({ post, onClose }) => {

    const navigate = useNavigate(); 
    const { deletePost, isDeletePostLoading } = usePostStore();
 
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await deletePost(post.id)
            navigate("/profile");
        } catch (error) {
            toast.error("Xóa bài viết thất bại!")
        }
    }

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/80 p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[560px] w-full h-auto overflow-hidden mt-[20vh]">
        <div className="py-8 px-6 text-center border-b ">
          <h2 className="font-normal text-xl">Xóa bài viết?</h2>
          <p className="text-sm text-gray-800-300 mt-1">
            Bạn có chắc chắn muốn xóa bài viết này không?
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-red-500 font-bold hover:hover:bg-gray-50 transition border-b flex items-center justify-center gap-2"
        >
          {isDeletePostLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Delete...
            </>
          ) : (
            "Xóa bỏ"
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 font-medium hover:hover:bg-gray-50 transition"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}

export default DeletePost
