import { useUserStore } from '@/store/useUserStore'
import React, { useEffect, useState } from 'react'

const ProfilePage = () => {

    const { userProfile, isLoadingProfile, fetchMyProfile } = useUserStore();

    useEffect(() => {
        fetchMyProfile();
    }, [])

    if (isLoadingProfile) return <div>Đang tải profile...</div>;
    if (!userProfile) return <div>Không tìm thấy profile</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-10">
        <img
          src={userProfile.avatar || "/assets/default-avatar.png"}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">{userProfile.username}</h2>
            <button className="px-4 py-1 border rounded">
              Chỉnh sửa trang cá nhân
            </button>
            <button className="p-2 border rounded">⚙</button>
          </div>

          <div className="flex gap-6 mt-4">
            <span>
              <b>{userProfile.postsCount || 0}</b> bài viết
            </span>
            <span>
              <b>{userProfile.followersCount || 0}</b> người theo dõi
            </span>
            <span>
              Đang theo dõi <b>{userProfile.followingCount || 0}</b> người dùng
            </span>
          </div>

          <div className="mt-4">
            <p className="font-medium">{userProfile.fullName}</p>
            <p className="text-gray-600">{userProfile.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage
