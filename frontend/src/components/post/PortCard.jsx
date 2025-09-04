import React, { useState } from "react";
import { Button } from "../ui/button";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import PostMoreMenu from "./PostMoreMenu";
import LikeButton from "./LikeButton";
import { usePostStore } from "@/store/usePostStore";

const PortCard = ({ post }) => {

  const toggleLike = usePostStore((state) => state.toggleLikePost);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToPrevious = () => {
    const newIndex =
      currentImageIndex === 0
        ? post.mediaUrls.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex =
      currentImageIndex === post.mediaUrls.length - 1
        ? 0
        : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  return (
    <div className="bg-white shadow rounded-3xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profilePic}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <span className="font-semibold">{post.author?.username}</span>
            {post.createdAt && (
              <>
                <span className="text-gray-500 mx-1">•</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => setIsMenuOpen(true)}
          variant="ghost"
          className="h-auto "
        >
          <MoreHorizontal />
        </Button>
      </div>

      <PostMoreMenu
        isOpen={isMenuOpen}
        post={post}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Content */}
      {post.content && <p className="mb-3">{post.content}</p>}

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative w-full rounded-xl overflow-hidden">
          <div className="w-ful max-h-[600px] flex justify-center items-center bg-black rounded-xl overflow-hidden">
            {post.mediaUrls[currentImageIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={post.mediaUrls[currentImageIndex]}
                controls
                className="max-h-[600px] w-auto rounded-xl"
              />
            ) : (
              <img
                src={post.mediaUrls[currentImageIndex]}
                alt={`post-media-${currentImageIndex}`}
                className="max-h-[600px] w-auto rounded-xl"
              />
            )}
          </div>

          {currentImageIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {currentImageIndex < post.mediaUrls.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center  text-gray-600">
        <LikeButton
          postId={post.id}
          initialCount={post.totalLikes}
          initialLiked={post.likedByMe}
          onToggle={async () => {
            await toggleLike(post.id);
          }}
        />
        <Button
          variant="outline"
          className="flex items-center gap-1 hover:text-blue-500 border-none [&_svg]:!w-6 [&_svg]:!h-6 "
        >
          <svg
            aria-label="Comment"
            class="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default PortCard;
