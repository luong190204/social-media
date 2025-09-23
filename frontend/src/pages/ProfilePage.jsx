import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
import { Camera, Home, Loader, LocateFixed, LocateIcon, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

import PostCard from "../components/post/PortCard";
import CreatePost from "@/components/post/CreatePost";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

  const navigate = useNavigate();

  const {
    userProfile,
    isLoadingProfile,
    fetchMyProfile,
    isUpdatingProfile,
    updateAvatar,
  } = useUserStore();
  const { posts, isPostsLoading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await updateAvatar(formData);
  };

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
            <button
              className="px-4 py-1 flex items-center gap-2"
              onClick={() => navigate("/edit-profile")}
            >
              <span>Chỉnh sửa trang cá nhân</span>
              <p>
                <Settings size={18} />
              </p>
            </button>
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

          <div className="mt-4 mb-12 space-y-2">
            <p className="font-medium">{userProfile?.fullName}</p>
            <p className="text-gray-600">{userProfile?.bio}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {userProfile?.location}
            </p>
          </div>
        </div>
      </div>

      <CreatePost />

      <div className="max-w-xl mx-auto mt-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
