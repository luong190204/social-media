import { usePostStore } from '@/store/usePostStore';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Image, Loader, Loader2, X } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const { createPost, isCreatePostLoading } = usePostStore();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 10) {
      toast.warning("Chỉ được tải lên tối đa 10 file!");
      return;
    }

    setFiles(Array.from(e.target.files));
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && files.length === 0) {
      toast.warning("Bài post phải có nội dung hoặc media!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify({ content })], {
          type: "application/json",
        })
      );
      files.forEach((file) => formData.append("files", file));

      await createPost(formData);

      setContent("");
      setFiles([]);

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      toast.success("Đăng bài thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng bài!");
      console.error("Create post error:", error);
    }
  };

  // Cleanup object URLs để tránh memory leak
  const cleanupObjectUrls = () => {
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      URL.revokeObjectURL(url);
    });
  };

  // Cleanup khi component unmount hoặc files thay đổi
  React.useEffect(() => {
    return () => cleanupObjectUrls();
  }, [files]);

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full p-3 pb-10 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {content.length}/500
          </div>

          <label
            htmlFor="image-upload"
            className="flex items-center absolute bottom-7 left-0 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
          >
            <img src="/assets/icon_anh.png"/>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className='text-sm text-gray-500 pl-2'>Ảnh/video</span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={index} className="relative group">
                  {file.type.startsWith("video/") ? (
                    <video
                      src={url}
                      controls
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isCreatePostLoading}
            className="bg-blue-400 hover:bg-blue-500 text-while font-medium py-2.5 px-4 rounded-lg text-sm 
              transition-colors disabled:cursor-not-allowed disabled:hover:bg-blue-300 h-auto"
          >
            {isCreatePostLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Đang đăng...
              </>
            ) : (
              "Đăng bài"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost
