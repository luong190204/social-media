import { usePostStore } from '@/store/usePostStore';
import React from 'react'
import { toast } from 'sonner';

const DeletePost = ({ post, onClose }) => {

    const 

    const { deletePost, isDeletePostLoading } = usePostStore();
 
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await deletePost(post.id)
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

        <button className="w-full py-3 text-red-500 font-bold hover:hover:bg-gray-50 transition border-b ">
          Xóa bỏ
        </button>

        <button className="w-full py-3 font-medium hover:hover:bg-gray-50 transition">
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}

export default DeletePost
