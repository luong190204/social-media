import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import PostMoreMenu from "./PostMoreMenu";
import LikeButton from "./LikeButton";
import { usePostStore } from "@/store/usePostStore";
import CommentDialog from "./CommentDialog";
import { useCommentStore } from "@/store/useCommentStore ";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const PortCard = ({ post }) => {

  const toggleLike = usePostStore((state) => state.toggleLikePost);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openComment, setOpenComment] = useState(false);
  
  // Todo: ẩn khi xem profile của người khác
  const { userId } = useParams();
  const { authUser } = useAuthStore();
  const isMyProfile = !userId || userId === authUser?.id;

  // Lấy ra số lượng bình luận từ store
  const { commentCountByPost, fetchCommentCountByPost } = useCommentStore();
  useEffect(() => {
    fetchCommentCountByPost(post.id);
  }, [post.id, fetchCommentCountByPost]);

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

        {isMyProfile ? (
          <Button
            onClick={() => setIsMenuOpen(true)}
            variant="ghost"
            className="h-auto "
          >
            <MoreHorizontal />
          </Button>
        ) : (
          ""
        )}
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
        <div className="relative w-full -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-950">
          <div className="relative w-full">
            {post.mediaUrls[currentImageIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={post.mediaUrls[currentImageIndex]}
                controls
                className="w-full h-auto max-h-[600px] object-contain"
                style={{ aspectRatio: "auto" }}
              />
            ) : (
              <img
                src={post.mediaUrls[currentImageIndex]}
                alt={`post-media-${currentImageIndex}`}
                className="w-full h-auto max-h-[600px] object-contain"
                style={{ aspectRatio: "auto" }}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          {post.mediaUrls.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute top-1/2 left-3 -translate-y-1/2 group"
                  aria-label="Previous image"
                >
                  <div className="p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:scale-110">
                    <ChevronLeft />
                  </div>
                </button>
              )}

              {currentImageIndex < post.mediaUrls.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute top-1/2 right-3 -translate-y-1/2 group"
                  aria-label="Next image"
                >
                  <div className="p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:scale-110">
                    <ChevronRight />
                  </div>
                </button>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.mediaUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Thêm function để jump đến ảnh cụ thể nếu cần
                      setCurrentImageIndex(index);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
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
          onClick={() => setOpenComment(true)}
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

          <span className="text-sm text-gray-600">
            {commentCountByPost[post.id] ?? 0}
          </span>
        </Button>

        <CommentDialog
          post={post}
          open={openComment}
          onClose={() => setOpenComment(false)}
        />
      </div>
    </div>
  );
};

export default PortCard;
