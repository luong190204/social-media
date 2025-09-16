import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useCommentStore } from '@/store/useCommentStore ';
import { Loader, MoreHorizontal, Plus } from 'lucide-react';
import CommentMoreMenu from './CommentMoreMenu';
import { useAuthStore } from '@/store/useAuthStore';

const CommentList = ({ post, comments, onEditComment, setReplyTo }) => {
  const {
    repliesByComment,
    fetchCommentByPost,
    fetchRepliesByComment,
    isRepliesLoading,
    isCommentLoading,
    deleteComment,
  } = useCommentStore();

  const { authUser } = useAuthStore();

  const [openReplies, setOpenReplies] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const [openMenuId, setOpenMenuId] = useState(null); // id cmt đang mở menu

  useEffect(() => {
    fetchCommentByPost(post.id, 0).then((res) => {
      setTotalPages(res.totalPages);
      setPage(0);
    });
  }, [post.id]);

  const handleViewReplies = (commentId) => {
    const isOpen = openReplies[commentId];

    if (!isOpen) {
      fetchRepliesByComment(commentId);
    }

    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !isOpen,
    }));
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const res = await fetchCommentByPost(post.id, nextPage, 8);

    if (res) {
      setPage(nextPage);
      setTotalPages(res.totalPages);
    }
  };

  if (isCommentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
      {comments?.map((cmt) => {
        const repliesData = repliesByComment?.[cmt.id];
        const replies = repliesData?.items || [];

        const totalReplies = cmt.countReplies || 0;

        const showReplies = openReplies[cmt.id] || false;

        return (
          <div key={cmt.id} className="space-y-2">
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={cmt.authorAvatar} alt={cmt.authorName} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-medium">
                  {cmt.authorName}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 ">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-sm text-gray-900">
                    {cmt.authorName}
                  </span>
                  <span className="text-sm text-gray-800 break-words">
                    {cmt.content}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(cmt.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                  <button
                    className="text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    onClick={() =>
                      setReplyTo({ id: cmt.id, username: cmt.authorName })
                    }
                  >
                    Phản hồi
                  </button>

                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === cmt.id ? null : cmt.id)
                    }
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <MoreHorizontal className="w-4 h-4 " />
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === cmt.id && (
                    <CommentMoreMenu
                      isOpen={true}
                      onClose={() => setOpenMenuId(null)}
                      onEdit={() => onEditComment(cmt)}
                      canEdit={cmt.userId === authUser.id}
                      onDelete={() => deleteComment(post.id, cmt.id)}
                      canDelete={
                        cmt.userId === authUser.id ||
                        post.author.id === authUser.id
                      }
                    />
                  )}
                </div>

                {totalReplies > 0 && (
                  <button
                    className="flex items-center space-x-2 mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => handleViewReplies(cmt.id)}
                  >
                    <div className="w-6 h-px bg-gray-300"></div>
                    <span className="font-medium">
                      {showReplies
                        ? "Ẩn câu trả lời"
                        : `Xem ${totalReplies} câu trả lời`}
                    </span>
                    {isRepliesLoading ? (
                      <>
                        <Loader className="size-5 animate-spin" />
                      </>
                    ) : (
                      ""
                    )}
                  </button>
                )}
              </div>
            </div>

            {showReplies && replies.length > 0 && (
              <div className="ml-11 space-y-2 pb-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-3">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage
                        src={reply.authorAvatar}
                        alt={reply.authorName}
                      />
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs font-medium">
                        {reply.authorName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-semibold text-sm text-gray-900">
                          {reply.authorName}
                        </span>
                        <span className="text-sm text-gray-800 break-words">
                          {reply.content}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                        <button className="text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors">
                          Phản hồi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {page + 1 < totalPages && (
        <div className="flex justify-center my-8">
          <button
            onClick={handleLoadMore}
            className="text-gray-800  mt-2 border-2 border-gray-600 rounded-full p-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </ScrollArea>
  );
};

export default CommentList
