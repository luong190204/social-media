import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore'
import { Camera, Loader, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import PostCard from "../components/PortCard";

const ProfilePage = () => {

  const { userProfile, isLoadingProfile, fetchMyProfile, isUpdatingProfile, updateAvatar } = useUserStore();
  const { posts, isPostsLoading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await updateAvatar(formData);
    
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (isPostsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
        Đang tải bài viết...
      </div>
    );
  }
    
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-10 border-b-2">
        {/* avatar upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={userProfile?.profilePic || "/assets/avatar.jpg"}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-zinc-300"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
            >
              <Camera className="w-5 h-5 " />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : ""}
          </p>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">{userProfile?.username}</h2>
            <button className="px-4 py-1">Chỉnh sửa trang cá nhân</button>
            <button className="p-2 ">{<Settings />}</button>
          </div>

          <div className="flex gap-6 mt-4">
            <span>
              <b>{userProfile?.postsCount || 0}</b> bài viết
            </span>
            <span>
              <b>{userProfile?.followersCount || 0}</b> người theo dõi
            </span>
            <span>
              Đang theo dõi <b>{userProfile?.followingCount || 0}</b> người dùng
            </span>
          </div>

          <div className="mt-4 mb-12">
            <p className="font-medium">{userProfile?.fullName}</p>
            <p className="text-gray-600">{userProfile?.bio}</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage
