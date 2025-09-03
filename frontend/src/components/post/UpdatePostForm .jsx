import { usePostStore } from '@/store/usePostStore';
import { ChevronLeft, ChevronRight, Loader2, Play, X } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UpdatePostForm = ({ post, onClose }) => {
    
    //const navigate = useNavigate();

    const { updatePost, isUpdatePostLoading } = usePostStore();
    const [content, setContent] = useState(post?.content || '');
    const [mediaUrls, setMediaUrls] = useState(post?.mediaUrls || []);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updatePost(post.id, { content, mediaUrls });

        onClose();
      } catch (error) {
        toast.error("Cập nhật thất bại");
      }
    };

    const nextMedia = () => {
        if (currentMediaIndex < mediaUrls.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    };

    const prevMedia = () => {
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    };

    // TODO: update thêm chuyển về post chi tiết
    // const handleClose = () => {
    //   navigate(`/posts/${post.id}`);
    // }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">

        {/* Media Section - Left Side */}
        <div className="flex-1 bg-black relative flex items-center justify-center min-h-[500px]">
          {mediaUrls.length > 0 && (
            <>
              <div className="relative w-full h-full flex items-center justify-center">
                {mediaUrls[currentMediaIndex]?.endsWith(".mp4") ? (
                  <video
                    src={mediaUrls[currentMediaIndex]}
                    controls
                    className="max-w-full max-h-full object-contain"
                    key={currentMediaIndex}
                  />
                ) : (
                  <img
                    src={mediaUrls[currentMediaIndex]}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                )}

                {/* Media Navigation */}
                {mediaUrls.length > 1 && (
                  <>
                    {currentMediaIndex > 0 && (
                      <button
                        type="button"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                        onClick={prevMedia}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    {currentMediaIndex < mediaUrls.length - 1 && (
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                        onClick={nextMedia}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}

                {/* Media Counter */}
                {mediaUrls.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentMediaIndex + 1} / {mediaUrls.length}
                  </div>
                )}
              </div>

              {/* Media Thumbnails */}
              {mediaUrls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                  {mediaUrls.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                        currentMediaIndex === index
                          ? "border-white"
                          : "border-transparent opacity-60"
                      }`}
                      onClick={() => setCurrentMediaIndex(index)}
                    >
                      {url.endsWith(".mp4") ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div className="w-96 flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Chỉnh sửa bài viết</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex-1 p-4 ">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung bài viết
                </label>

                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={8}
                  maxLength={500}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chia sẻ suy nghĩ của bạn..."
                />

                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">Tối đa 500 ký tự</div>
                  <div
                    className={`text-xs ${
                      content.length > 450 ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {content.length}/500
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onclose}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdatePostLoading || content.trim() === ""}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isUpdatePostLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Update...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostForm 
